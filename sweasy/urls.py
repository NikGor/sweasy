from django.contrib import admin
from django.urls import path

from .views import page_api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/page/", page_api, name="page-api"),
]
