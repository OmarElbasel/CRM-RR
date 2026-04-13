from django.db import models


class AIUsage(models.Model):
    """Records every AI generation event for auditing and cost tracking."""

    LANGUAGE_CHOICES = [
        ('ar', 'Arabic'),
        ('en', 'English'),
        ('bilingual', 'Bilingual'),
    ]

    CATEGORY_CHOICES = [
        ('fashion', 'Fashion'),
        ('food', 'Food'),
        ('electronics', 'Electronics'),
        ('beauty', 'Beauty'),
        ('home', 'Home'),
        ('other', 'Other'),
    ]

    TONE_CHOICES = [
        ('professional', 'Professional'),
        ('casual', 'Casual'),
        ('luxury', 'Luxury'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='ai_usages',
        db_index=True,
    )
    model = models.CharField(max_length=100)
    tokens_in = models.IntegerField(default=0)
    tokens_out = models.IntegerField(default=0)
    cost_usd = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    tone = models.CharField(max_length=20, choices=TONE_CHOICES)
    cache_hit = models.BooleanField(default=False)
    success = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'AI Usage'
        verbose_name_plural = 'AI Usage Records'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['org', 'created_at']),
            models.Index(fields=['org', 'success']),
        ]

    def __str__(self):
        return f'{self.org} — {self.model} ({self.language}) @ {self.created_at:%Y-%m-%d %H:%M}'