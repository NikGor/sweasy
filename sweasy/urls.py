from django.contrib import admin
from django.urls import path, re_path

from .views import page_api, page_upload, frontend_view, media_view, asset_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/page/", page_api, name="page-api"),
    path("api/page/upload/", page_upload, name="page-upload"),
    # Serve Vite assets (JS, CSS)
    re_path(r"^assets/(?P<filename>.+)$", asset_view, name="assets"),
    # Serve media files (post images)
    re_path(r"^media/(?P<filename>.+)$", media_view, name="media"),
    # Catch-all: serve React SPA
    re_path(r"^", frontend_view, name="frontend"),
]
