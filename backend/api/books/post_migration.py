from books.models import Category
from books.models import BookCategory


def create_book_categries():
    created_count = 0
    for category_value, _ in BookCategory.choices:
        _, created = Category.objects.get_or_create(name=category_value)  # The category value (e.g., "science_fiction")
        if created:
            created_count += 1
    if created_count:
        print(f"{created_count} categories created")
