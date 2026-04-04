from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

from sweasy.parsers.instagram import InstagramScraper


def _profile_response():
    return {
        "user_id": "17841440639782932",
        "username": "testuser",
        "name": "Test User",
        "biography": "Bio text",
        "website": "https://example.com",
        "followers_count": 1000,
        "follows_count": 500,
        "media_count": 10,
        "profile_picture_url": "https://example.com/avatar.jpg",
    }


def _post_response(
    post_id: str = "12345",
    media_type: str = "IMAGE",
    caption: str = "Hello #world @friend",
    timestamp: str = "2026-04-01T12:00:00+0000",
):
    return {
        "id": post_id,
        "caption": caption,
        "media_type": media_type,
        "media_url": "https://example.com/image.jpg",
        "thumbnail_url": "https://example.com/thumb.jpg",
        "permalink": "https://www.instagram.com/p/ABC123/",
        "timestamp": timestamp,
        "like_count": 42,
        "comments_count": 5,
    }


def _media_list_response(*posts):
    return {"data": list(posts), "paging": {}}


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_scrape_profile(mock_api_get, mock_download, tmp_path: Path):
    mock_api_get.return_value = _profile_response()
    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    profile = scraper.scrape_profile("testuser")

    assert profile.account == "testuser"
    assert profile.display_name == "Test User"
    assert profile.followers_count == 1000
    assert (tmp_path / "profile.json").exists()
    mock_download.assert_called_once()


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_scrape_posts_image(mock_api_get, mock_download, tmp_path: Path):
    post = _post_response()
    mock_api_get.return_value = _media_list_response(post)

    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    results = scraper.scrape_posts("testuser", last=1)

    assert len(results) == 1
    assert results[0].post_type == "image"
    assert results[0].shortcode == "ABC123"
    assert results[0].hashtags == ["world"]
    assert results[0].mentions == ["friend"]

    post_dir = tmp_path / "posts" / "2026-04-01_ABC123"
    assert (post_dir / "post.json").exists()
    assert (post_dir / "caption.txt").exists()
    assert (post_dir / "preview.html").exists()

    assert (tmp_path / "posts_index.jsonl").exists()
    assert (tmp_path / "posts_index.csv").exists()


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_scrape_posts_carousel(mock_api_get, mock_download, tmp_path: Path):
    post = _post_response(media_type="CAROUSEL_ALBUM")
    children = {
        "data": [
            {
                "media_type": "IMAGE",
                "media_url": "https://example.com/img1.jpg",
            },
            {
                "media_type": "IMAGE",
                "media_url": "https://example.com/img2.jpg",
            },
        ]
    }
    mock_api_get.side_effect = [_media_list_response(post), children]

    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    results = scraper.scrape_posts("testuser", last=1)

    assert results[0].post_type == "carousel"
    assert len(results[0].media) == 2
    assert results[0].media[0].path == "media/image_01.jpg"
    assert results[0].media[1].path == "media/image_02.jpg"


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_scrape_posts_video(mock_api_get, mock_download, tmp_path: Path):
    post = _post_response(media_type="VIDEO")
    mock_api_get.return_value = _media_list_response(post)

    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    results = scraper.scrape_posts("testuser", last=1)

    assert results[0].post_type == "video"
    assert results[0].media[0].path == "media/video_01.mp4"
    assert results[0].media[0].thumbnail_path == "media/cover.jpg"


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_scrape_posts_date_filter(mock_api_get, mock_download, tmp_path: Path):
    post_new = _post_response(post_id="111", timestamp="2026-04-01T12:00:00+0000")
    post_new["permalink"] = "https://www.instagram.com/p/NEW/"
    post_old = _post_response(post_id="222", timestamp="2026-01-01T12:00:00+0000")
    post_old["permalink"] = "https://www.instagram.com/p/OLD/"

    mock_api_get.return_value = _media_list_response(post_new, post_old)

    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    results = scraper.scrape_posts(
        "testuser",
        since=datetime(2026, 3, 1, tzinfo=timezone.utc),
        until=datetime(2026, 4, 30, tzinfo=timezone.utc),
    )

    assert len(results) == 1
    assert results[0].shortcode == "NEW"


@patch("sweasy.parsers.instagram.InstagramScraper._download_file")
@patch("sweasy.parsers.instagram.InstagramScraper._api_get")
def test_idempotent_rerun(mock_api_get, mock_download, tmp_path: Path):
    post = _post_response()
    mock_api_get.return_value = _media_list_response(post)

    scraper = InstagramScraper(output_dir=tmp_path, access_token="test-token")
    scraper.scrape_posts("testuser", last=1)

    # Run again
    mock_api_get.return_value = _media_list_response(post)
    results = scraper.scrape_posts("testuser", last=1)

    assert len(results) == 1
    post_dirs = list((tmp_path / "posts").iterdir())
    assert len(post_dirs) == 1


def test_missing_token():
    try:
        InstagramScraper(output_dir="/tmp/test", access_token="")
        assert False, "Should have raised ValueError"
    except ValueError as exc:
        assert "token" in str(exc).lower()
