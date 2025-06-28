from django.views.generic import TemplateView
from sweasy.card.models import Card


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cards'] = Card.objects.all()
        return context


class ContentView(TemplateView):
    template_name = 'content_page.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({})
