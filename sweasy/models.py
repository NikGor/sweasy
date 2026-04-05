from django.db import models
from django.utils.html import format_html


# ──────────────────────── Color-class choices ────────────────────────

BADGE_BG_CHOICES = [
    ("bg-[#FF2D55]",          "🔴 Красный (#FF2D55)"),
    ("bg-[#FF6675]",          "🌸 Коралловый (#FF6675)"),
    ("bg-[#00FF9D]",          "🟢 Зелёный (#00FF9D)"),
    ("bg-[#229ED9]",          "🔵 Telegram синий (#229ED9)"),
    ("bg-primary",            "🫐 Тёмно-синий (primary)"),
    ("bg-primary-container",  "💙 Синий светлый (primary-container)"),
    ("bg-tertiary-container", "🟣 Третичный (tertiary-container)"),
]

BADGE_COLOR_CHOICES = [
    ("text-white",   "Белый"),
    ("text-primary", "Тёмно-синий"),
]

BADGE_ROTATE_CHOICES = [
    ("",          "Без наклона"),
    ("-rotate-2", "−2°"),
    ("-rotate-1", "−1°"),
    ("rotate-1",  "+1°"),
    ("rotate-2",  "+2°"),
]

FACT_BG_CHOICES = BADGE_BG_CHOICES

FACT_NUM_COLOR_CHOICES = [
    ("text-[#FF2D55]",  "🔴 Красный"),
    ("text-[#00FF9D]",  "🟢 Зелёный"),
    ("text-primary",    "🫐 Тёмно-синий"),
    ("text-white",      "Белый"),
]


# ──────────────────────── Singleton helper ────────────────────────

class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # запрещаем удаление

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


# ──────────────────────── SiteSettings ────────────────────────

class SiteSettings(SingletonModel):
    # Brand / Footer
    brand       = models.CharField("Название бренда", max_length=100, default="Sweasy")
    copyright   = models.CharField("Копирайт", max_length=300,
                                   default="© 2024 Sweasy. Все права защищены.")

    # MoodBar
    mood_label  = models.CharField("Лейбл настроения", max_length=100, default="Настроение")
    mood_status = models.CharField("Статус (бегущая строка)", max_length=300,
                                   default="ОТКРЫТА ГОРИЗОНТАМ — ЖИВЁМ НА ПРИВЫСОКОЙ НОТЕ")

    # Hero
    hero_image_url = models.CharField(
        "URL фото hero", max_length=500,
        default="/media/CYWp61nNVxe_4k.jpg",
        help_text="Путь к изображению, напр. /media/image.jpg",
    )
    hero_subtitle  = models.TextField(
        "Подзаголовок hero",
        default="Проводим тебя туда, где реальность сливается с волшебством.",
    )

    # LiveFeed
    live_feed_title    = models.CharField("Заголовок ленты", max_length=200,
                                          default="СВЕЖИЕ ВПЕЧАТЛЕНИЯ")
    live_feed_subtitle = models.CharField("Подзаголовок ленты", max_length=300,
                                          default="Пульс Швейцарии — наши лучшие моменты прямо сейчас")

    # Tours
    tours_title    = models.CharField("Заголовок туров", max_length=200,
                                      default="АВТОРСКИЕ ТУРЫ")
    tours_subtitle = models.CharField("Подзаголовок туров", max_length=300,
                                      default="Твои маршруты к лучшему в Швейцарии")

    # Facts
    facts_title    = models.CharField("Заголовок фактов", max_length=200,
                                      default="ФАКТЫ, КОТОРЫЕ МЫ ПРОЖИВАЕМ")
    facts_subtitle = models.CharField("Подзаголовок фактов", max_length=300,
                                      default="Открывай Швейцарию снутри — глазами локального гида")

    # CTA
    cta_headline = models.CharField("Заголовок CTA", max_length=300,
                                    default="ВПЕРЕД, В ТВОЮ ШВЕЙЦАРИЮ — ЗАПИШИСЬ НА ТУР!")

    class Meta:
        verbose_name        = "Настройки сайта"
        verbose_name_plural = "Настройки сайта"

    def __str__(self):
        return "Настройки сайта"


# ──────────────────────── HeroBadge ────────────────────────

class HeroBadge(models.Model):
    text   = models.CharField("Текст", max_length=200)
    bg     = models.CharField("Фон", max_length=100,
                               choices=BADGE_BG_CHOICES, default="bg-[#FF2D55]")
    color  = models.CharField("Цвет текста", max_length=100,
                               choices=BADGE_COLOR_CHOICES, default="text-white")
    rotate = models.CharField("Наклон", max_length=50,
                               choices=BADGE_ROTATE_CHOICES, blank=True, default="")
    order  = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering            = ["order"]
        verbose_name        = "Бейдж Hero"
        verbose_name_plural = "Бейджи Hero"

    def __str__(self):
        return self.text


