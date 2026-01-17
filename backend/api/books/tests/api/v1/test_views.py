from decimal import Decimal

import factory
from books.models import Author, Book, CartItem, Order, Review
from books.tests.factories import (
    AuthorFactory,
    BookFactory,
    CartFactory,
    CartItemFactory,
    OrderFactory,
    OrderItemFactory,
    ReviewFactory,
)
from core.tests.tests import BaseAPITestCase
from core.tests.utils import create_mock_image, create_mock_pdf_file
from django.conf import settings
from django.urls import reverse
from rest_framework.test import APIClient
from users.tests.factories import UserFactory


class BaseBookAPITestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        # Author client
        self.author = AuthorFactory()
        self.author_user = self.author.user
        self.author_client = APIClient()
        self.author_client.force_authenticate(self.author_user)

        # Reader/User client
        self.reader_user = UserFactory()
        self.reader_client = APIClient()
        self.reader_client.force_authenticate(self.reader_user)

        self.users = UserFactory.create_batch(self.test_patch_size)
        self.book = BookFactory(author=self.author)
        self.books = BookFactory.create_batch(self.test_patch_size, author=self.author)


class AuthorViewSetTests(BaseBookAPITestCase):
    def assertRightData(self, instance, data):
        data = data.get("data", data)
        self.assertEqual(instance.bio, data["bio"])
        self.assertEqual(instance.website, data["website"])
        self.assertEqual(instance.date_of_birth.strftime("%Y-%m-%d"), data["date_of_birth"])

    def test_create_author(self):
        author_data = {
            "bio": "New Bio",
            "website": "https://new-website.com",
            "date_of_birth": "2000-01-01",
        }
        response = self.reader_client.post(reverse("books:v1:author-list"), author_data)
        data = response.json()
        self.assertStatusCode(data, 201)
        author = Author.objects.get(id=data["data"]["id"])
        self.assertRightData(author, data)

    def test_update_author(self):
        response = self.author_client.patch(
            reverse("books:v1:author-detail", args=[self.author.id]),
            {
                "bio": "Updated Bio",
                "website": "https://updated-website.com",
                "date_of_birth": "2000-01-01",
            },
        )
        data = response.json()
        self.assertStatusCode(data, 200)
        self.author.refresh_from_db()
        self.assertRightData(self.author, data)

    def test_delete_author(self):
        response = self.author_client.delete(reverse("books:v1:author-detail", args=[self.author.id]))
        self.assertStatusCode({"status_code": response.status_code}, 204)
        self.assertFalse(Author.objects.filter(id=self.author.id).exists())


class BookViewSetTests(BaseBookAPITestCase):
    def assertRightData(self, instance, data):
        data = data.get("data", data)
        self.assertEqual(instance.categories.count(), len(data["categories"]))
        self.assertEqual(instance.title, data["title"])
        self.assertEqual(instance.description, data["description"])
        self.assertEqual(str(instance.price), data["price"])
        self.assertEqual(
            instance.published_date
            if isinstance(instance.published_date, str)
            else instance.published_date.strftime("%Y-%m-%d"),
            data["published_date"],
        )

    def test_create_book(self):
        book_data = {
            "title": "New Book",
            "description": "New Description",
            "price": "19.99",
            "file": create_mock_pdf_file(),
            "cover_image": create_mock_image(),
            "published_date": "1999-01-01",
            "categories": [1, 2],
        }
        response = self.author_client.post(reverse("books:v1:book-list"), book_data)
        data = response.json()
        self.assertStatusCode(data, 201)
        book = Book.objects.get(id=data["data"]["id"])
        self.assertRightData(book, data)

    def test_list_books(self):
        response = self.author_client.get(reverse("books:v1:book-list"))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(len(data["data"]), min(settings.PAGINATION_PAGE_SIZE, len(self.books) + 1))
        self.assertEqual(data["meta"]["count"], len(self.books) + 1)

    def test_retrieve_book(self):
        response = self.author_client.get(reverse("books:v1:book-detail", args=[self.books[0].id]))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertRightData(self.books[0], data)

    def test_update_book(self):
        book_data = {
            "title": "updated Book",
            "description": "updated Description",
            "price": Decimal("19.99"),
            "file": create_mock_pdf_file(),
            "cover_image": create_mock_image(),
            "published_date": "1999-01-02",
        }
        response = self.author_client.patch(reverse("books:v1:book-detail", args=[self.books[0].id]), book_data)
        data = response.json()
        self.assertStatusCode(data, 200)
        self.books[0].refresh_from_db()
        self.assertRightData(self.books[0], data)

    def test_delete_book(self):
        response = self.author_client.delete(reverse("books:v1:book-detail", args=[self.books[0].id]))
        self.assertStatusCode({"status_code": response.status_code}, 204)
        self.assertFalse(Book.objects.filter(id=self.books[0].id).exists())


