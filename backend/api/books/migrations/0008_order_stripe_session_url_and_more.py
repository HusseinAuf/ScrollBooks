# Generated by Django 4.2.16 on 2024-12-19 07:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0007_alter_cartitem_unique_together_delete_userbook'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='stripe_session_url',
            field=models.URLField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='order',
            name='stripe_session_id',
            field=models.CharField(blank=True, default='', max_length=255),
            preserve_default=False,
        ),
    ]
