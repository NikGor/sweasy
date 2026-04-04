import csv
import json
from datetime import datetime, timezone
from pathlib import Path

from sweasy.parsers.models import MediaItem, PostData, PostMetrics
from sweasy.parsers.renderer import generate_indexes, generate_preview_html


def _make_post(shortcode: str, post_type: str = "image") -> PostData:
    return PostData(
        post_id=f"id_{shortcode}",
        shortcode=shortcode,
        url=f"https://www.instagram.com/p/{shortcode}/",
        post_type=post_type,
        published_at=datetime(2026, 4, 1, 12, 0, tzinfo=timezone.utc),
        caption=f"Caption for {shortcode}",
        hashtags=["test"],
        metrics=PostMetrics(like_count=10),
        media=[MediaItem(order=1, type="image", path="media/image_01.jpg")],
    )


def test_generate_indexes_jsonl(tmp_path: Path):
    posts = [_make_post("AAA"), _make_post("BBB")]
    generate_indexes(tmp_path, posts)

    jsonl_path = tmp_path / "posts_index.jsonl"
    assert jsonl_path.exists()

    lines = jsonl_path.read_text().strip().splitlines()
    assert len(lines) == 2
    entry = json.loads(lines[0])
    assert "shortcode" in entry
    assert "caption_preview" in entry
    assert entry["media_count"] == 1


def test_generate_indexes_csv(tmp_path: Path):
    posts = [_make_post("CCC")]
    generate_indexes(tmp_path, posts)

    csv_path = tmp_path / "posts_index.csv"
    assert csv_path.exists()

    with open(csv_path) as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    assert len(rows) == 1
    assert rows[0]["post_id"] == "id_CCC"
    assert rows[0]["type"] == "image"


def test_generate_preview_html(tmp_path: Path):
    post = _make_post("DDD")
    generate_preview_html(tmp_path, post)

    html_path = tmp_path / "preview.html"
    assert html_path.exists()

    content = html_path.read_text()
    assert "Caption for DDD" in content
    assert "media/image_01.jpg" in content
    assert "<!DOCTYPE html>" in content


def test_preview_html_video(tmp_path: Path):
    post = PostData(
        post_id="vid1",
        shortcode="VID1",
        url="https://www.instagram.com/p/VID1/",
        post_type="reel",
        published_at=datetime(2026, 4, 2, tzinfo=timezone.utc),
        caption="Video post",
        metrics=PostMetrics(like_count=50, view_count=1000),
        media=[
            MediaItem(
                order=1,
                type="video",
                path="media/reel.mp4",
                thumbnail_path="media/cover.jpg",
            )
        ],
    )
    generate_preview_html(tmp_path, post)
    content = (tmp_path / "preview.html").read_text()
    assert "<video" in content
    assert 'poster="media/cover.jpg"' in content
    assert "1,000 views" in content


def test_preview_html_escapes_caption(tmp_path: Path):
    post = _make_post("ESC")
    post.caption = "<script>alert('xss')</script>"
    generate_preview_html(tmp_path, post)
    content = (tmp_path / "preview.html").read_text()
    assert "<script>" not in content
    assert "&lt;script&gt;" in content
