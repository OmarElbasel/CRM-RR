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

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.name} ({self.plan})'
