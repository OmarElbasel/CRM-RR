from django.db import models


class Deal(models.Model):
    STAGE_CHOICES = [
        ('NEW_MESSAGE', 'New Message'),
        ('ENGAGED', 'Engaged'),
        ('PRICE_SENT', 'Price Sent'),
        ('ORDER_PLACED', 'Order Placed'),
        ('PAID', 'Paid'),
        ('REPEAT', 'Repeat'),
        ('LOST', 'Lost'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='deals',
        db_index=True,
    )
    contact = models.ForeignKey(
        'inbox.Contact',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='deals',
    )

    title = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='NEW_MESSAGE', db_index=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    ai_score = models.IntegerField(default=0)

    assigned_to_clerk_user_id = models.CharField(max_length=255, blank=True, db_index=True)
    assigned_to_name = models.CharField(max_length=255, blank=True)

    source_platform = models.CharField(max_length=20, blank=True)
    source_post_id = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    lost_reason = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    last_customer_message_at = models.DateTimeField(null=True, blank=True, db_index=True)
    last_merchant_reply_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Deal'
        verbose_name_plural = 'Deals'
        indexes = [
            models.Index(fields=['org', 'stage', 'updated_at']),
            models.Index(fields=['org', 'ai_score']),
            models.Index(fields=['org', 'assigned_to_clerk_user_id']),
            models.Index(fields=['org', 'last_customer_message_at']),
        ]

    def __str__(self):
        return f'{self.title} ({self.get_stage_display()})'

    def save(self, *args, **kwargs):
        self.ai_score = max(0, min(100, self.ai_score))
        super().save(*args, **kwargs)


class DealTask(models.Model):
    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='deal_tasks',
        db_index=True,
    )
    deal = models.ForeignKey(
        Deal,
        on_delete=models.CASCADE,
        related_name='tasks',
        db_index=True,
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True, db_index=True)

    assigned_to_clerk_user_id = models.CharField(max_length=255, blank=True, db_index=True)
    assigned_to_name = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Deal Task'
        verbose_name_plural = 'Deal Tasks'
        indexes = [
            models.Index(fields=['org', 'deal']),
            models.Index(fields=['org', 'completed_at']),
            models.Index(fields=['org', 'assigned_to_clerk_user_id']),
        ]

    def __str__(self):
        return self.title


class PipelineNotification(models.Model):
    TYPE_CHOICES = [
        ('STALE_PRICE_SENT', 'Stale Price Sent'),
        ('STALE_ENGAGED', 'Stale Engaged'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('HIGH', 'High'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='pipeline_notifications',
        db_index=True,
    )
    deal = models.ForeignKey(
        Deal,
        on_delete=models.CASCADE,
        related_name='notifications',
        db_index=True,
    )

    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, db_index=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    title = models.CharField(max_length=255)
    body = models.TextField()
    body_ar = models.TextField(blank=True)
    draft_en = models.TextField(blank=True)
    draft_ar = models.TextField(blank=True)
    dedupe_key = models.CharField(max_length=255, unique=True)
    read_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Pipeline Notification'
        verbose_name_plural = 'Pipeline Notifications'
        indexes = [
            models.Index(fields=['org', 'read_at', 'created_at']),
            models.Index(fields=['org', 'notification_type']),
        ]

    def __str__(self):
        return f'{self.get_notification_type_display()} — {self.title}'
