import factory
from factory import Faker, SubFactory, LazyFunction
from factory.django import DjangoModelFactory
from users.tests.factories import UserFactory
from books.models import (
    Author,
    Category,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Book,
    BookCategory,
    OrderStatus,
    Review,
)


class AuthorFactory(DjangoModelFactory):
    class Meta:
        model = Author

    user = SubFactory(UserFactory)
    bio = Faker("text")
    website = Faker("url")
    date_of_birth = Faker("date_of_birth")


class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    name = Faker("random_element", elements=[choice[0] for choice in Category.name.field.choices])


class BookFactory(DjangoModelFactory):
    class Meta:
        model = Book

    author = SubFactory(AuthorFactory)
    title = Faker("sentence")
    description = Faker("paragraph")
    price = Faker("pydecimal", left_digits=4, right_digits=2, positive=True)
    file = Faker("file_path")
    cover_image = Faker("file_path")
    published_date = Faker("date")

    @factory.post_generation
    def categories(self, create, extracted, **kwargs):
        if create and extracted:
            self.categories.add(*extracted)


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    user = SubFactory(UserFactory)
    # stripe_session_id = Faker("uuid4")
    # stripe_session_url = Faker("url")


class OrderItemFactory(DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = SubFactory(OrderFactory)
    book = SubFactory(BookFactory)
    price = factory.LazyAttribute(lambda obj: obj.book.price)


class ReviewFactory(DjangoModelFactory):
    class Meta:
        model = Review

    user = SubFactory(UserFactory)
    book = SubFactory(BookFactory)
    rating = Faker("random_int", min=1, max=5)
    comment = Faker("text")


class CartFactory(DjangoModelFactory):
    class Meta:
        model = Cart

    user = SubFactory(UserFactory)


class CartItemFactory(DjangoModelFactory):
    class Meta:
        model = CartItem

    cart = SubFactory(CartFactory)
    book = SubFactory(BookFactory)
