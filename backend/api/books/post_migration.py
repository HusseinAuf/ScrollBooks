from books.models import Category
from books.models import BookCategory


def create_book_categries():
    for category_value, _ in BookCategory.choices:
        _, created = Category.objects.get_or_create(name=category_value)  # The category value (e.g., "science_fiction")
        if created:
            print(f"Category {category_value} created")
