from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlatformCredential',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(
                    choices=[
                        ('META', 'Meta (Facebook / Instagram / WhatsApp)'),
                        ('SHOPIFY', 'Shopify'),
                        ('TIKTOK', 'TikTok'),
                    ],
                    max_length=20,
                    unique=True,
                )),
                ('app_id', models.CharField(blank=True, help_text='Public App ID / Client Key (not secret)', max_length=255)),
                ('app_secret', models.BinaryField(blank=True, help_text='Fernet-encrypted App Secret / Client Secret', null=True)),
                ('extra', models.BinaryField(blank=True, help_text='Fernet-encrypted JSON for extra fields (webhook_secret, verify_token, api_version, etc.)', null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('updated_by', models.CharField(blank=True, help_text='Clerk user ID of last editor', max_length=255)),
            ],
            options={
                'verbose_name': 'Platform Credential',
                'verbose_name_plural': 'Platform Credentials',
            },
        ),
    ]
