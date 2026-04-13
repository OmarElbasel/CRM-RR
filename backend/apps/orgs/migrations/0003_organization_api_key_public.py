from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orgs', '0002_organization_budget_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='api_key_public',
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text='Public API key for widget embed. Format: pk_live_xxx or pk_test_xxx.',
                max_length=64,
                null=True,
                unique=True,
            ),
        ),
    ]
