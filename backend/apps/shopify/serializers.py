from rest_framework import serializers
from .models import Order, ShopifyIntegration  # noqa: F401


class OrderSerializer(serializers.ModelSerializer):
    contact_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'source', 'status', 'shopify_order_id', 'order_number',
            'customer_name', 'customer_email', 'total_amount', 'currency',
            'line_items', 'contact_id', 'contact_name', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'source', 'shopify_order_id', 'order_number', 'customer_name',
            'customer_email', 'contact_id', 'contact_name', 'created_at', 'updated_at',
        ]

    def get_contact_name(self, obj):
        return obj.contact.name if obj.contact_id else None


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'notes']

    def validate_status(self, value):
        valid = {'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'}
        if value not in valid:
            raise serializers.ValidationError('Invalid status value.')
        return value


class ManualOrderCreateSerializer(serializers.Serializer):
    contact_id = serializers.IntegerField(required=False, allow_null=True)
    line_items = serializers.ListField(
        child=serializers.DictField(), min_length=1,
        error_messages={'min_length': 'At least one line item is required / يلزم تقديم منتج واحد على الأقل'},
    )
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField(max_length=10, default='QAR')
    notes = serializers.CharField(allow_blank=True, required=False, default='')

    def validate_total_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'Total amount must be greater than zero / يجب أن يكون المبلغ الإجمالي أكبر من صفر'
            )
        return value

    def validate_contact_id(self, value):
        if value is None:
            return None
        from apps.inbox.models import Contact
        org = self.context['request'].org
        if not Contact.objects.filter(pk=value, org=org).exists():
            raise serializers.ValidationError(
                'Contact not found in your account / جهة الاتصال غير موجودة في حسابك'
            )
        return value
