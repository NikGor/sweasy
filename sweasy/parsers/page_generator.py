"""AI-powered page generator.

Reads Instagram archive, feeds posts to GPT-4.1 via Structured Output,
and produces a PageConfig JSON that the React frontend renders.
Images are copied from the archive into the frontend public directory.
"""
from __future__ import annotations

import json
import logging
import os
import shutil
from pathlib import Path

import dotenv
from google import genai
from google.genai import types
from openai import OpenAI

dotenv.load_dotenv()

from .models import PostData, ProfileData
from .page_models import PageConfig

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are a creative director building a premium landing page for a Swiss travel guide.
You receive Instagram profile data and recent posts. Your job is to generate
a complete page configuration that feels like a high-end editorial experience.

Design principles:
- "The Alpine Curator" aesthetic: premium Instagram meets luxury editorial
- Punchy, uppercase headlines with tight tracking
- High-energy accent colors: #FF2D55 (pink), #00FF9D (acid green), #FF6675 (coral)
- Background classes use the Material Design token system:
  bg-primary (#001b44), bg-primary-container (#002f6c),
  bg-secondary (#006971), bg-tertiary-container (#6a001a),
  bg-[#FF2D55], bg-[#00FF9D], bg-[#6A001A], bg-[#FF6675]
- Text colors: text-white, text-primary, text-on-surface-variant
- Rotate classes: -rotate-2, -rotate-1, rotate-1, rotate-2
- Content language: Russian (this is a Russian-speaking guide)
- The mood_bar.status should reflect the emotional tone of the latest posts
- Hero badges should be catchy Russian phrases about the guide's vibe
- Feed posts use the provided local image paths and create punchy captions from the originals
- Facts: generate exactly 9 cards. Extract real facts from the Instagram posts —
  places mentioned, activities described, Swiss culture references, travel tips.
  Mix in interesting Switzerland facts that relate to the content.
  Each fact should feel connected to the guide's actual experience, not generic Wikipedia.
- CTA headline should be inspiring and action-oriented

TOURS section:
- If posts contain tour announcements, extract them as tour cards
- If no explicit tours found, create exactly 3 tours based on interesting Swiss locations
  mentioned or implied in the posts (hiking spots, lakes, mountains, cities)
- Each tour needs a title, short description, image_url (use one of the provided /media/ paths),
  and a badge
- Do NOT include dates — tours are evergreen
- Tour descriptions should be enticing and short (1-2 sentences)

IMPORTANT: Use EXACTLY the image paths provided for each post (they start with /media/).
For hero image_url, pick the most visually impactful post's image path.
For live_feed posts and tours, use the image paths as given.
CRITICAL: Tour image_url values MUST NOT overlap with live_feed post image_url values.
Use different images for tours and feed — no duplicates between sections.

Keep the energy high, the copy sharp, and the design bold.
"""


def load_archive(archive_dir: str | Path) -> tuple[ProfileData, list[PostData]]:
    """Load profile and posts from the Instagram archive."""
    archive_dir = Path(archive_dir)

    profile_path = archive_dir / "profile.json"
    profile = ProfileData.model_validate_json(profile_path.read_text())

    posts: list[PostData] = []
    posts_dir = archive_dir / "posts"
    if posts_dir.exists():
        for post_dir in sorted(posts_dir.iterdir(), reverse=True):
            post_json = post_dir / "post.json"
            if post_json.exists():
                posts.append(PostData.model_validate_json(post_json.read_text()))

    return profile, posts


def copy_media(
    archive_dir: Path,
    posts: list[PostData],
    media_dir: Path,
) -> dict[str, str]:
    """Copy post images from archive to frontend public/media/.

    Returns a mapping of shortcode -> local URL path (e.g. /media/CYWp61nNVxe.jpg).
    """
    media_dir.mkdir(parents=True, exist_ok=True)
    shortcode_to_url: dict[str, str] = {}

    for post in posts:
        if not post.media:
            continue
        # Use first image from each post
        first_media = post.media[0]
        # Find the post directory by matching shortcode in dir name
        posts_dir = archive_dir / "posts"
        post_dirs = [d for d in posts_dir.iterdir() if post.shortcode in d.name]
        if not post_dirs:
            continue

        src = post_dirs[0] / first_media.path
        if not src.exists():
            continue

        ext = src.suffix or ".jpg"
        dest = media_dir / f"{post.shortcode}{ext}"
        shutil.copy2(src, dest)

        local_url = f"/media/{post.shortcode}{ext}"
        shortcode_to_url[post.shortcode] = local_url
        logger.debug("Copied %s -> %s", src, dest)

    logger.info("Copied %d images to %s", len(shortcode_to_url), media_dir)
    return shortcode_to_url


def build_prompt(
    profile: ProfileData,
    posts: list[PostData],
    image_urls: dict[str, str],
    n: int = 10,
) -> str:
    """Build the user prompt from profile and recent posts."""
    recent = posts[:n]

    lines = [
        f"## Instagram Profile: @{profile.account}",
        f"Name: {profile.display_name}",
        f"Bio: {profile.bio}",
        f"Followers: {profile.followers_count} | Posts: {profile.posts_count}",
        "",
        f"## Latest {len(recent)} Posts (newest first):",
        "",
    ]

    for i, post in enumerate(recent):
        local_image = image_urls.get(post.shortcode, "")
        lines.append(f"### Post {i + 1} ({post.published_at.strftime('%Y-%m-%d')})")
        lines.append(f"Type: {post.post_type}")
        lines.append(f"Caption: {post.caption}")
        lines.append(f"Likes: {post.metrics.like_count}")
        lines.append(f"Image path: {local_image}")
        lines.append(f"Hashtags: {', '.join(post.hashtags)}")
        lines.append("")

    lines.append(
        "Generate a complete PageConfig for this guide's landing page. "
        "Use the exact local image paths provided above for hero.image_url and live_feed posts image_url. "
        "Pick the best image for the hero. "
        "The mood and copy should reflect this specific guide's personality and content."
    )

    return "\n".join(lines)


UPSCALE_PROMPT = (
    "Ultra-realistic 8K landscape photography, highly detailed foliage, rocks, "
    "water and sky textures, natural volumetric lighting, cinematic depth of field, "
    "photorealistic, masterpiece, exact composition and framing as the uploaded photo, "
    "preserve all original details and proportions"
)


def upscale_hero(source_path: Path, output_path: Path) -> Path:
    """Upscale hero image to 4K using Gemini Imagen (Nano Banana Pro)."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set, skipping hero upscale")
        return source_path

    client = genai.Client(api_key=api_key)

    source_bytes = source_path.read_bytes()
    import mimetypes
    mime_type = mimetypes.guess_type(str(source_path))[0] or "image/jpeg"

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_bytes(data=source_bytes, mime_type=mime_type),
                types.Part.from_text(text=UPSCALE_PROMPT),
            ],
        ),
    ]

    config = types.GenerateContentConfig(
        image_config=types.ImageConfig(
            image_size="4K",
        ),
        response_modalities=["IMAGE", "TEXT"],
    )

    data_buffer = b""
    out_ext = ".png"
    for chunk in client.models.generate_content_stream(
        model="gemini-3-pro-image-preview",
        contents=contents,
        config=config,
    ):
        if chunk.parts is None:
            continue
        part = chunk.parts[0]
        if part.inline_data and part.inline_data.data:
            data_buffer += part.inline_data.data
            if part.inline_data.mime_type:
                out_ext = mimetypes.guess_extension(part.inline_data.mime_type) or ".png"

    if not data_buffer:
        logger.warning("Gemini returned no image data, using original")
        return source_path

    output_path = output_path.with_suffix(out_ext)
    output_path.write_bytes(data_buffer)
    logger.info("Hero upscaled to 4K: %s (%d bytes)", output_path, len(data_buffer))
    return output_path