class ReviewViewSetTests(BaseBookAPITestCase):
    def setUp(self):
        super().setUp()
        self.reviews = [ReviewFactory(user=user, book=book) for user, book in zip(self.users, self.books)]

    def assertRightData(self, instance, data):
        data = data.get("data", data)
        self.assertTrue(isinstance(data["user"], dict))
        self.assertEqual(instance.book.id, data["book"])
        self.assertEqual(instance.rating, data["rating"])
        self.assertEqual(instance.comment, data["comment"])

    def test_create_review(self):
        review_data = {
            "rating": 4,
            "comment": "Great Book!",
        }
        response = self.reader_client.post(
            reverse("books:v1:book-review-list", kwargs={"book_pk": self.books[0].id}), review_data
        )
        data = response.json()
        self.assertStatusCode(data, 201)
        review = Review.objects.get(id=data["data"]["id"])
        self.assertRightData(review, data)

    def test_list_reviews(self):
        response = self.author_client.get(reverse("books:v1:book-review-list", kwargs={"book_pk": self.books[0].id}))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(len(data["data"]), 1)
        self.assertEqual(data["meta"]["count"], 1)

    def test_retrieve_review(self):
        response = self.author_client.get(reverse("books:v1:review-detail", args=[self.reviews[0].id]))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertRightData(self.reviews[0], data)

    def test_update_review(self):
        self.reader_client.force_authenticate(self.users[0])
        review_data = {
            "rating": 4,
            "comment": "Great Book!",
        }
        response = self.reader_client.patch(reverse("books:v1:review-detail", args=[self.reviews[0].id]), review_data)
        data = response.json()
        self.assertStatusCode(data, 200)
        self.reviews[0].refresh_from_db()
        self.assertRightData(self.reviews[0], data)

    def test_delete_review(self):
        self.reader_client.force_authenticate(self.users[0])
        response = self.reader_client.delete(reverse("books:v1:review-detail", args=[self.reviews[0].id]))
        self.assertStatusCode({"status_code": response.status_code}, 204)
        self.assertFalse(Review.objects.filter(id=self.reviews[0].id).exists())


class OrderViewSetTests(BaseBookAPITestCase):
    def setUp(self):
        super().setUp()
        self.order_items = OrderItemFactory.create_batch(
            len(self.books),
            order__user=self.reader_user,
            book=factory.Iterator(self.books),
        )
        self.orders = [order_item.order for order_item in self.order_items]

    def assertRightData(self, instance, data, order_items_count=1):
        data = data.get("data", data)
        self.assertEqual(order_items_count, len(data["order_items"]))
        self.assertIn("stripe_session_id", data)
        self.assertIn("stripe_session_url", data)
        self.assertEqual(instance.status, data["status"])
        self.assertEqual(instance.user.id, data["user"])
        order_items = instance.order_items.all()
        for i, order_item in enumerate(data["order_items"]):
            self.assertEqual(order_items[i].book.id, order_item["book"])

    def test_create_cart_order(self):
        CartItemFactory(cart=self.reader_user.cart, book=self.book)
        response = self.reader_client.post(
            reverse("books:v1:order-list"),
            {"buy_all_cart": True},
        )
        data = response.json()
        self.assertStatusCode(data, 201)
        order = Order.objects.get(id=data["data"]["id"])
        self.assertRightData(order, data)

    def test_list_orders(self):
        response = self.reader_client.get(reverse("books:v1:order-list"))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(len(data["data"]), len(self.orders))
        self.assertEqual(data["meta"]["count"], len(self.orders))

    def test_retrieve_order(self):
        response = self.reader_client.get(reverse("books:v1:order-detail", args=[self.orders[0].id]))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(str(self.books[0].price), data["data"]["order_items"][0]["price"])
        self.assertRightData(self.orders[0], data)


class CartItemViewSetTests(BaseBookAPITestCase):
    def setUp(self):
        super().setUp()
        self.cart_items = CartItemFactory.create_batch(
            len(self.books),
            cart=self.reader_user.cart,
            book=factory.Iterator(self.books),
        )

    def assertRightData(self, instance, data):
        data = data.get("data", data)
        self.assertEqual(instance.book.id, data["book"]["id"])

    def test_create_cart_item(self):
        response = self.reader_client.post(
            reverse("books:v1:cart-item-list"),
            {"book_id": self.book.id},
        )
        data = response.json()
        self.assertStatusCode(data, 201)
        cart_item = CartItem.objects.get(id=data["data"]["id"])
        self.assertRightData(cart_item, data)

    def test_list_cart_items(self):
        response = self.reader_client.get(reverse("books:v1:cart-item-list"))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(len(data["data"]), len(self.books))
        self.assertEqual(data["meta"]["count"], len(self.books))

    def test_retrieve_cart_item(self):
        response = self.reader_client.get(reverse("books:v1:cart-item-detail", args=[self.cart_items[0].id]))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertRightData(self.cart_items[0], data)

    def test_delete_cart_item(self):
        response = self.reader_client.delete(reverse("books:v1:cart-item-detail", args=[self.cart_items[0].id]))
        self.assertStatusCode({"status_code": response.status_code}, 204)
        self.assertFalse(CartItem.objects.filter(id=self.cart_items[0].id).exists())
