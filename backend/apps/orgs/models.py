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

    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.name} ({self.plan})'