def generate_page(
    archive_dir: str | Path = "instagram_archive",
    output_path: str | Path = "frontend/public/page.json",
    num_posts: int = 10,
    api_key: str | None = None,
) -> PageConfig:
    """Generate a page configuration from Instagram archive using GPT-4.1."""
    api_key = api_key or os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is required")

    archive_path = Path(archive_dir)
    output = Path(output_path)

    profile, posts = load_archive(archive_path)
    recent = posts[:num_posts]

    # Copy images to frontend/public/media/
    media_dir = output.parent / "media"
    image_urls = copy_media(archive_path, recent, media_dir)

    user_prompt = build_prompt(profile, recent, image_urls, n=num_posts)

    logger.info("Generating page from %d posts for @%s", len(recent), profile.account)

    client = OpenAI(api_key=api_key)

    response = client.responses.parse(
        model="gpt-4.1",
        instructions=SYSTEM_PROMPT,
        input=[{"role": "user", "content": user_prompt}],
        text_format=PageConfig,
    )

    page = response.output_parsed

    if not page:
        raise ValueError("AI did not return structured output")

    # Upscale hero image to 4K
    hero_filename = Path(page.hero.image_url).name  # e.g. CYWp61nNVxe.jpg
    hero_source = media_dir / hero_filename
    if hero_source.exists():
        hero_stem = hero_source.stem + "_4k"
        hero_out = media_dir / hero_stem
        upscaled = upscale_hero(hero_source, hero_out)
        page.hero.image_url = f"/media/{upscaled.name}"

    page_data = page.model_dump(by_alias=True)

    # Save to file
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(page_data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    logger.info("Page config saved to %s", output)

    # Save to DB
    from sweasy.models import PageSnapshot
    PageSnapshot.objects.create(data=page_data)
    logger.info("Page config saved to database")

    return page
