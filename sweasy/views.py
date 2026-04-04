from django.http import JsonResponse

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
