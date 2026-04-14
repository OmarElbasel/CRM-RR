from django.db import models


class SeasonalTemplate(models.Model):
    name = models.CharField(max_length=100)
    occasion = models.CharField(max_length=50)
    body_ar = models.TextField()
    body_en = models.TextField()
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order"]
        indexes = [
            models.Index(fields=["occasion"]),
            models.Index(fields=["is_active", "sort_order"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.occasion})"
