from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orgs', '0003_organization_api_key_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='api_key_secret',
            field=models.BinaryField(
                null=True,
                blank=True,
                help_text='Fernet-encrypted secret API key (sk_live_xxx). Never returned in API responses.',
            ),
        ),
        migrations.AddField(
            model_name='organization',
            name='stripe_customer_id',
            field=models.CharField(
                max_length=255,
                null=True,
                blank=True,
                unique=True,
                db_index=True,
                help_text='Stripe Customer ID (cus_xxx). Set on first Checkout session creation.',
            ),
        ),
        migrations.AddField(
            model_name='organization',
            name='stripe_subscription_id',
            field=models.CharField(
                max_length=255,
                null=True,
                blank=True,
                help_text='Active Stripe Subscription ID (sub_xxx). Updated by webhook handler.',
            ),
        ),
    ]
