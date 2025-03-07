from django.shortcuts import render
from core.views import (
    BaseViewSet,
    NonCreatableViewSet,
    NonDeletableViewSet,
    NonUpdatableViewSet,
    NonListableViewSet,
    NonRetrievableViewSet,
)
from books.models import (
    Author,
    Book,
    Order,
    Review,
    Category,
    OrderStatus,
    OrderItem,
    CartItem,
    Cart,
)
from books.serializers import (
    AuthorSerializer,
    BookSerializer,
    ReviewSerializer,
    CategorySerializer,
    OrderSerializer,
    CartItemSerializer,
)
from core.permissions import BasePermissions
from books.filters import BookFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
import stripe
from rest_framework.exceptions import ValidationError
from django.db import transaction
from collections import OrderedDict
from django.db.models import Count, Avg, Value, Subquery, OuterRef, Exists
from django.db.models.functions import Coalesce
from core.utils import get_object_or_none
from rest_framework.permissions import AllowAny

stripe.api_key = settings.STRIPE_SECRET_KEY


class AuthorViewSet(BaseViewSet, NonListableViewSet, NonRetrievableViewSet):
    model = Author
    queryset = model.objects.all()
    serializer_class = AuthorSerializer
    permission_relation = "user.pk"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookViewSet(BaseViewSet):
    model = Book
    queryset = model.objects.all()
    serializer_class = BookSerializer
    filterset_class = BookFilter
    permission_relation = "author.user.pk"

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        queryset = queryset.annotate(
            review_count=Count("reviews"),
            average_rating=Coalesce(Avg("reviews__rating"), Value(0.0)),
        )
        if not user.is_authenticated:
            return queryset
        queryset = queryset.annotate(
            is_in_my_cart=Exists(CartItem.objects.filter(cart__user=user, book=OuterRef("id"))),
            is_in_my_library=Exists(user.library.filter(id=OuterRef("id"))),
            is_in_my_favorites=Exists(user.favorite_books.filter(id=OuterRef("id"))),
        )

        # Get user review of each book
        user_review = Review.objects.filter(book=OuterRef("pk"), user=user).values("id", "comment", "rating")
        queryset = queryset.annotate(
            my_review_id=Subquery(user_review.values("id")),
            my_review_comment=Subquery(user_review.values("comment")),
            my_review_rating=Subquery(user_review.values("rating")),
        )

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.author)


class ReviewViewSet(BaseViewSet):
    model = Review
    queryset = model.objects.all()
    serializer_class = ReviewSerializer
    permission_relation = "user.pk"

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.kwargs.get("book_pk"):
            return queryset.filter(book__id=self.kwargs.get("book_pk"))
        return queryset

    def get_object(self):
        return super().get_object()

    def perform_create(self, serializer):
        book = get_object_or_none(Book, pk=self.kwargs.get("book_pk"))  # Ensure the book exists
        serializer.save(user=self.request.user, **({"book": book} if book else {}))


class OrderViewSet(BaseViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    model = Order
    queryset = model.objects.all()
    serializer_class = OrderSerializer
    permission_relation = "user.pk"

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data, status=201)


class OrderItemViewSet(BaseViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    model = Order
    queryset = model.objects.all()
    serializer_class = OrderSerializer
    permission_relation = "user.pk"


class CategoryViewSet(BaseViewSet, NonCreatableViewSet, NonUpdatableViewSet, NonDeletableViewSet):
    model = Category
    queryset = model.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class CartItemViewSet(BaseViewSet):
    model = CartItem
    queryset = model.objects.all()
    serializer_class = CartItemSerializer
    permission_relation = "cart.user.pk"

    def get_queryset(self):
        return super().get_queryset().filter(cart=self.request.user.cart)

    def get_paginated_response(self, data):
        paginated_response = super().get_paginated_response(data)
        paginated_response.data["meta"] = OrderedDict(
            {
                "count": self.paginator.page.paginator.count,
                "total_price": self.request.user.cart.total_price,
            }
        )
        return paginated_response

    def perform_create(self, serializer):
        serializer.save(cart=self.request.user.cart)
