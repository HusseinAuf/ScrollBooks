from books.models import (
    Book,
    Order,
    OrderItem,
    Author,
    Category,
    Review,
    Cart,
    CartItem,
)
from core.utils import is_running_tests
from core.serializers import BaseModelSerializer
from rest_framework import serializers
from django.conf import settings
import stripe
from rest_framework.exceptions import ValidationError
from django.db import transaction

stripe.api_key = settings.STRIPE_SECRET_KEY


class AuthorSerializer(BaseModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
        read_only_fields = ["user"]


class CategorySerializer(BaseModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["display_name"] = instance.get_name_display()
        return data


class BookSerializer(BaseModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"
        read_only_fields = ["author"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["categories"] = CategorySerializer(instance.categories, many=True).data
        data["author"] = AuthorSerializer(instance.author).data
        return data


class OrderItemSerializer(BaseModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(BaseModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"


class CreateOrderSerializer(BaseModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    book_id = serializers.IntegerField(required=False)  # Optional: Buy a specific book
    buy_all_cart = serializers.BooleanField(default=False)  # If true, buy all books in the cart

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user"]

    def validate(self, data):
        if not data.get("book_id") and not data["buy_all_cart"]:
            raise serializers.ValidationError("You must provide either 'book_id' or set 'buy_all_cart' to True.")
        if data.get("book_id") and data["buy_all_cart"]:
            raise serializers.ValidationError(
                "You cannot provide 'book_id' and set 'buy_all_cart' to True simultaneously."
            )
        return data

    def create(self, validated_data):
        user = self.get_current_user()
        book_ids = []
        if validated_data.get("buy_all_cart"):
            book_ids = [cart_item.book.id for cart_item in user.cart.cart_items.all()]
        else:
            book_ids = [validated_data.get("book_id")]

        # Check if the user already have a book
        if user.library.filter(id__in=book_ids).exists():
            raise ValidationError("Some of the books are already in your library.")

        # check if the user is the owner of a book
        if user.is_author and Book.objects.filter(author=user.author, id__in=book_ids).exists():
            raise ValidationError("some of the books are owned by you.")

        books = [book for book in Book.objects.filter(id__in=book_ids)]
        with transaction.atomic():
            # Create Order and OrderItems
            order = Order.objects.create(user=user)
            for book in books:
                OrderItem.objects.create(order=order, book=book, price=book.price)

            if not is_running_tests():
                session = self.create_stripe_session(books, order)
                order.stripe_session_id = session["id"]
                order.stripe_session_url = session["url"]
                order.save()
        return order

    def create_stripe_session(self, books, order):
        line_items = [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": book.title},
                    "unit_amount": int(book.price * 100),  # Convert dollars to cents
                },
                "quantity": 1,
            }
            for book in books
        ]

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=line_items,
            metadata={"order_id": order.id},
            success_url=f"{settings.WEB_ROOT_URL}/success?session_id=CHECKOUT_SESSION_ID",
            cancel_url=f"{settings.WEB_ROOT_URL}/cancel",
        )
        return session


class ReviewSerializer(BaseModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["user"]

    def to_representation(self, instance):
        from users.serializers import UserSerializer

        data = super().to_representation(instance)
        data["user"] = UserSerializer(instance.user).data
        return data


class CartItemSerializer(BaseModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, source="book.price", read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "book", "book_title", "price"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["book"] = BookSerializer(instance.book).data
        return data
