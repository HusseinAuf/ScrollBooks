# Generated by Django 4.2.16 on 2024-12-24 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0010_order_stripe_session_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='total_price',
        ),
        migrations.AlterField(
            model_name='author',
            name='bio',
            field=models.TextField(blank=True, default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='author',
            name='date_of_birth',
            field=models.DateField(blank=True, default='2000-01-01'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='author',
            name='website',
            field=models.URLField(blank=True, default=''),
            preserve_default=False,
        ),
    ]
