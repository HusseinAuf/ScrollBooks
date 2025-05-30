# Generated by Django 4.2.16 on 2025-02-06 06:58

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0015_book_currency'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='language',
            field=models.CharField(choices=[('en', 'English'), ('fr', 'French'), ('de', 'German'), ('es', 'Spanish'), ('ar', 'Arabic')], default='en', max_length=2),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(choices=[('fiction', 'Fiction'), ('mystery', 'Mystery/Thriller'), ('romance', 'Romance'), ('science_fiction', 'Science Fiction'), ('fantasy', 'Fantasy'), ('non_fiction', 'Non-Fiction'), ('biography', 'Biography/Autobiography'), ('young_adult', 'Young Adult'), ('children', "Children's Books"), ('historical_fiction', 'Historical Fiction'), ('horror', 'Horror'), ('self_help', 'Self-Help'), ('graphic_novels', 'Graphic Novels'), ('poetry', 'Poetry'), ('classics', 'Classics'), ('education', 'Education'), ('history', 'History'), ('art', 'Art & Photography'), ('science', 'Science'), ('religion', 'Religion/Spirituality'), ('business', 'Business & Economics'), ('health', 'Health & Wellness'), ('cooking', 'Cooking/Food')], max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)]),
        ),
    ]
