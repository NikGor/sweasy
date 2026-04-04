from __future__ import annotations

from datetime import datetime, timezone

from django.core.management.base import BaseCommand, CommandError

from sweasy.parsers.instagram import InstagramScraper


class Command(BaseCommand):
    help = "Scrape an Instagram profile via Graph API and save as a local archive"

    def add_arguments(self, parser):
        parser.add_argument(
            "username",
            type=str,
            nargs="?",
            default=None,
            help="Instagram username (optional, token determines the account)",
        )
        parser.add_argument(
            "--last",
            type=int,
            default=None,
            help="Number of most recent posts to scrape",
        )
        parser.add_argument(
            "--since",
            type=str,
            default=None,
            help="Start date (YYYY-MM-DD) — scrape posts from this date",
        )
        parser.add_argument(
            "--until",
            type=str,
            default=None,
            help="End date (YYYY-MM-DD) — scrape posts until this date",
        )
        parser.add_argument(
            "--output",
            type=str,
            default="instagram_archive",
            help="Output directory (default: instagram_archive)",
        )
        parser.add_argument(
            "--token",
            type=str,
            default=None,
            help="Instagram API access token (default: INSTA_TOKEN env var)",
        )

    def handle(self, *args, **options):
        username = options["username"]
        output = options["output"]
        last = options["last"]
        since_str = options["since"]
        until_str = options["until"]

        since = self._parse_date(since_str) if since_str else None
        until = self._parse_date(until_str) if until_str else None

        if not last and not since:
            raise CommandError(
                "Specify --last N or --since DATE to limit the scrape"
            )

        try:
            scraper = InstagramScraper(
                output_dir=output,
                access_token=options["token"],
            )
        except ValueError as exc:
            raise CommandError(str(exc))

        self.stdout.write("Scraping profile...")
        try:
            profile = scraper.scrape_profile(username)
        except ValueError as exc:
            raise CommandError(str(exc))

        self.stdout.write(
            self.style.SUCCESS(
                f"Profile saved: {profile.display_name} "
                f"({profile.posts_count} posts, "
                f"{profile.followers_count} followers)"
            )
        )

        self.stdout.write("Scraping posts...")
        try:
            posts = scraper.scrape_posts(
                username, last=last, since=since, until=until
            )
        except ValueError as exc:
            raise CommandError(str(exc))

        self.stdout.write(
            self.style.SUCCESS(f"Done — {len(posts)} posts saved to {output}/")
        )

    def _parse_date(self, date_str: str) -> datetime:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").replace(
                tzinfo=timezone.utc
            )
        except ValueError:
            raise CommandError(
                f"Invalid date format: '{date_str}'. Use YYYY-MM-DD"
            )
