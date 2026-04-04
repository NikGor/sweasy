from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class ProfileData(BaseModel):
    platform: str = "instagram"
    account: str
    display_name: str = ""
    bio: str = ""
    external_url: str = ""
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    avatar_path: str = ""
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PostMetrics(BaseModel):
    like_count: int = 0
    comment_count: int = 0
    view_count: int | None = None


class MediaItem(BaseModel):
    order: int
    type: str  # image | video
    role: str = "main"  # main | thumbnail
    path: str
    thumbnail_path: str | None = None
    duration_seconds: float | None = None


class PostData(BaseModel):
    platform: str = "instagram"
    post_id: str
    shortcode: str
    url: str
    post_type: str  # image | carousel | video | reel
    published_at: datetime
    caption: str = ""
    hashtags: list[str] = Field(default_factory=list)
    mentions: list[str] = Field(default_factory=list)
    metrics: PostMetrics = Field(default_factory=PostMetrics)
    media: list[MediaItem] = Field(default_factory=list)
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
