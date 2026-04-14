import logging
from django.db.models import F
from apps.inbox.models import Contact
from apps.pipeline.models import Deal

logger = logging.getLogger(__name__)

DEAL_STAGE_MAP = {
    'CONFIRMED': 'ORDER_PLACED',
    'DELIVERED': 'PAID',
}


def link_order_to_contact(order) -> 'Contact | None':
    """
    Match order to a CRM contact by email (primary) then phone (fallback).
    Updates contact.total_spend and deal stage when matched.
    All queries scoped to order.org (Constitution I).
    Returns matched contact or None.
    """
    org = order.org
    contact = None

    if order.customer_email:
        contact = Contact.objects.filter(org=org, email=order.customer_email).first()

    if contact is None and order.customer_phone:
        contact = Contact.objects.filter(org=org, phone=order.customer_phone).first()

    if contact is None:
        return None

    # Link order to contact
    order.contact = contact
    order.save(update_fields=['contact'])

    # Increment total_spend atomically
    Contact.objects.filter(pk=contact.pk).update(
        total_spend=F('total_spend') + order.total_amount
    )

    # Update deal stage if applicable
    new_stage = DEAL_STAGE_MAP.get(order.status)
    if new_stage:
        Deal.objects.filter(
            org=org,
            contact=contact,
        ).exclude(stage__in=['PAID', 'LOST']).update(stage=new_stage)

    logger.info('link_order_to_contact: order=%s matched contact=%s', order.pk, contact.pk)
    return contact
