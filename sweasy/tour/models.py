from django.db import models
from ckeditor.fields import RichTextField


class Tour(models.Model):
    title = models.CharField(max_length=100)
    description = RichTextField()
    duration = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_participants = models.IntegerField()
    guide_name = models.CharField(max_length=50)
    meeting_point = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title
