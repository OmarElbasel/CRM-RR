from django.db import models

class WebhookAttempt(models.Model):
    """
    Logged for every Stripe webhook event received.
    Provides observability into webhook failures and ensures idempotency.
    """
    event_id = models.CharField(max_length=255, unique=True, help_text="Stripe event ID")
    event_type = models.CharField(max_length=100)
    status = models.CharField(
        max_length=10, 
        choices=[('success', 'Success'), ('failed', 'Failed'), ('ignored', 'Ignored')]
    )
    error_message = models.TextField(blank=True, help_text="Exception message on failure")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_id} - {self.event_type} ({self.status})"
