import logging
import time
from datetime import timedelta
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)

# ── Cart recovery prompt templates (Constitution III: Arabic + English) ───────

CART_RECOVERY_SYSTEM_PROMPT_AR = """أنت مساعد متجر إلكتروني خليجي متخصص.
مهمتك إرسال رسالة ودية تُذكّر العميل بالمنتجات التي تركها في سلة التسوق.
الأسلوب: ودي، غير ضاغط، محفز للشراء.
الرد يجب أن يكون JSON فقط: {"message_ar": "...", "message_en": "..."}
الرسالة العربية بالعامية الخليجية، والإنجليزية مهنية."""


# ── Initial 30-day sync ───────────────────────────────────────────────────────

@shared_task(name='apps.shopify.tasks.sync_shopify_orders_initial', bind=True, max_retries=2)
def sync_shopify_orders_initial(self, integration_id: int):
    """
    Pull the last 30 days of Shopify orders for a newly installed store.
    Paginates through the Orders API and upserts each order.
    Respects Shopify's 2 req/s rate limit (0.6s sleep between pages).
    """
    from apps.shopify.models import ShopifyIntegration, Order  # noqa: F401
    from apps.shopify.services.shopify import ShopifyClient, ShopifyClientError

    try:
        integration = ShopifyIntegration.objects.get(pk=integration_id)
    except ShopifyIntegration.DoesNotExist:
        logger.warning('sync_shopify_orders_initial: integration %s not found', integration_id)
        return

    try:
        client = ShopifyClient.from_integration(integration)
    except ShopifyClientError as exc:
        logger.error('sync_shopify_orders_initial: could not get valid token for integration %s: %s', integration_id, exc)
        return

    # Enqueue customer sync first; fall back to inline if Celery is unavailable
    try:
        sync_shopify_customers_initial.apply_async(args=[integration_id])
    except Exception:
        try:
            sync_shopify_customers_initial.apply(args=[integration_id])
        except Exception as exc:
            logger.warning('sync_shopify_orders_initial: customer sync also failed inline: %s', exc)

    thirty_days_ago = (timezone.now() - timedelta(days=30)).strftime('%Y-%m-%dT%H:%M:%S%z')
    page_info = None
    total = 0

    while True:
        try:
            result = client.get_orders(
                created_at_min=thirty_days_ago if page_info is None else None,
                page_info=page_info,
            )
        except ShopifyClientError as exc:
            logger.error('Initial sync failed for integration %s: %s', integration_id, exc)
            integration.is_active = False
            integration.save(update_fields=['is_active'])
            return

        orders = result['orders']
        for order_data in orders:
            _upsert_order(integration, order_data)
            total += 1

        # Parse next page from Link header
        link_header = result.get('link_header', '')
        next_page = _parse_next_page_info(link_header)
        if not next_page:
            break
        page_info = next_page
        time.sleep(0.6)  # Shopify 2 req/s limit

    logger.info('sync_shopify_orders_initial: integration=%s synced %d orders', integration_id, total)


# ── Initial customer sync ────────────────────────────────────────────────────

@shared_task(name='apps.shopify.tasks.sync_shopify_customers_initial', bind=True, max_retries=2)
def sync_shopify_customers_initial(self, integration_id: int):
    """
    Pull all customers from Shopify and save as Contacts.
    Paginates through the Customers API.
    """
    from apps.shopify.models import ShopifyIntegration
    from apps.shopify.services.shopify import ShopifyClient, ShopifyClientError

    try:
        integration = ShopifyIntegration.objects.get(pk=integration_id)
    except ShopifyIntegration.DoesNotExist:
        return

    try:
        client = ShopifyClient.from_integration(integration)
    except ShopifyClientError as exc:
        logger.error('sync_shopify_customers_initial: could not get valid token for integration %s: %s', integration_id, exc)
        return

    page_info = None
    total = 0

    while True:
        try:
            result = client.get_customers(page_info=page_info)
        except ShopifyClientError as exc:
            logger.error('Initial customer sync failed for integration %s: %s', integration_id, exc)
            return

        customers = result['customers']
        for cust_data in customers:
            _upsert_contact(integration, cust_data)
            total += 1

        link_header = result.get('link_header', '')
        next_page = _parse_next_page_info(link_header)
        if not next_page:
            break
        page_info = next_page
        time.sleep(0.6)

    logger.info('sync_shopify_customers_initial: integration=%s synced %d customers', integration_id, total)


# ── Cart recovery ─────────────────────────────────────────────────────────────

