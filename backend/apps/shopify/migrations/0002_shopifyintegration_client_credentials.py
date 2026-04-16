from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shopify", "0001_initial"),
    ]

    operations = [
        # Make access_token nullable — client-credentials integrations start
        # without a token until the first exchange.
        migrations.AlterField(
            model_name="shopifyintegration",
            name="access_token",
            field=models.BinaryField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name="shopifyintegration",
            name="client_id",
            field=models.CharField(max_length=255, blank=True, default=""),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="shopifyintegration",
            name="client_secret",
            field=models.BinaryField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name="shopifyintegration",
            name="token_expires_at",
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
