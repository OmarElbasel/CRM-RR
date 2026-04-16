import time
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator

# Module-level cache for AdminConfig singleton
_config_cache = {}

class AdminConfig(models.Model):
    """
    Singleton configuration record for platform-wide defaults.
    Always uses pk=1.
    """
    # Token Budgets (per plan)
    free_token_budget = models.IntegerField(default=50000, help_text="Monthly budget for Free plan")
    starter_token_budget = models.IntegerField(default=500000, help_text="Monthly budget for Starter plan")
    pro_token_budget = models.IntegerField(default=5000000, help_text="Monthly budget for Pro plan")
    enterprise_token_budget = models.IntegerField(default=50000000, help_text="Monthly budget for Enterprise plan")

    # AI Cost Rates (per 1K tokens)
    claude_input_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.003000"))
    claude_output_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.015000"))
    
    openai_input_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.002000"))
    openai_output_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.008000"))
    
    gemini_input_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.000750"))
    gemini_output_cost_per_1k = models.DecimalField(max_digits=8, decimal_places=6, default=Decimal("0.002250"))

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=255, blank=True, help_text="Clerk user ID of last editor")

    class Meta:
        verbose_name = "Admin Config"
        verbose_name_plural = "Admin Config"

    def save(self, *args, **kwargs):
        self.pk = 1  # Ensure singleton
        super().save(*args, **kwargs)
        # Invalidate cache on save
        _config_cache.clear()

    @classmethod
    def get(cls) -> 'AdminConfig':
        """
        Returns the singleton AdminConfig instance with a 60-second in-process cache.
        """
        now = time.monotonic()
        cached = _config_cache.get('obj')
        ts = _config_cache.get('ts', 0)
        
        if cached and (now - ts < 60):
            return cached
            
        obj, _ = cls.objects.get_or_create(pk=1)
        _config_cache.update({'obj': obj, 'ts': now})
        return obj

    def budget_for_plan(self, plan: str) -> int:
        """Returns the token budget for a given plan name."""
        map = {
            'free': self.free_token_budget,
            'starter': self.starter_token_budget,
            'pro': self.pro_token_budget,
            'enterprise': self.enterprise_token_budget,
        }
        return map.get(plan.lower(), self.free_token_budget)

    def cost_rate_for_model(self, model: str, direction: str) -> Decimal:
        """
        Returns cost per 1K tokens.
        model: 'claude', 'openai', 'gemini'
        direction: 'input', 'output'
        """
        model = model.lower()
        direction = direction.lower()
        
        attr_name = f"{model}_{direction}_cost_per_1k"
        return getattr(self, attr_name, Decimal("0.000000"))


class PlatformCredential(models.Model):
    """
    Stores platform-level OAuth app credentials (Meta, Shopify, TikTok).
    Set once by the platform operator via the Admin Panel.
    All merchants share these credentials — their per-org tokens are stored
    separately in SocialChannel / ShopifyIntegration.
    """
    PROVIDER_CHOICES = [
        ("META", "Meta (Facebook / Instagram / WhatsApp)"),
        ("SHOPIFY", "Shopify"),
        ("TIKTOK", "TikTok"),
    ]

    provider   = models.CharField(max_length=20, choices=PROVIDER_CHOICES, unique=True)
    app_id     = models.CharField(max_length=255, blank=True, help_text="Public App ID / Client Key (not secret)")
    app_secret = models.BinaryField(null=True, blank=True, help_text="Fernet-encrypted App Secret / Client Secret")
    extra      = models.BinaryField(null=True, blank=True, help_text="Fernet-encrypted JSON for extra fields (webhook_secret, verify_token, api_version, etc.)")
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=255, blank=True, help_text="Clerk user ID of last editor")

    class Meta:
        verbose_name = "Platform Credential"
        verbose_name_plural = "Platform Credentials"

    def __str__(self):
        return f"PlatformCredential({self.provider})"

    @classmethod
    def get(cls, provider: str) -> "PlatformCredential | None":
        try:
            return cls.objects.get(provider=provider)
        except cls.DoesNotExist:
            return None


class RateLimitEvent(models.Model):
    """
    Logged when periodic budget or cost cap limits are hit (429).
    """
    org = models.ForeignKey('orgs.Organization', on_delete=models.CASCADE, related_name='rate_limit_events')
    reason = models.CharField(max_length=30, help_text="BUDGET_EXCEEDED, COST_CAP_EXCEEDED")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['org', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.org.name} - {self.reason} at {self.created_at}"
