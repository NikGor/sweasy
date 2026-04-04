from django.db import models


class PageSnapshot(models.Model):
    """Stores AI-generated page configuration as JSON."""
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        get_latest_by = "created_at"

    def __str__(self):
        return f"PageSnapshot #{self.pk} ({self.created_at:%Y-%m-%d %H:%M})"
