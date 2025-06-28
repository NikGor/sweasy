from django.urls import path
from .views import TourDetailView

app_name = 'tour'

urlpatterns = [
    path('<int:pk>/', TourDetailView.as_view(), name='tour_detail'),
]
