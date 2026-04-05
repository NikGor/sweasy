import json
import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Fact, HeroBadge, PageSnapshot, Post, SiteSettings, Tour


def _build_page_config():
    """Assemble page config dict from content models."""
    s = SiteSettings.load()

    badges = [
        {"text": b.text, "bg": b.bg, "color": b.color, "rotate": b.rotate}
        for b in HeroBadge.objects.all()
    ]

    posts = [
        {
            "image_url": p.get_image_url(),
            "alt": p.alt,
            "caption": p.caption,
            "badge": {
                "text": p.badge_text,
                "bg": p.badge_bg,
                "color": p.badge_color,
                "rotate": p.badge_rotate,
            },
            "offset": p.offset,
        }
        for p in Post.objects.filter(is_published=True)
    ]

    tours = [
        {
            "title": t.title,
            "description": t.description,
            "image_url": t.get_image_url(),
            "badge": {
                "text": t.badge_text,
                "bg": t.badge_bg,
                "color": t.badge_color,
                "rotate": t.badge_rotate,
            },
        }
        for t in Tour.objects.filter(is_published=True)
    ]

    facts = [
        {
            "num": f.num,
            "title": f.title,
            "text": f.text,
            "bg": f.bg,
            "numColor": f.num_color,
        }
        for f in Fact.objects.filter(is_published=True)
    ]

    return {
        "navbar":    {"brand": s.brand},
        "mood_bar":  {"label": s.mood_label, "status": s.mood_status},
        "hero":      {"image_url": s.hero_image_url, "badges": badges, "subtitle": s.hero_subtitle},
        "live_feed": {"title": s.live_feed_title, "subtitle": s.live_feed_subtitle, "posts": posts},
        "tours":     {"title": s.tours_title, "subtitle": s.tours_subtitle, "tours": tours},
        "facts":     {"title": s.facts_title, "subtitle": s.facts_subtitle, "facts": facts},
        "cta":       {"headline": s.cta_headline},
        "footer":    {"brand": s.brand, "copyright": s.copyright},
    }


def page_api(request):
    """Serve page config from content models (falls back to latest snapshot if DB is empty)."""
    has_content = Tour.objects.exists() or Post.objects.exists()

    if has_content:
        data = _build_page_config()
    else:
        # Fallback: latest AI-generated snapshot
        try:
            snapshot = PageSnapshot.objects.latest()
            data = snapshot.data
        except PageSnapshot.DoesNotExist:
            return JsonResponse({"error": "No content yet"}, status=404)

    response = JsonResponse(data, json_dumps_params={"ensure_ascii": False})
    response["Access-Control-Allow-Origin"] = "*"
    return response


@csrf_exempt
def page_upload(request):
    """Upload page config JSON to DB (POST only)."""
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    snapshot = PageSnapshot.objects.create(data=data)
    return JsonResponse({"ok": True, "id": snapshot.pk})


def frontend_view(request):
    """Serve root-level static files from frontend/dist or fall back to SPA index.html."""
    frontend_dir = Path(settings.FRONTEND_DIR).resolve()

    # Try to serve a static file matching the request path (robots.txt, sitemap.xml, video-note.mp4, etc.)
    requested = request.path.lstrip("/")
    if requested:
        candidate = (frontend_dir / requested).resolve()
        try:
            candidate.relative_to(frontend_dir)
            if candidate.is_file():
                content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
                return FileResponse(open(candidate, "rb"), content_type=content_type)
        except ValueError:
            pass  # Outside frontend_dir — ignore

    index = frontend_dir / "index.html"
    if index.exists():
        return HttpResponse(index.read_text(), content_type="text/html")
    return HttpResponse("Frontend not built. Run: cd frontend && npm run build", status=404)


def media_view(request, filename):
    """Serve media files (post images) from frontend dist."""
    file_path = Path(settings.FRONTEND_DIR) / "media" / filename
    if not file_path.exists():
        return HttpResponse("Not found", status=404)
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    return FileResponse(open(file_path, "rb"), content_type=content_type)


def asset_view(request, filename):
    """Serve Vite build assets (JS, CSS)."""
    file_path = Path(settings.FRONTEND_DIR) / "assets" / filename
    if not file_path.exists():
        return HttpResponse("Not found", status=404)
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    return FileResponse(open(file_path, "rb"), content_type=content_type)
