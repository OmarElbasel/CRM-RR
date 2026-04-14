from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("inbox", "0002_contact_email_contact_phone"),
    ]

    operations = [
        migrations.AddField(
            model_name="socialchannel",
            name="tiktok_open_id",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
