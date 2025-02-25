# Generated by Django 4.2.16 on 2024-12-18 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0007_alter_cartitem_unique_together_delete_userbook'),
        ('users', '0008_delete_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='favorite_books',
            field=models.ManyToManyField(blank=True, related_name='favorites', to='books.book'),
        ),
        migrations.AddField(
            model_name='user',
            name='owned_books',
            field=models.ManyToManyField(blank=True, related_name='owners', to='books.book'),
        ),
    ]
