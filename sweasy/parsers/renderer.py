from __future__ import annotations

import csv
import json
from pathlib import Path

from .models import PostData


def generate_indexes(archive_dir: Path, posts: list[PostData]) -> None:
    """Generate posts_index.jsonl and posts_index.csv from post data."""
    sorted_posts = sorted(posts, key=lambda p: p.published_at, reverse=True)

    # JSONL
    jsonl_path = archive_dir / "posts_index.jsonl"
    with open(jsonl_path, "w", encoding="utf-8") as f:
        for post in sorted_posts:
            line = json.dumps(
                {
                    "post_id": post.post_id,
                    "shortcode": post.shortcode,
                    "post_type": post.post_type,
                    "published_at": post.published_at.isoformat(),
                    "caption_preview": post.caption[:100] if post.caption else "",
                    "like_count": post.metrics.like_count,
                    "comment_count": post.metrics.comment_count,
                    "media_count": len(post.media),
                    "folder": f"posts/{post.published_at.strftime('%Y-%m-%d')}_{post.shortcode}",
                },
                ensure_ascii=False,
            )
            f.write(line + "\n")

    # CSV
    csv_path = archive_dir / "posts_index.csv"
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["post_id", "date", "type", "caption_preview", "folder"]
        )
        for post in sorted_posts:
            writer.writerow(
                [
                    post.post_id,
                    post.published_at.strftime("%Y-%m-%d"),
                    post.post_type,
                    (post.caption[:100] if post.caption else "").replace(
                        "\n", " "
                    ),
                    f"posts/{post.published_at.strftime('%Y-%m-%d')}_{post.shortcode}",
                ]
            )


def generate_preview_html(post_dir: Path, post: PostData) -> None:
    """Generate a self-contained preview.html for a single post."""
    media_html_parts: list[str] = []
    for item in post.media:
        if item.type == "image":
            media_html_parts.append(
                f'<img src="{item.path}" alt="Post image" '
                f'style="max-width:100%;margin:8px 0;border-radius:8px;">'
            )
        elif item.type == "video":
            poster = f' poster="{item.thumbnail_path}"' if item.thumbnail_path else ""
            media_html_parts.append(
                f"<video controls{poster} "
                f'style="max-width:100%;margin:8px 0;border-radius:8px;">'
                f'<source src="{item.path}" type="video/mp4">'
                f"</video>"
            )

    media_section = "\n".join(media_html_parts)
    caption_escaped = (
        post.caption.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br>")
    )

    view_count_line = ""
    if post.metrics.view_count is not None:
        view_count_line = f" &middot; {post.metrics.view_count:,} views"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{post.shortcode} — Instagram Post</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
         max-width: 600px; margin: 40px auto; padding: 0 16px; color: #262626; }}
  .meta {{ color: #8e8e8e; font-size: 14px; margin-bottom: 12px; }}
  .caption {{ white-space: pre-wrap; line-height: 1.5; margin: 16px 0; }}
  .metrics {{ color: #8e8e8e; font-size: 14px; margin-top: 12px; }}
</style>
</head>
<body>
<div class="meta">
  <strong>{post.post_type}</strong> &middot; {post.published_at.strftime("%Y-%m-%d %H:%M")}
</div>
{media_section}
<div class="caption">{caption_escaped}</div>
<div class="metrics">
  ❤️ {post.metrics.like_count:,} &middot; 💬 {post.metrics.comment_count:,}{view_count_line}
</div>
</body>
</html>"""

    preview_path = post_dir / "preview.html"
    preview_path.write_text(html, encoding="utf-8")
