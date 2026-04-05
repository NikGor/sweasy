from django.contrib import admin
from django.utils.html import format_html

from .models import Fact, HeroBadge, PageSnapshot, Post, SiteSettings, Tour


# ──────────────────────── Helpers ────────────────────────

def move_up(modeladmin, request, queryset):
    for obj in queryset.order_by("order"):
        prev = obj.__class__.objects.filter(order__lt=obj.order).order_by("-order").first()
        if prev:
            obj.order, prev.order = prev.order, obj.order
            obj.save()
            prev.save()
move_up.short_description = "⬆ Переместить выше"

def move_down(modeladmin, request, queryset):
    for obj in queryset.order_by("-order"):
        nxt = obj.__class__.objects.filter(order__gt=obj.order).order_by("order").first()
        if nxt:
            obj.order, nxt.order = nxt.order, obj.order
            obj.save()
            nxt.save()
move_down.short_description = "⬇ Переместить ниже"

def make_published(modeladmin, request, queryset):
    queryset.update(is_published=True)
make_published.short_description = "✅ Опубликовать"

def make_unpublished(modeladmin, request, queryset):
    queryset.update(is_published=False)
make_unpublished.short_description = "🚫 Снять с публикации"

TW_TO_HEX = {
    "bg-[#FF2D55]":          "#FF2D55",
    "bg-[#FF6675]":          "#FF6675",
    "bg-[#00FF9D]":          "#00cc7d",
    "bg-[#229ED9]":          "#229ED9",
    "bg-primary":            "#001b44",
    "bg-primary-container":  "#1a3a6b",
    "bg-tertiary-container": "#5a3d8a",
    "text-[#FF2D55]":        "#FF2D55",
    "text-[#00FF9D]":        "#00cc7d",
    "text-primary":          "#001b44",
    "text-white":            "#ffffff",
}


# ──────────────────────── SiteSettings ────────────────────────

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Бренд / Футер", {
            "fields": ("brand", "copyright"),
        }),
        ("MoodBar — бегущая строка", {
            "fields": ("mood_label", "mood_status"),
        }),
        ("Hero — главный экран", {
            "fields": ("hero_image_url", "hero_image_preview", "hero_subtitle"),
        }),
        ("Лента (Live Feed)", {
            "fields": ("live_feed_title", "live_feed_subtitle"),
            "classes": ("collapse",),
        }),
        ("Туры", {
            "fields": ("tours_title", "tours_subtitle"),
            "classes": ("collapse",),
        }),
        ("Факты", {
            "fields": ("facts_title", "facts_subtitle"),
            "classes": ("collapse",),
        }),
        ("CTA — запись на тур", {
            "fields": ("cta_headline",),
            "classes": ("collapse",),
        }),
    )
    readonly_fields = ("hero_image_preview",)

    def hero_image_preview(self, obj):
        if obj.hero_image_url:
            return format_html(
                '<img src="{}" style="max-height:160px;border-radius:8px;object-fit:cover">',
                obj.hero_image_url,
            )
        return "—"
    hero_image_preview.short_description = "Предпросмотр"

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


# ──────────────────────── HeroBadge ────────────────────────

@admin.register(HeroBadge)
class HeroBadgeAdmin(admin.ModelAdmin):
    list_display       = ("order", "badge_preview", "text", "bg", "color", "rotate")
    list_display_links = ("badge_preview", "text")
    list_editable      = ("order",)
    ordering           = ("order",)
    actions            = [move_up, move_down]

    def badge_preview(self, obj):
        bg  = TW_TO_HEX.get(obj.bg, "#888")
        clr = TW_TO_HEX.get(obj.color, "#fff")
        return format_html(
            '<span style="display:inline-block;padding:3px 10px;border-radius:5px;'
            'font-weight:900;font-size:12px;background:{};color:{}">{}</span>',
            bg, clr, obj.text,
        )
    badge_preview.short_description = "Вид"


