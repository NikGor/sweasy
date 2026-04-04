from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError

from sweasy.parsers.page_generator import generate_page


class Command(BaseCommand):
    help = "Generate landing page config from Instagram archive using AI"

    def add_arguments(self, parser):
        parser.add_argument(
            "--archive",
            type=str,
            default="instagram_archive",
            help="Path to Instagram archive directory",
        )
        parser.add_argument(
            "--output",
            type=str,
            default="frontend/public/page.json",
            help="Output path for page.json",
        )
        parser.add_argument(
            "--posts",
            type=int,
            default=10,
            help="Number of recent posts to analyze",
        )

    def handle(self, *_args, **options):
        try:
            page = generate_page(
                archive_dir=options["archive"],
                output_path=options["output"],
                num_posts=options["posts"],
            )
        except ValueError as exc:
            raise CommandError(str(exc))

        self.stdout.write(
            self.style.SUCCESS(
                f"Page generated: {len(page.live_feed.posts)} feed cards, "
                f"{len(page.facts.facts)} facts"
            )
        )
