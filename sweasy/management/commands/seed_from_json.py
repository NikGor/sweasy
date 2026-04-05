"""
Импортирует данные из page.json в модели контента.
Использование: python manage.py seed_from_json [--path /path/to/page.json]
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand

from sweasy.models import Fact, HeroBadge, Post, SiteSettings, Tour

DEFAULT_PATH = Path(__file__).resolve().parents[3] / "frontend" / "public" / "page.json"


class Command(BaseCommand):
    help = "Seed content models from page.json"

    def add_arguments(self, parser):
        parser.add_argument("--path", default=str(DEFAULT_PATH), help="Path to page.json")
        parser.add_argument("--clear", action="store_true", help="Очистить данные перед импортом")

    def handle(self, *args, **options):
        path = Path(options["path"])
        if not path.exists():
            self.stderr.write(self.style.ERROR(f"Файл не найден: {path}"))
            return

        data = json.loads(path.read_text(encoding="utf-8"))

        if options["clear"]:
            SiteSettings.objects.all().delete()
            HeroBadge.objects.all().delete()
            Post.objects.all().delete()
            Tour.objects.all().delete()
            Fact.objects.all().delete()
            self.stdout.write("Данные очищены.")

        # ── SiteSettings ──
        hero      = data.get("hero", {})
        live_feed = data.get("live_feed", {})
        tours_d   = data.get("tours", {})
        facts_d   = data.get("facts", {})
        footer    = data.get("footer", {})
        mood      = data.get("mood_bar", {})
        navbar    = data.get("navbar", {})

        s = SiteSettings.load()
        s.brand             = navbar.get("brand", s.brand)
        s.copyright         = footer.get("copyright", s.copyright)
        s.mood_label        = mood.get("label", s.mood_label)
        s.mood_status       = mood.get("status", s.mood_status)
        s.hero_image_url    = hero.get("image_url", s.hero_image_url)
        s.hero_subtitle     = hero.get("subtitle", s.hero_subtitle)
        s.live_feed_title   = live_feed.get("title", s.live_feed_title)
        s.live_feed_subtitle = live_feed.get("subtitle", s.live_feed_subtitle)
        s.tours_title       = tours_d.get("title", s.tours_title)
        s.tours_subtitle    = tours_d.get("subtitle", s.tours_subtitle)
        s.facts_title       = facts_d.get("title", s.facts_title)
        s.facts_subtitle    = facts_d.get("subtitle", s.facts_subtitle)
        s.cta_headline      = data.get("cta", {}).get("headline", s.cta_headline)
        s.save()
        self.stdout.write(self.style.SUCCESS("✓ SiteSettings"))

        # ── HeroBadges ──
        for i, b in enumerate(hero.get("badges", [])):
            HeroBadge.objects.get_or_create(
                text=b["text"],
                defaults={"bg": b["bg"], "color": b["color"], "rotate": b.get("rotate", ""), "order": i},
            )
        self.stdout.write(self.style.SUCCESS(f"✓ HeroBadges ({len(hero.get('badges', []))})"))

        # ── Posts ──
        for i, p in enumerate(live_feed.get("posts", [])):
            badge = p.get("badge", {})
            Post.objects.get_or_create(
                image_url=p["image_url"],
                defaults={
                    "alt": p.get("alt", ""),
                    "caption": p.get("caption", ""),
                    "badge_text": badge.get("text", ""),
                    "badge_bg": badge.get("bg", "bg-[#FF2D55]"),
                    "badge_color": badge.get("color", "text-white"),
                    "badge_rotate": badge.get("rotate", ""),
                    "offset": p.get("offset", False),
                    "order": i,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"✓ Posts ({len(live_feed.get('posts', []))})"))

        # ── Tours ──
        for i, t in enumerate(tours_d.get("tours", [])):
            badge = t.get("badge", {})
            Tour.objects.get_or_create(
                title=t["title"],
                defaults={
                    "description": t.get("description", ""),
                    "image_url": t.get("image_url", ""),
                    "badge_text": badge.get("text", ""),
                    "badge_bg": badge.get("bg", "bg-[#FF2D55]"),
                    "badge_color": badge.get("color", "text-white"),
                    "badge_rotate": badge.get("rotate", ""),
                    "order": i,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"✓ Tours ({len(tours_d.get('tours', []))})"))

        # ── Facts ──
        for i, f in enumerate(facts_d.get("facts", [])):
            Fact.objects.get_or_create(
                num=f["num"],
                defaults={
                    "title": f.get("title", ""),
                    "text": f.get("text", ""),
                    "bg": f.get("bg", "bg-primary-container"),
                    "num_color": f.get("numColor", "text-[#FF2D55]"),
                    "order": i,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"✓ Facts ({len(facts_d.get('facts', []))})"))

        self.stdout.write(self.style.SUCCESS("\n🎉 Импорт завершён. Откройте /admin/ для редактирования."))
