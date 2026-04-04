from datetime import datetime, timezone

from sweasy.parsers.models import MediaItem, PostData, PostMetrics, ProfileData


def test_profile_data_defaults():
    p = ProfileData(account="testuser")
    assert p.platform == "instagram"
    assert p.account == "testuser"
    assert p.display_name == ""
    assert p.followers_count == 0
    assert p.scraped_at.tzinfo is not None


def test_post_data_full():
    post = PostData(
        post_id="123",
        shortcode="ABC",
        url="https://www.instagram.com/p/ABC/",
        post_type="image",
        published_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
        caption="Hello #world @user",
        hashtags=["world"],
        mentions=["user"],
        metrics=PostMetrics(like_count=10, comment_count=2),
        media=[
            MediaItem(order=1, type="image", path="media/image_01.jpg")
        ],
    )
    assert post.post_type == "image"
    assert post.hashtags == ["world"]
    assert post.mentions == ["user"]
    assert post.metrics.like_count == 10
    assert post.media[0].path == "media/image_01.jpg"


def test_post_data_json_roundtrip():
    post = PostData(
        post_id="456",
        shortcode="XYZ",
        url="https://www.instagram.com/p/XYZ/",
        post_type="reel",
        published_at=datetime(2026, 3, 15, 12, 0, tzinfo=timezone.utc),
        caption="Test",
        metrics=PostMetrics(like_count=100, view_count=5000),
        media=[
            MediaItem(
                order=1,
                type="video",
                path="media/reel.mp4",
                thumbnail_path="media/cover.jpg",
                duration_seconds=15.5,
            )
        ],
    )
    json_str = post.model_dump_json()
    restored = PostData.model_validate_json(json_str)
    assert restored.shortcode == "XYZ"
    assert restored.metrics.view_count == 5000
    assert restored.media[0].thumbnail_path == "media/cover.jpg"