@shared_task(name='apps.shopify.tasks.send_cart_recovery', bind=True, max_retries=2)
def send_cart_recovery(self, cart_id: int):
    """
    Draft a WhatsApp abandoned cart recovery message via AI.
    Runs 1 hour after carts/create webhook.
    Skips if: cart already converted to order, or recovery already sent.
    Constitution II: uses get_ai_client().
    Constitution III: Arabic + English drafts.
    Constitution VI: records AIUsage.
    """
    import json
    from apps.shopify.models import AbandonedCart
    from apps.generate.ai_client import get_ai_client
    from apps.generate.models import AIUsage
    from apps.inbox.models import Message, SocialChannel

    try:
        cart = AbandonedCart.objects.select_related('org', 'contact', 'integration').get(pk=cart_id)
    except AbandonedCart.DoesNotExist:
        logger.warning('send_cart_recovery: cart %s not found', cart_id)
        return

    if cart.converted_at:
        logger.info('send_cart_recovery: cart %s converted — skipping', cart_id)
        return
    if cart.recovery_sent_at:
        logger.info('send_cart_recovery: cart %s already recovered — skipping', cart_id)
        return

    # Build cart summary for the prompt
    items_summary = ', '.join(
        f"{li.get('title', 'Product')} x{li.get('quantity', 1)}"
        for li in (cart.line_items or [])[:5]
    )
    total = f'{cart.total_amount} {cart.currency}' if cart.total_amount else ''
    checkout_link = cart.checkout_url or ''
    customer_name = ''
    if cart.contact_id:
        customer_name = cart.contact.name or ''

    prompt = (
        f'Customer name: {customer_name or "Valued customer"}\n'
        f'Cart items: {items_summary or "items"}\n'
        f'Cart total: {total}\n'
        f'Checkout link: {checkout_link}'
    )

    client = get_ai_client()
    draft_ar = ''
    draft_en = ''
    try:
        from apps.generate.ai_client.base import AIResponse  # noqa: F401
        response = client.generate(prompt, CART_RECOVERY_SYSTEM_PROMPT_AR, max_tokens=300)
        AIUsage.objects.create(
            org=cart.org,
            model=response.model,
            tokens_in=response.tokens_in,
            tokens_out=response.tokens_out,
            cost_usd=response.cost_usd,
            language='bilingual',
            category='other',
            tone='casual',
            cache_hit=False,
            success=True,
        )
        raw = response.content.strip()
        if raw.startswith('```'):
            raw = raw.strip('```json').strip('```')
        data = json.loads(raw)
        draft_ar = data.get('message_ar', '')
        draft_en = data.get('message_en', '')
    except Exception as exc:
        logger.error('send_cart_recovery: AI draft failed for cart %s: %s', cart_id, exc)
        draft_en = f'Hi {customer_name or "there"}! You left items in your cart. Complete your purchase here: {checkout_link}'
        draft_ar = f'مرحباً {customer_name or ""}! لديك منتجات في سلة التسوق. أكمل طلبك: {checkout_link}'

    # Create a draft outbound Message in the contact's WhatsApp channel if available
    if cart.contact_id:
        wa_channel = SocialChannel.objects.filter(
            org=cart.org,
            platform='WHATSAPP',
            is_active=True,
        ).first()
        if wa_channel:
            Message.objects.create(
                org=cart.org,
                contact=cart.contact,
                channel=wa_channel,
                platform='WHATSAPP',
                platform_msg_id=f'cart_recovery_{cart_id}',
                direction='OUTBOUND',
                content=draft_en,
                content_ar=draft_ar,
                ai_draft=draft_en,
                ai_draft_ar=draft_ar,
                read=False,
            )

    cart.recovery_sent_at = timezone.now()
    cart.save(update_fields=['recovery_sent_at'])
    logger.info('send_cart_recovery: cart %s — recovery draft created', cart_id)


# ── Single order sync (webhook) ───────────────────────────────────────────────

