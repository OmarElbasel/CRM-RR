from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("inbox", "0003_tiktok_platform"),
        ("orgs", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PostSchedule",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "platform",
                    models.CharField(
                        choices=[("INSTAGRAM", "Instagram"), ("TIKTOK", "TikTok")],
                        max_length=20,
                    ),
                ),
                ("content", models.TextField()),
                ("media_url", models.CharField(blank=True, max_length=2048)),
                ("scheduled_at", models.DateTimeField(db_index=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "Pending"),
                            ("PUBLISHED", "Published"),
                            ("FAILED", "Failed"),
                        ],
                        db_index=True,
                        default="PENDING",
                        max_length=20,
                    ),
                ),
                ("error_message", models.TextField(blank=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "channel",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="inbox.socialchannel",
                    ),
                ),
                (
                    "org",
                    models.ForeignKey(
                        db_index=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="orgs.organization",
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["org", "status"], name="scheduler_p_org_id_11111_idx"
                    ),
                    models.Index(
                        fields=["status", "scheduled_at"],
                        name="scheduler_p_status_22222_idx",
                    ),
                    models.Index(
                        fields=["org", "scheduled_at"],
                        name="scheduler_p_org_id_33333_idx",
                    ),
                ],
            },
        ),
        migrations.CreateModel(
            name="BroadcastMessage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("template_name", models.CharField(max_length=255)),
                ("message_ar", models.TextField()),
                ("message_en", models.TextField()),
                ("recipients", models.JSONField(default=list)),
                ("scheduled_at", models.DateTimeField(blank=True, null=True)),
                ("sent_at", models.DateTimeField(blank=True, null=True)),
                ("sent_count", models.PositiveIntegerField(default=0)),
                ("failed_count", models.PositiveIntegerField(default=0)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("DRAFT", "Draft"),
                            ("SENDING", "Sending"),
                            ("SENT", "Sent"),
                            ("FAILED", "Failed"),
                        ],
                        default="DRAFT",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "org",
                    models.ForeignKey(
                        db_index=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="orgs.organization",
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["org", "status"], name="scheduler_b_org_id_44444_idx"
                    ),
                    models.Index(
                        fields=["org", "created_at"],
                        name="scheduler_b_org_id_55555_idx",
                    ),
                ],
            },
        ),
    ]
