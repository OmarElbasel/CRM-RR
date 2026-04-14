from django.db import models


class PostSchedule(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PUBLISHED", "Published"),
        ("FAILED", "Failed"),
    ]
    PLATFORM_CHOICES = [
        ("INSTAGRAM", "Instagram"),
        ("TIKTOK", "TikTok"),
    ]

    org = models.ForeignKey(
        "orgs.Organization", on_delete=models.CASCADE, db_index=True
    )
    channel = models.ForeignKey(
        "inbox.SocialChannel", on_delete=models.SET_NULL, null=True
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    content = models.TextField()
    media_url = models.CharField(max_length=2048, blank=True)
    scheduled_at = models.DateTimeField(db_index=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING", db_index=True
    )
    error_message = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["org", "status"]),
            models.Index(fields=["status", "scheduled_at"]),
            models.Index(fields=["org", "scheduled_at"]),
        ]

    def __str__(self):
        return f"{self.platform} — {self.status} — {self.scheduled_at}"


class BroadcastMessage(models.Model):
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("SENDING", "Sending"),
        ("SENT", "Sent"),
        ("FAILED", "Failed"),
    ]

    org = models.ForeignKey(
        "orgs.Organization", on_delete=models.CASCADE, db_index=True
    )
    template_name = models.CharField(max_length=255)
    message_ar = models.TextField()
    message_en = models.TextField()
    recipients = models.JSONField(default=list)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    sent_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DRAFT")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["org", "status"]),
            models.Index(fields=["org", "created_at"]),
        ]

    def __str__(self):
        return f"{self.template_name} — {self.status}"
