from django.contrib import admin
from .models import ShopifyIntegration, Order, AbandonedCart


@admin.register(ShopifyIntegration)
class ShopifyIntegrationAdmin(admin.ModelAdmin):
    list_display = ['org', 'shop_domain', 'is_active', 'installed_at']
    list_filter = ['is_active']
    search_fields = ['shop_domain', 'org__name']
    readonly_fields = ['installed_at', 'updated_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['pk', 'org', 'shopify_order_id', 'source', 'status', 'customer_name', 'total_amount', 'currency', 'created_at']
    list_filter = ['source', 'status', 'org']
    search_fields = ['shopify_order_id', 'customer_name', 'customer_email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AbandonedCart)
class AbandonedCartAdmin(admin.ModelAdmin):
    list_display = ['pk', 'org', 'shopify_cart_token', 'recovery_sent_at', 'converted_at', 'created_at']
    list_filter = ['org']
    readonly_fields = ['created_at']