# ──────────────────────── Post ────────────────────────

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display       = ("order", "thumbnail", "caption", "badge_preview",
                          "offset", "is_published")
    list_display_links = ("thumbnail", "caption")
    list_editable      = ("order", "is_published")
    list_filter        = ("is_published", "badge_bg")
    search_fields      = ("caption", "alt", "badge_text")
    ordering           = ("order",)
    actions            = [move_up, move_down, make_published, make_unpublished]

    fieldsets = (
        ("Изображение", {
            "fields": ("image_url", "image_upload", "thumbnail", "alt"),
        }),
        ("Текст", {
            "fields": ("caption",),
        }),
        ("Бейдж", {
            "fields": ("badge_text", "badge_bg", "badge_color", "badge_rotate"),
        }),
        ("Настройки", {
            "fields": ("offset", "order", "is_published"),
        }),
    )
    readonly_fields = ("thumbnail",)

    def thumbnail(self, obj):
        url = obj.get_image_url()
        if url:
            return format_html(
                '<img src="{}" style="height:56px;width:56px;border-radius:6px;object-fit:cover">',
                url,
            )
        return "—"
    thumbnail.short_description = "Фото"

    def badge_preview(self, obj):
        bg  = TW_TO_HEX.get(obj.badge_bg, "#888")
        clr = TW_TO_HEX.get(obj.badge_color, "#fff")
        return format_html(
            '<span style="display:inline-block;padding:2px 8px;border-radius:4px;'
            'font-weight:bold;font-size:11px;background:{};color:{}">{}</span>',
            bg, clr, obj.badge_text,
        )
    badge_preview.short_description = "Бейдж"


# ──────────────────────── Tour ────────────────────────

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display       = ("order", "thumbnail", "title", "badge_preview", "is_published")
    list_display_links = ("thumbnail", "title")
    list_editable      = ("order", "is_published")
    list_filter        = ("is_published",)
    search_fields      = ("title", "description")
    ordering           = ("order",)
    actions            = [move_up, move_down, make_published, make_unpublished]

    fieldsets = (
        ("Изображение", {
            "fields": ("image_url", "image_upload", "thumbnail"),
        }),
        ("Контент", {
            "fields": ("title", "description"),
        }),
        ("Бейдж", {
            "fields": ("badge_text", "badge_bg", "badge_color", "badge_rotate"),
        }),
        ("Настройки", {
            "fields": ("order", "is_published"),
        }),
    )
    readonly_fields = ("thumbnail",)

    def thumbnail(self, obj):
        url = obj.get_image_url()
        if url:
            return format_html(
                '<img src="{}" style="height:56px;width:90px;border-radius:6px;object-fit:cover">',
                url,
            )
        return "—"
    thumbnail.short_description = "Фото"

    def badge_preview(self, obj):
        bg  = TW_TO_HEX.get(obj.badge_bg, "#888")
        clr = TW_TO_HEX.get(obj.badge_color, "#fff")
        return format_html(
            '<span style="display:inline-block;padding:2px 8px;border-radius:4px;'
            'font-weight:bold;font-size:11px;background:{};color:{}">{}</span>',
            bg, clr, obj.badge_text,
        )
    badge_preview.short_description = "Бейдж"


# ──────────────────────── Fact ────────────────────────

@admin.register(Fact)
class FactAdmin(admin.ModelAdmin):
    list_display       = ("order", "num_colored", "title_short", "is_published")
    list_display_links = ("num_colored", "title_short")
    list_editable      = ("order", "is_published")
    list_filter        = ("is_published", "bg")
    search_fields      = ("title", "text", "num")
    ordering           = ("order",)
    actions            = [move_up, move_down, make_published, make_unpublished]

    fieldsets = (
        ("Контент", {
            "fields": ("num", "title", "text"),
        }),
        ("Оформление", {
            "fields": ("bg", "num_color"),
        }),
        ("Настройки", {
            "fields": ("order", "is_published"),
        }),
    )

    def num_colored(self, obj):
        color = TW_TO_HEX.get(obj.num_color, "#888")
        return format_html(
            '<span style="font-size:20px;font-weight:900;color:{}">{}</span>',
            color, obj.num,
        )
    num_colored.short_description = "#"

    def title_short(self, obj):
        return obj.title[:70]
    title_short.short_description = "Заголовок"


# ──────────────────────── PageSnapshot ────────────────────────

@admin.register(PageSnapshot)
class PageSnapshotAdmin(admin.ModelAdmin):
    list_display    = ("__str__", "created_at")
    readonly_fields = ("created_at", "formatted_data")
    fields          = ("created_at", "formatted_data", "data")
    ordering        = ("-created_at",)

    def formatted_data(self, obj):
        import json
        pretty = json.dumps(obj.data, ensure_ascii=False, indent=2)
        return format_html(
            '<pre style="font-size:12px;max-height:400px;overflow:auto;'
            'background:#f8f9fa;padding:12px;border-radius:6px;border:1px solid #dee2e6">{}</pre>',
            pretty,
        )
    formatted_data.short_description = "JSON (предпросмотр)"

    def has_add_permission(self, request):
        return False
