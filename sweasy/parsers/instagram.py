from __future__ import annotations

import logging
import os
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

import requests

from .models import MediaItem, PostData, PostMetrics, ProfileData
from .renderer import generate_indexes, generate_preview_html

logger = logging.getLogger(__name__)

GRAPH_API_BASE = "https://graph.instagram.com/v22.0"


def _parse_timestamp(ts: str) -> datetime:
    """Parse Instagram API timestamp like 2026-04-01T12:00:00+0000."""
    # Normalize timezone offset: +0000 -> +00:00 for Python 3.10 compat
    ts = re.sub(r'([+-])(\d{2})(\d{2})$', r'\1\2:\3', ts)
    ts = ts.replace("Z", "+00:00")
    return datetime.fromisoformat(ts)


class InstagramScraper:
    """Instagram scraper using the Instagram Graph API with Instagram Login."""

    def __init__(
        self,
        output_dir: str | Path = "instagram_archive",
        access_token: str | None = None,
    ):
        self.output_dir = Path(output_dir)
        self.access_token = access_token or os.getenv("INSTA_TOKEN", "")
        if not self.access_token:
            raise ValueError(
                "Instagram access token is required. "
                "Set INSTA_TOKEN env variable or pass access_token parameter."
            )
        self._session = requests.Session()

    def _api_get(self, endpoint: str, params: dict | None = None) -> dict:
        """Make an authenticated GET request to the Instagram Graph API."""
        params = params or {}
        params["access_token"] = self.access_token
        url = f"{GRAPH_API_BASE}{endpoint}"
        resp = self._session.get(url, params=params, timeout=30)
        if resp.status_code == 401:
            raise ValueError("Instagram token is invalid or expired.")
        if resp.status_code == 429:
            raise ValueError("Rate limited by Instagram API. Try again later.")
        resp.raise_for_status()
        return resp.json()

    def scrape_profile(self, _username: str | None = None) -> ProfileData:
        """Load profile metadata and download avatar.

        With Instagram Login API, /me returns the token owner's profile.
        """
        fields = (
            "user_id,username,name,biography,profile_picture_url,"
            "followers_count,follows_count,media_count,website"
        )
        data = self._api_get("/me", {"fields": fields})

        self.output_dir.mkdir(parents=True, exist_ok=True)

        avatar_path = ""
        pic_url = data.get("profile_picture_url")
        if pic_url:
            avatar_path = "avatar.jpg"
            self._download_file(pic_url, self.output_dir / avatar_path)

        profile = ProfileData(
            account=data.get("username", ""),
            display_name=data.get("name", ""),
            bio=data.get("biography", ""),
            external_url=data.get("website", ""),
            followers_count=data.get("followers_count", 0),
            following_count=data.get("follows_count", 0),
            posts_count=data.get("media_count", 0),
            avatar_path=avatar_path,
            scraped_at=datetime.now(timezone.utc),
        )

        profile_path = self.output_dir / "profile.json"
        profile_path.write_text(
            profile.model_dump_json(indent=2), encoding="utf-8"
        )
        logger.info("Profile saved: %s", profile_path)
        return profile

    def scrape_posts(
        self,
        _username: str | None = None,
        *,
        last: int | None = None,
        since: datetime | None = None,
        until: datetime | None = None,
    ) -> list[PostData]:
        """Scrape posts via the Instagram Graph API."""
        fields = (
            "id,caption,media_type,media_url,thumbnail_url,"
            "permalink,timestamp,like_count,comments_count"
        )
        posts_dir = self.output_dir / "posts"
        posts_dir.mkdir(parents=True, exist_ok=True)

        results: list[PostData] = []
        next_url: str | None = None
        first_page = True

        while True:
            if first_page:
                data = self._api_get("/me/media", {"fields": fields, "limit": "50"})
                first_page = False
            else:
                assert next_url is not None
                resp = self._session.get(next_url, timeout=30)
                resp.raise_for_status()
                data = resp.json()

            for item in data.get("data", []):
                pub_date = _parse_timestamp(item["timestamp"])

                if until and pub_date > until:
                    continue
                if since and pub_date < since:
                    generate_indexes(self.output_dir, results)
                    return results

                post_data = self._process_post(item, posts_dir)
                results.append(post_data)
                logger.info(
                    "Saved post %d: %s", len(results), post_data.shortcode
                )

                if last and len(results) >= last:
                    generate_indexes(self.output_dir, results)
                    return results

            next_url = data.get("paging", {}).get("next")
            if not next_url:
                break

        generate_indexes(self.output_dir, results)
        return results

    def _process_post(self, item: dict, posts_dir: Path) -> PostData:
        """Process a single post from the API response."""
        pub_date = _parse_timestamp(item["timestamp"])
        permalink = item.get("permalink", "")
        shortcode = self._extract_shortcode(permalink)
        date_str = pub_date.strftime("%Y-%m-%d")
        folder_name = f"{date_str}_{shortcode}"
        post_dir = posts_dir / folder_name
        media_dir = post_dir / "media"
        media_dir.mkdir(parents=True, exist_ok=True)

        media_type = item.get("media_type", "IMAGE")
        post_type = self._map_media_type(media_type)

        media_items = self._download_media(item, post_type, media_dir)

        caption = item.get("caption", "") or ""
        hashtags = re.findall(r"#(\w+)", caption)
        mentions = re.findall(r"@(\w+)", caption)

        post_data = PostData(
            post_id=item["id"],
            shortcode=shortcode,
            url=permalink,
            post_type=post_type,
            published_at=pub_date,
            caption=caption,
            hashtags=hashtags,
            mentions=mentions,
            metrics=PostMetrics(
                like_count=item.get("like_count", 0),
                comment_count=item.get("comments_count", 0),
            ),
            media=media_items,
            scraped_at=datetime.now(timezone.utc),
        )

        # Save post.json
        post_json_path = post_dir / "post.json"
        post_json_path.write_text(
            post_data.model_dump_json(indent=2), encoding="utf-8"
        )

        # Save caption.txt
        caption_path = post_dir / "caption.txt"
        caption_path.write_text(caption, encoding="utf-8")

        # Generate preview.html
        generate_preview_html(post_dir, post_data)

        return post_data

    def _map_media_type(self, media_type: str) -> str:
        return {
            "IMAGE": "image",
            "VIDEO": "video",
            "CAROUSEL_ALBUM": "carousel",
        }.get(media_type, "image")

    def _extract_shortcode(self, permalink: str) -> str:
        """Extract shortcode from permalink like https://www.instagram.com/p/ABC123/"""
        match = re.search(r"/(?:p|reel)/([A-Za-z0-9_-]+)", permalink)
        return match.group(1) if match else permalink.rstrip("/").split("/")[-1]

    def _download_media(
        self,
        item: dict,
        post_type: str,
        media_dir: Path,
    ) -> list[MediaItem]:
        items: list[MediaItem] = []

        if post_type == "carousel":
            children = self._api_get(
                f"/{item['id']}/children",
                {"fields": "media_type,media_url,thumbnail_url"},
            )
            for order, child in enumerate(children.get("data", []), start=1):
                child_type = child.get("media_type", "IMAGE")
                media_url = child.get("media_url", "")
                if not media_url:
                    continue

                if child_type == "VIDEO":
                    filename = f"video_{order:02d}.mp4"
                    self._download_file(media_url, media_dir / filename)
                    mi = MediaItem(
                        order=order,
                        type="video",
                        path=f"media/{filename}",
                    )
                    thumb_url = child.get("thumbnail_url")
                    if thumb_url:
                        cover_name = f"video_{order:02d}_cover.jpg"
                        self._download_file(thumb_url, media_dir / cover_name)
                        mi.thumbnail_path = f"media/{cover_name}"
                    items.append(mi)
                else:
                    filename = f"image_{order:02d}.jpg"
                    self._download_file(media_url, media_dir / filename)
                    items.append(
                        MediaItem(
                            order=order,
                            type="image",
                            path=f"media/{filename}",
                        )
                    )

        elif post_type == "video":
            media_url = item.get("media_url", "")
            if media_url:
                filename = "video_01.mp4"
                self._download_file(media_url, media_dir / filename)
                mi = MediaItem(order=1, type="video", path=f"media/{filename}")
                thumb_url = item.get("thumbnail_url")
                if thumb_url:
                    cover_name = "cover.jpg"
                    self._download_file(thumb_url, media_dir / cover_name)
                    mi.thumbnail_path = f"media/{cover_name}"
                items.append(mi)

        else:  # image
            media_url = item.get("media_url", "")
            if media_url:
                filename = "image_01.jpg"
                self._download_file(media_url, media_dir / filename)
                items.append(
                    MediaItem(order=1, type="image", path=f"media/{filename}")
                )

        return items

    def _download_file(self, url: str, dest: Path) -> None:
        try:
            resp = requests.get(url, stream=True, timeout=30)
            resp.raise_for_status()
            with open(dest, "wb") as f:
                shutil.copyfileobj(resp.raw, f)
        except requests.RequestException as exc:
            logger.warning("Failed to download %s: %s", url, exc)
