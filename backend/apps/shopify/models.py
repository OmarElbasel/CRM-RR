from django.db import models


class ShopifyIntegration(models.Model):
    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='shopify_integrations',
    )
    shop_domain = models.CharField(max_length=255, unique=True, db_index=True)
    shop_id = models.CharField(max_length=255, null=True, blank=True)
    access_token = models.BinaryField()
    is_active = models.BooleanField(default=True, db_index=True)
    installed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('org',)]
        verbose_name = 'Shopify Integration'
        verbose_name_plural = 'Shopify Integrations'

    def __str__(self):
        return f'{self.org} — {self.shop_domain}'


class Order(models.Model):
    SOURCE_CHOICES = [
        ('SHOPIFY', 'Shopify'),
        ('WHATSAPP', 'WhatsApp'),
        ('MANUAL', 'Manual'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('RETURNED', 'Returned'),
    ]

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='orders',
        db_index=True,
    )
    contact = models.ForeignKey(
        'inbox.Contact',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
    )
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, db_index=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, db_index=True, default='PENDING'
    )
    shopify_order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    shopify_customer_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    customer_name = models.CharField(max_length=255, blank=True)
    customer_email = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    customer_phone = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='QAR')
    line_items = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        indexes = [
            models.Index(fields=['org', 'status', 'created_at']),
            models.Index(fields=['org', 'source', 'created_at']),
            models.Index(fields=['org', 'contact']),
            models.Index(fields=['org', 'created_at']),
        ]

    def __str__(self):
        return f'Order {self.shopify_order_id or self.pk} ({self.get_status_display()})'


class AbandonedCart(models.Model):
    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        related_name='abandoned_carts',
        db_index=True,
    )
    integration = models.ForeignKey(
        ShopifyIntegration,
        on_delete=models.CASCADE,
        related_name='abandoned_carts',
    )
    contact = models.ForeignKey(
        'inbox.Contact',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='abandoned_carts',
    )
    shopify_cart_token = models.CharField(max_length=255, unique=True)
    customer_email = models.CharField(max_length=255, null=True, blank=True)
    customer_phone = models.CharField(max_length=50, null=True, blank=True)
    line_items = models.JSONField(default=list)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='QAR')
    checkout_url = models.TextField(blank=True)
    recovery_sent_at = models.DateTimeField(null=True, blank=True)
    converted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Abandoned Cart'
        verbose_name_plural = 'Abandoned Carts'
        indexes = [
            models.Index(fields=['org', 'recovery_sent_at']),
            models.Index(fields=['org', 'converted_at']),
        ]

    def __str__(self):
        return f'AbandonedCart {self.shopify_cart_token}'
