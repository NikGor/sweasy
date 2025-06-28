from django.views.generic import DetailView
from .models import Tour


class TourDetailView(DetailView):
    model = Tour
    template_name = 'tour_detail.html'
    context_object_name = 'tour'
