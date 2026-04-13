import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orgs', '0001_initial'),
        ('inbox', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Deal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('value', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('stage', models.CharField(choices=[('NEW_MESSAGE', 'New Message'), ('ENGAGED', 'Engaged'), ('PRICE_SENT', 'Price Sent'), ('ORDER_PLACED', 'Order Placed'), ('PAID', 'Paid'), ('REPEAT', 'Repeat'), ('LOST', 'Lost')], db_index=True, default='NEW_MESSAGE', max_length=20)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('URGENT', 'Urgent')], default='MEDIUM', max_length=10)),
                ('ai_score', models.IntegerField(default=0)),
                ('assigned_to_clerk_user_id', models.CharField(blank=True, db_index=True, max_length=255)),
                ('assigned_to_name', models.CharField(blank=True, max_length=255)),
                ('source_platform', models.CharField(blank=True, max_length=20)),
                ('source_post_id', models.CharField(blank=True, max_length=255)),
                ('notes', models.TextField(blank=True)),
                ('lost_reason', models.TextField(blank=True)),
                ('due_at', models.DateTimeField(blank=True, null=True)),
                ('closed_at', models.DateTimeField(blank=True, null=True)),
                ('last_customer_message_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('last_merchant_reply_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deals', to='orgs.organization')),
                ('contact', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='deals', to='inbox.contact')),
            ],
            options={
                'verbose_name': 'Deal',
                'verbose_name_plural': 'Deals',
            },
        ),
        migrations.CreateModel(
            name='DealTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('due_at', models.DateTimeField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('assigned_to_clerk_user_id', models.CharField(blank=True, db_index=True, max_length=255)),
                ('assigned_to_name', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deal_tasks', to='orgs.organization')),
                ('deal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='pipeline.deal')),
            ],
            options={
                'verbose_name': 'Deal Task',
                'verbose_name_plural': 'Deal Tasks',
            },
        ),
        migrations.CreateModel(
            name='PipelineNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('STALE_PRICE_SENT', 'Stale Price Sent'), ('STALE_ENGAGED', 'Stale Engaged')], db_index=True, max_length=30)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('HIGH', 'High')], max_length=10)),
                ('title', models.CharField(max_length=255)),
                ('body', models.TextField()),
                ('body_ar', models.TextField(blank=True)),
                ('draft_en', models.TextField(blank=True)),
                ('draft_ar', models.TextField(blank=True)),
                ('dedupe_key', models.CharField(max_length=255, unique=True)),
                ('read_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pipeline_notifications', to='orgs.organization')),
                ('deal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='pipeline.deal')),
            ],
            options={
                'verbose_name': 'Pipeline Notification',
                'verbose_name_plural': 'Pipeline Notifications',
            },
        ),
        # Deal indexes
        migrations.AddIndex(
            model_name='deal',
            index=models.Index(fields=['org', 'stage', 'updated_at'], name='pipeline_de_org_id_c6f8e5_idx'),
        ),
        migrations.AddIndex(
            model_name='deal',
            index=models.Index(fields=['org', 'ai_score'], name='pipeline_de_org_id_3a72b1_idx'),
        ),
        migrations.AddIndex(
            model_name='deal',
            index=models.Index(fields=['org', 'assigned_to_clerk_user_id'], name='pipeline_de_org_id_a1d9c4_idx'),
        ),
        migrations.AddIndex(
            model_name='deal',
            index=models.Index(fields=['org', 'last_customer_message_at'], name='pipeline_de_org_id_8b5e2f_idx'),
        ),
        # DealTask indexes
        migrations.AddIndex(
            model_name='dealtask',
            index=models.Index(fields=['org', 'deal'], name='pipeline_de_org_id_t1a2b3_idx'),
        ),
        migrations.AddIndex(
            model_name='dealtask',
            index=models.Index(fields=['org', 'completed_at'], name='pipeline_de_org_id_t4c5d6_idx'),
        ),
        migrations.AddIndex(
            model_name='dealtask',
            index=models.Index(fields=['org', 'assigned_to_clerk_user_id'], name='pipeline_de_org_id_t7e8f9_idx'),
        ),
        # PipelineNotification indexes
        migrations.AddIndex(
            model_name='pipelinenotification',
            index=models.Index(fields=['org', 'read_at', 'created_at'], name='pipeline_pi_org_id_n1a2b3_idx'),
        ),
        migrations.AddIndex(
            model_name='pipelinenotification',
            index=models.Index(fields=['org', 'notification_type'], name='pipeline_pi_org_id_n4c5d6_idx'),
        ),
    ]
