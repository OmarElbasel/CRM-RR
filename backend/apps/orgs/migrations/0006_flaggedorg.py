from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orgs', '0005_organization_cost_cap'),
    ]

    operations = [
        migrations.CreateModel(
            name='FlaggedOrg',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('org', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='abuse_flag',
                    to='orgs.organization',
                )),
                ('flagged_at', models.DateTimeField(auto_now_add=True)),
                ('message_volume_24h', models.IntegerField(
                    help_text='24-hour inbound message count at time of flagging.',
                )),
                ('trailing_30d_avg', models.FloatField(
                    help_text='Trailing 30-day daily average at time of flagging.',
                )),
                ('status', models.CharField(
                    choices=[('pending', 'Pending Review'), ('cleared', 'Cleared'), ('suspended', 'Suspended')],
                    default='pending',
                    max_length=20,
                )),
                ('cleared_at', models.DateTimeField(blank=True, null=True)),
                ('notes', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Flagged Organization',
                'verbose_name_plural': 'Flagged Organizations',
                'ordering': ['-flagged_at'],
            },
        ),
    ]