@shared_task(name='apps.shopify.tasks.sync_shopify_order', bind=True, max_retries=3)
def sync_shopify_order(self, integration_id: int, order_data: dict):
    """
    Create or update an Order from a Shopify webhook payload.
    Then attempt lead-to-order attribution.
    Idempotent by shopify_order_id.
    Constitution I: scoped to integration.org.
    """
    from apps.shopify.models import ShopifyIntegration
    from apps.shopify.services.attribution import link_order_to_contact

    try:
        integration = ShopifyIntegration.objects.select_related('org').get(pk=integration_id)
    except ShopifyIntegration.DoesNotExist:
        logger.warning('sync_shopify_order: integration %s not found', integration_id)
        return

    try:
        # Sync customer first
        customer_data = order_data.get('customer')
        if customer_data:
            _upsert_contact(integration, customer_data)

        order = _upsert_order(integration, order_data)
        # Mark abandoned cart as converted if applicable
        cart_token = order_data.get('cart_token')
        if cart_token:
            from apps.shopify.models import AbandonedCart
            from django.utils import timezone as tz
            AbandonedCart.objects.filter(
                shopify_cart_token=cart_token,
                converted_at__isnull=True,
            ).update(converted_at=tz.now())
        # Attribution
        link_order_to_contact(order)
    except Exception as exc:
        logger.error(
            'sync_shopify_order: failed for integration=%s order=%s: %s',
            integration_id, order_data.get('id'), exc,
        )
        raise self.retry(exc=exc, countdown=60)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _upsert_contact(integration, customer_data: dict):
    """Create or update a Contact from Shopify customer data."""
    from apps.inbox.models import Contact
    shopify_id = str(customer_data.get('id', ''))
    if not shopify_id:
        return None

    email = customer_data.get('email')
    phone = customer_data.get('phone')
    first_name = customer_data.get('first_name') or ''
    last_name = customer_data.get('last_name') or ''
    full_name = f"{first_name} {last_name}".strip()

    # Note: We use 'SHOPIFY' as the platform here. Even though Contact model 
    # PLATFORM_CHOICES has INSTAGRAM, WHATSAPP, etc., we can extend it or use a default.
    # Looking at apps/inbox/models.py, PLATFORM_CHOICES is:
    # [("INSTAGRAM", "Instagram"), ("WHATSAPP", "WhatsApp Business"), ("FACEBOOK", "Facebook"), ("TIKTOK", "TikTok")]
    # We should probably use WHATSAPP as a placeholder or better, add SHOPIFY to Contact.PLATFORM_CHOICES.
    # For now, let's check if we can use an alternative.
    
    # Actually, let's keep it simple and just update/create by email/phone if possible, 
    # or use WHATSAPP as a dummy if needed, but the best way is to add SHOPIFY to the choices.
    
    contact, created = Contact.objects.update_or_create(
        org=integration.org,
        platform_id=shopify_id,
        defaults={
            'platform': 'SHOPIFY',
            'name': full_name,
            'email': email or None,
            'phone': phone or None,
        }
    )
    return contact


def _upsert_order(integration, order_data: dict):
    """Create or update an Order record from a Shopify order payload."""
    from apps.shopify.models import Order
    shopify_id = str(order_data['id'])
    customer = order_data.get('customer') or {}
    line_items = [
        {'title': li.get('title', ''), 'quantity': li.get('quantity', 1), 'price': li.get('price', '0')}
        for li in order_data.get('line_items', [])
    ]
    fulfillment_raw = order_data.get('fulfillment_status')
    financial_raw = order_data.get('financial_status')
    status = _map_shopify_status(fulfillment_raw, financial_raw)
    print(
        f'_upsert_order: shopify_id={shopify_id} financial_status={financial_raw!r} '
        f'fulfillment_status={fulfillment_raw!r} -> {status} currency={order_data.get("currency")}'
    )
    order, _ = Order.objects.update_or_create(
        shopify_order_id=shopify_id,
        defaults={
            'org': integration.org,
            'source': 'SHOPIFY',
            'status': status,
            'order_number': str(order_data.get('order_number', '') or order_data.get('name', '')),
            'shopify_customer_id': str(customer.get('id', '')),
            'customer_name': f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip(),
            'customer_email': customer.get('email') or None,
            'customer_phone': customer.get('phone') or None,
            'total_amount': order_data.get('total_price', '0'),
            'currency': order_data.get('currency', 'QAR'),
            'line_items': line_items,
        },
    )
    return order


def _map_shopify_status(fulfillment_status: str | None, financial_status: str | None) -> str:
    if fulfillment_status == 'fulfilled':
        return 'DELIVERED'
    if fulfillment_status == 'partial':
        return 'PROCESSING'
    if fulfillment_status == 'restocked':
        return 'RETURNED'
    if financial_status == 'paid':
        return 'CONFIRMED'
    if financial_status in ('authorized', 'partially_paid'):
        return 'PROCESSING'
    return 'PENDING'


def _parse_next_page_info(link_header: str) -> str | None:
    """Extract page_info from Shopify Link header for cursor pagination."""
    if 'rel="next"' not in link_header:
        return None
    for part in link_header.split(','):
        if 'rel="next"' in part:
            url = part.split(';')[0].strip().strip('<>')
            for param in url.split('?')[1].split('&'):
                if param.startswith('page_info='):
                    return param.split('=', 1)[1]
    return None
