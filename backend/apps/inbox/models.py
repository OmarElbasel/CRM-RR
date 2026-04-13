from django.db import models


class SocialChannel(models.Model):
    PLATFORM_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('WHATSAPP', 'WhatsApp Business'),
        ('FACEBOOK', 'Facebook'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='social_channels',
        db_index=True,
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)

    # Fernet-encrypted Meta access token (Constitution: encrypted at rest)
    access_token = models.BinaryField()
    token_expires_at = models.DateTimeField(null=True, blank=True)

    # Platform-specific identifiers
    page_id = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text='Instagram/Facebook Page ID. Null for WhatsApp.',
    )
    phone_number_id = models.CharField(
        max_length=255,
        null=True, blank=True,
        help_text='WhatsApp Business phone number ID. Null for Instagram/Facebook.',
    )

    is_active = models.BooleanField(default=True, db_index=True)
    connected_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Social Channel'
        verbose_name_plural = 'Social Channels'
        unique_together = [('org', 'platform')]
        ordering = ['platform']
        indexes = [
            models.Index(fields=['org', 'is_active']),
        ]

    def __str__(self):
        return f'{self.org} — {self.get_platform_display()}'


class Contact(models.Model):
    PLATFORM_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('WHATSAPP', 'WhatsApp Business'),
        ('FACEBOOK', 'Facebook'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='contacts',
        db_index=True,
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    platform_id = models.CharField(
        max_length=255,
        help_text='Unique ID assigned by the platform (e.g., Instagram user PSID).',
        db_index=True,
    )

    name = models.CharField(max_length=255, blank=True)
    ai_score = models.IntegerField(
        default=0,
        help_text='Lead score 0-100. Incremented/decremented by AI pipeline on each message.',
    )
    total_spend = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text='Cumulative order value attributed to this contact (QAR).',
    )
    tags = models.JSONField(
        default=list,
        help_text='Free-form string tags set by the merchant.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        unique_together = [('org', 'platform', 'platform_id')]
        ordering = ['-ai_score', '-created_at']
        indexes = [
            models.Index(fields=['org', 'platform']),
            models.Index(fields=['org', 'ai_score']),
        ]

    def __str__(self):
        return f'{self.name or self.platform_id} ({self.get_platform_display()})'


class Message(models.Model):
    DIRECTION_CHOICES = [
        ('INBOUND', 'Inbound'),
        ('OUTBOUND', 'Outbound'),
    ]

    INTENT_CHOICES = [
        ('READY_TO_BUY', 'Ready to Buy'),
        ('PRICE_INQUIRY', 'Price Inquiry'),
        ('INFO_REQUEST', 'Info Request'),
        ('COMPLAINT', 'Complaint'),
        ('BROWSING', 'Browsing'),
    ]

    PLATFORM_CHOICES = [
        ('INSTAGRAM', 'Instagram'),
        ('WHATSAPP', 'WhatsApp Business'),
        ('FACEBOOK', 'Facebook'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='messages',
        db_index=True,
    )
    contact = models.ForeignKey(
        Contact,
        on_delete=models.CASCADE,
        related_name='messages',
        db_index=True,
    )
    channel = models.ForeignKey(
        SocialChannel,
        on_delete=models.SET_NULL,
        null=True,
        related_name='messages',
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)

    # Deduplication key — unique within a platform
    platform_msg_id = models.CharField(max_length=255, db_index=True)

    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)
    content = models.TextField(help_text='Original message content.')
    content_ar = models.TextField(
        blank=True,
        help_text='Arabic translation of content (set by AI pipeline for INBOUND messages).',
    )

    # AI-generated fields (populated async by Celery task)
    intent = models.CharField(
        max_length=20,
        choices=INTENT_CHOICES,
        null=True, blank=True,
        help_text='AI-classified message intent. Null until pipeline runs.',
    )
    ai_draft = models.TextField(
        blank=True,
        help_text='AI-generated English reply draft.',
    )
    ai_draft_ar = models.TextField(
        blank=True,
        help_text='AI-generated Arabic (Gulf dialect) reply draft.',
    )

    read = models.BooleanField(default=False, db_index=True)
    sent_at = models.DateTimeField(
        null=True, blank=True,
        help_text='Timestamp from the platform. Null for manually-created messages.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        unique_together = [('platform', 'platform_msg_id')]
        ordering = ['-sent_at', '-created_at']
        indexes = [
            models.Index(fields=['org', 'contact', 'created_at']),
            models.Index(fields=['org', 'read', 'created_at']),
            models.Index(fields=['org', 'intent']),
        ]

    def __str__(self):
        return f'{self.get_direction_display()} — {self.content[:50]}'
