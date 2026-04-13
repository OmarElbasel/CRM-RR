import logging

from django.db import transaction
from django.utils import timezone

from apps.pipeline.models import Deal

logger = logging.getLogger(__name__)


def get_active_deal(org, contact):
    """Return the current open deal for this (org, contact), or None."""
    return Deal.objects.filter(
        org=org,
        contact=contact,
        stage__in=['NEW_MESSAGE', 'ENGAGED', 'PRICE_SENT', 'ORDER_PLACED'],
    ).order_by('-created_at').first()


def sync_deal_from_message(org, contact, message):
    """
    Auto-create or update a deal from an inbound message.
    - First inbound from unseen contact → create NEW_MESSAGE deal
    - Subsequent messages → update timestamps on active deal
    Returns the Deal instance.
    """
    with transaction.atomic():
        deal = get_active_deal(org, contact)

        if deal is None:
            deal = Deal.objects.create(
                org=org,
                contact=contact,
                title=contact.name or f'Lead from {contact.platform}',
                stage='NEW_MESSAGE',
                source_platform=contact.platform,
                last_customer_message_at=message.sent_at or timezone.now(),
            )
            logger.info(
                'Auto-created deal=%d for contact=%d org=%d',
                deal.pk, contact.pk, org.pk,
            )
        else:
            deal.last_customer_message_at = message.sent_at or timezone.now()
            deal.save(update_fields=['last_customer_message_at', 'updated_at'])

    return deal


def create_manual_deal(org, validated_data):
    """Create a deal from manual merchant input."""
    contact_id = validated_data.pop('contact_id', None)
    contact = None
    if contact_id:
        from apps.inbox.models import Contact
        contact = Contact.objects.filter(pk=contact_id, org=org).first()

    return Deal.objects.create(
        org=org,
        contact=contact,
        **validated_data,
    )
