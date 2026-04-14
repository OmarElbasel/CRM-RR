from decimal import Decimal

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orgs', '0004_organization_billing_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='monthly_cost_cap_usd',
            field=models.DecimalField(
                max_digits=8,
                decimal_places=2,
                default=Decimal('10.00'),
                help_text='Monthly AI spend hard cap in USD. Enterprise default = 500.',
            ),
        ),
        migrations.AddField(
            model_name='organization',
            name='monthly_cost_usd',
            field=models.DecimalField(
                max_digits=8,
                decimal_places=2,
                default=Decimal('0.00'),
                help_text='Accumulated AI cost in USD this month. Incremented atomically after each generation.',
            ),
        ),
        migrations.AddField(
            model_name='organization',
            name='ai_suspended',
            field=models.BooleanField(
                default=False,
                help_text='Set to True when monthly_cost_usd >= monthly_cost_cap_usd. Cleared on month reset.',
            ),
        ),
        migrations.AddField(
            model_name='organization',
            name='owner_email',
            field=models.EmailField(
                null=True,
                blank=True,
                help_text='Primary owner email. Populated from Clerk JWT on first authentication.',
            ),
        ),
    ]