# ──────────────────────── Post (LiveFeed) ────────────────────────

class Post(models.Model):
    image_url    = models.CharField("URL изображения", max_length=500,
                                    help_text="Напр. /media/photo.jpg")
    image_upload = models.ImageField("Или загрузить файл", upload_to="uploads/posts/",
                                     blank=True, null=True,
                                     help_text="Загрузка перекрывает URL выше")
    alt          = models.CharField("Alt текст", max_length=300)
    caption      = models.CharField("Подпись", max_length=300)
    badge_text   = models.CharField("Текст бейджа", max_length=200)
    badge_bg     = models.CharField("Фон бейджа", max_length=100,
                                    choices=BADGE_BG_CHOICES, default="bg-[#FF2D55]")
    badge_color  = models.CharField("Цвет текста бейджа", max_length=100,
                                    choices=BADGE_COLOR_CHOICES, default="text-white")
    badge_rotate = models.CharField("Наклон бейджа", max_length=50,
                                    choices=BADGE_ROTATE_CHOICES, blank=True, default="")
    offset       = models.BooleanField("Сдвинуть вниз (offset)", default=False)
    order        = models.PositiveIntegerField("Порядок", default=0)
    is_published = models.BooleanField("Опубликован", default=True)

    class Meta:
        ordering            = ["order"]
        verbose_name        = "Пост (лента)"
        verbose_name_plural = "Посты (лента)"

    def __str__(self):
        return self.caption[:60]

    def get_image_url(self):
        if self.image_upload:
            return self.image_upload.url
        return self.image_url

    def preview(self):
        url = self.get_image_url()
        if url:
            return format_html('<img src="{}" style="height:60px;border-radius:6px;object-fit:cover">', url)
        return "—"
    preview.short_description = "Фото"


# ──────────────────────── Tour ────────────────────────

class Tour(models.Model):
    title        = models.CharField("Название", max_length=200)
    description  = models.TextField("Описание")
    image_url    = models.CharField("URL изображения", max_length=500,
                                    help_text="Напр. /media/photo.jpg")
    image_upload = models.ImageField("Или загрузить файл", upload_to="uploads/tours/",
                                     blank=True, null=True,
                                     help_text="Загрузка перекрывает URL выше")
    badge_text   = models.CharField("Текст бейджа", max_length=200)
    badge_bg     = models.CharField("Фон бейджа", max_length=100,
                                    choices=BADGE_BG_CHOICES, default="bg-[#FF2D55]")
    badge_color  = models.CharField("Цвет текста бейджа", max_length=100,
                                    choices=BADGE_COLOR_CHOICES, default="text-white")
    badge_rotate = models.CharField("Наклон бейджа", max_length=50,
                                    choices=BADGE_ROTATE_CHOICES, blank=True, default="")
    order        = models.PositiveIntegerField("Порядок", default=0)
    is_published = models.BooleanField("Опубликован", default=True)

    class Meta:
        ordering            = ["order"]
        verbose_name        = "Тур"
        verbose_name_plural = "Туры"

    def __str__(self):
        return self.title

    def get_image_url(self):
        if self.image_upload:
            return self.image_upload.url
        return self.image_url

    def preview(self):
        url = self.get_image_url()
        if url:
            return format_html('<img src="{}" style="height:60px;border-radius:6px;object-fit:cover">', url)
        return "—"
    preview.short_description = "Фото"


# ──────────────────────── Fact ────────────────────────

class Fact(models.Model):
    num          = models.CharField("Номер", max_length=10, help_text='Напр. "01"')
    title        = models.CharField("Заголовок", max_length=300)
    text         = models.TextField("Текст")
    bg           = models.CharField("Фон карточки", max_length=100,
                                    choices=FACT_BG_CHOICES, default="bg-primary-container")
    num_color    = models.CharField("Цвет номера", max_length=100,
                                    choices=FACT_NUM_COLOR_CHOICES, default="text-[#FF2D55]")
    order        = models.PositiveIntegerField("Порядок", default=0)
    is_published = models.BooleanField("Опубликован", default=True)

    class Meta:
        ordering            = ["order"]
        verbose_name        = "Факт"
        verbose_name_plural = "Факты"

    def __str__(self):
        return f"{self.num}. {self.title[:60]}"


# ──────────────────────── PageSnapshot (legacy / AI) ────────────────────────

class PageSnapshot(models.Model):
    """AI-generated page snapshot (fallback / history)."""
    data       = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ["-created_at"]
        get_latest_by       = "created_at"
        verbose_name        = "Снапшот (AI)"
        verbose_name_plural = "Снапшоты (AI)"

    def __str__(self):
        return f"Снапшот #{self.pk} ({self.created_at:%Y-%m-%d %H:%M})"
