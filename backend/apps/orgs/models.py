from decimal import Decimal

from django.db import models


class Organization(models.Model):
    """
    Top-level tenant unit. Every piece of data in the system belongs to exactly
    one Organization. Constitution Principle I — all queries must be scoped to org.
    """

    PLAN_CHOICES = [
        ('free', 'Free'),
        ('starter', 'Starter'),
        ('pro', 'Pro'),
        ('enterprise', 'Enterprise'),
    ]

    name = models.CharField(max_length=255)
    # clerk_org_id matches the 'org_id' claim in Clerk JWTs
    clerk_org_id = models.CharField(max_length=255, unique=True, db_index=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Phase 3 — Public API key for widget embed
    api_key_public = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text='Public API key for widget embed. Format: pk_live_xxx or pk_test_xxx.',
    )

    # Phase 4 — Encrypted secret API key (sk_live_xxx)
    api_key_secret = models.BinaryField(
        null=True,
        blank=True,
        help_text='Fernet-encrypted secret API key (sk_live_xxx). Never returned in API responses.',
    )

    # Phase 4 — Stripe billing identifiers
    stripe_customer_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        db_index=True,
        help_text='Stripe Customer ID (cus_xxx). Set on first Checkout session creation.',
    )
    stripe_subscription_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='Active Stripe Subscription ID (sub_xxx). Updated by webhook handler.',
    )

    # Phase 2 — AI generation budget (Constitution Principle VI)
    monthly_generation_limit = models.IntegerField(
        default=20,
        help_text='Maximum AI generations allowed per month. Free plan default = 20.',
    )
    generations_used_this_month = models.IntegerField(
        default=0,
        help_text='Counter incremented atomically via F() after each successful generation.',
    )

    # Phase 10 — USD cost cap (Constitution Principle VI)
    monthly_cost_cap_usd = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('10.00'),
        help_text='Monthly AI spend hard cap in USD. Enterprise default = 500.',
    )
    monthly_cost_usd = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text='Accumulated AI cost in USD this month. Incremented atomically after each generation.',
    )
    ai_suspended = models.BooleanField(
        default=False,
        help_text='Set to True when monthly_cost_usd >= monthly_cost_cap_usd. Cleared on month reset.',
    )
    owner_email = models.EmailField(
        null=True,
        blank=True,
        help_text='Primary owner email. Populated from Clerk JWT on first authentication.',
    )

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.name} ({self.plan})'


class FlaggedOrg(models.Model):
    """
    Organizations flagged for manual review due to anomalous message volume.
    Constitution Principle I — all queries on this model must be scoped via org.
    """

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('cleared', 'Cleared'),
        ('suspended', 'Suspended'),
    ]

    org = models.OneToOneField(
        Organization,
        on_delete=models.CASCADE,
        related_name='abuse_flag',
    )
    flagged_at = models.DateTimeField(auto_now_add=True)
    message_volume_24h = models.IntegerField(
        help_text='24-hour inbound message count at time of flagging.',
    )
    trailing_30d_avg = models.FloatField(
        help_text='Trailing 30-day daily average at time of flagging.',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    cleared_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Flagged Organization'
        verbose_name_plural = 'Flagged Organizations'
        ordering = ['-flagged_at']

    def __str__(self) -> str:
        return f'{self.org.name} — {self.status}'
