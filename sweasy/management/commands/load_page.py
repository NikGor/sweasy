import json
from pathlib import Path

from django.core.management.base import BaseCommand

from sweasy.models import PageSnapshot


class Command(BaseCommand):
    help = "Load page.json into DB as a PageSnapshot"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            default="frontend/public/page.json",
            help="Path to page.json file",
        )

    def handle(self, *args, **options):
        path = Path(options["file"])
        if not path.exists():
            self.stderr.write(f"File not found: {path}")
            return

        data = json.loads(path.read_text(encoding="utf-8"))
        snapshot = PageSnapshot.objects.create(data=data)
        self.stdout.write(f"Created PageSnapshot #{snapshot.pk} at {snapshot.created_at}")
