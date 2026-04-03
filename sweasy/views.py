from django.shortcuts import render


def home_view(request):
    return render(
        request,
        "home.html",
        {
            "hero_image_url": "https://dummyimage.com/1600x900/dfe7f2/1f3a5f.jpg&text=Sweasy+Swiss+Guide",
        },
    )
