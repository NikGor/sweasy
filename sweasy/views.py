import json
import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import PageSnapshot


def page_api(request):
    """Serve the latest page config from DB."""
    try:
        snapshot = PageSnapshot.objects.latest()
    except PageSnapshot.DoesNotExist:
        return JsonResponse({"error": "No page generated yet"}, status=404)

    response = JsonResponse(snapshot.data, json_dumps_params={"ensure_ascii": False})
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
    """Serve the React SPA index.html."""
    index = Path(settings.FRONTEND_DIR) / "index.html"
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
