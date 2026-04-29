"""
Seed demo data for portfolio / local-development use.

Creates one Organization, a handful of Contacts, Deals, and Messages so the
frontend has something to render on first run. Idempotent: re-running updates
the demo org in place rather than duplicating.

Usage:
    python manage.py seed_demo
    python manage.py seed_demo --reset   # wipe demo org first
"""
from __future__ import annotations

import random
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.inbox.models import Contact, Message
from apps.orgs.models import Organization
from apps.pipeline.models import Deal

DEMO_CLERK_ORG_ID = "org_demo_portfolio"

CONTACTS = [
    ("Layla Al-Mansour", "INSTAGRAM", "ig_1001", 92, Decimal("4200")),
    ("Omar Al-Khalifa", "WHATSAPP", "wa_1002", 78, Decimal("1800")),
    ("Fatima Al-Sayed", "INSTAGRAM", "ig_1003", 65, Decimal("950")),
    ("Hassan Al-Thani", "FACEBOOK", "fb_1004", 88, Decimal("3300")),
    ("Noor Al-Kuwari", "WHATSAPP", "wa_1005", 54, Decimal("420")),
    ("Yousef Al-Attiyah", "INSTAGRAM", "ig_1006", 71, Decimal("1500")),
]

DEALS = [
    ("Bulk abaya order — Eid collection", "ENGAGED", "HIGH", Decimal("4200"), 0),
    ("Wedding dress consultation", "PRICE_SENT", "URGENT", Decimal("8500"), 1),
    ("Kids' clothing bundle", "NEW_MESSAGE", "MEDIUM", Decimal("950"), 2),
    ("Corporate gift hampers x12", "ORDER_PLACED", "HIGH", Decimal("3300"), 3),
    ("Single perfume bottle", "PAID", "LOW", Decimal("420"), 4),
    ("Repeat customer — fragrance set", "REPEAT", "MEDIUM", Decimal("1500"), 5),
]

MESSAGES = [
    ("INBOUND", "السلام عليكم، عندكم العباية الجديدة بمقاس L؟"),
    ("OUTBOUND", "وعليكم السلام! نعم متوفرة، السعر 420 ريال. تحبين أرسل لك صورة؟"),
    ("INBOUND", "نعم من فضلك"),
    ("INBOUND", "Hi, do you ship to Doha within 2 days?"),
    ("OUTBOUND", "Yes! Same-day in Doha for orders before 2pm. Free over QAR 500."),
    ("INBOUND", "Perfect, I'll place the order now."),
]


class Command(BaseCommand):
    help = "Seed demo organisation, contacts, deals, and messages for local dev / portfolio."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete the existing demo org before seeding.",
        )

    def handle(self, *args, **opts):
        if opts["reset"]:
            deleted, _ = Organization.objects.filter(clerk_org_id=DEMO_CLERK_ORG_ID).delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} demo records."))

        org, created = Organization.objects.update_or_create(
            clerk_org_id=DEMO_CLERK_ORG_ID,
            defaults={
                "name": "Rawaj Demo Boutique",
                "plan": "pro",
                "is_active": True,
                "monthly_generation_limit": 500,
                "generations_used_this_month": 142,
                "monthly_cost_cap_usd": Decimal("50.00"),
                "monthly_cost_usd": Decimal("12.40"),
                "owner_email": "demo@rawaj.example",
                "api_key_public": "pk_demo_portfolio_xxxxxxxxxxxx",
                "onboarding_state": {
                    "created_workspace": True,
                    "connected_channel": True,
                    "first_generation": True,
                    "invited_teammate": False,
                },
            },
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} demo org: {org.name} (id={org.id})"
            )
        )

        # Wipe child records so seed stays deterministic on re-runs.
        Message.objects.filter(org=org).delete()
        Deal.objects.filter(org=org).delete()
        Contact.objects.filter(org=org).delete()

        contacts: list[Contact] = []
        for name, platform, platform_id, score, spend in CONTACTS:
            contacts.append(
                Contact.objects.create(
                    org=org,
                    name=name,
                    platform=platform,
                    platform_id=platform_id,
                    ai_score=score,
                    total_spend=spend,
                    tags=["demo"],
                )
            )
        self.stdout.write(self.style.SUCCESS(f"Created {len(contacts)} contacts."))

        deals_created = 0
        now = timezone.now()
        for title, stage, priority, value, contact_idx in DEALS:
            Deal.objects.create(
                org=org,
                contact=contacts[contact_idx],
                title=title,
                stage=stage,
                priority=priority,
                value=value,
                ai_score=random.randint(50, 95),
                source_platform=contacts[contact_idx].platform,
                last_customer_message_at=now - timedelta(hours=random.randint(1, 48)),
            )
            deals_created += 1
        self.stdout.write(self.style.SUCCESS(f"Created {deals_created} deals."))

        msg_count = 0
        for i, (direction, content) in enumerate(MESSAGES):
            contact = contacts[i % len(contacts)]
            Message.objects.create(
                org=org,
                contact=contact,
                platform=contact.platform,
                platform_msg_id=f"demo_msg_{i}",
                direction=direction,
                content=content,
            )
            msg_count += 1
        self.stdout.write(self.style.SUCCESS(f"Created {msg_count} messages."))

        self.stdout.write(
            self.style.SUCCESS(
                "\nDemo data ready. Start the frontend with NEXT_PUBLIC_DEMO_MODE=true to view it."
            )
        )
