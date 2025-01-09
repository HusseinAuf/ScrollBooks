import factory
from django.test import TestCase
from django.db.utils import IntegrityError
from users.models import User
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
from decimal import Decimal
from books.tests.factories import (
    AuthorFactory,
    BookFactory,
    CartFactory,
    CartItemFactory,
    OrderFactory,
    OrderItemFactory,
    ReviewFactory,
    CategoryFactory,
)
from users.tests.factories import UserFactory


class BaseTestCase(TestCase):
    def setUp(self):
        pass


class AuthorModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.author = AuthorFactory()

    def test_str_method(self):
        self.assertEqual(str(self.author), self.author.user.email)


class CategoryModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.category = Category.objects.first()

    def test_str_method(self):
        self.assertEqual(str(self.category), self.category.name)


class OrderModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.order = OrderFactory()

    def test_str_method(self):
        self.assertEqual(str(self.order), f"Order {self.order.id} by {self.order.user.email}")

    def test_status_field(self):
        self.assertEqual(self.order.status, OrderStatus.PENDING)


class OrderItemModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.order_item = OrderItemFactory()

    def test_str_method(self):
        self.assertEqual(
            str(self.order_item),
            f"{self.order_item.book.title} in Order {self.order_item.order.id}",
        )


class ReviewModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.review = ReviewFactory()

    def test_str_method(self):
        self.assertEqual(
            str(self.review),
            f"Review by {self.review.user.email} for {self.review.book.title}",
        )


class CartModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.cart_items = CartItemFactory.create_batch(2, cart=self.user.cart, book__price=Decimal("10.00"))

    def test_str_method(self):
        self.assertEqual(str(self.user.cart), f"Cart of {self.user.email}")

    def test_total_price_property(self):
        self.assertEqual(self.user.cart.total_price, Decimal("20.00"))


class CartItemModelTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.cart_item = CartItemFactory(cart=self.user.cart, book__price=Decimal("10.00"))

    def test_str_method(self):
        self.assertEqual(
            str(self.cart_item),
            f"{self.cart_item.cart.user.email} | {self.cart_item.book.title}",
        )

    def test_price_property(self):
        self.assertEqual(self.cart_item.price, Decimal("10.00"))
