# Generated by Django 4.2.16 on 2025-02-17 18:50

import core.models
from django.db import migrations
import django_ulid.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_alter_user_options_user_is_verified_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='new_id',
            field=django_ulid.models.ULIDField(blank=True, default=core.models.new_ulid, editable=False, null=True),
        ),
    ]
