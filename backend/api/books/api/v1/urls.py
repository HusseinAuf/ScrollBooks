from django.urls import path
from django.urls import include
from rest_framework_nested.routers import DefaultRouter, NestedSimpleRouter
from books.views import (
    AuthorViewSet,
    BookViewSet,
    ReviewViewSet,
    CategoryViewSet,
    OrderViewSet,
    CartItemViewSet,
)


router = DefaultRouter()
router.register(r"authors", AuthorViewSet, basename="author")
router.register(r"books", BookViewSet, basename="book")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"cart-items", CartItemViewSet, basename="cart-item")

book_router = NestedSimpleRouter(router, r"books", lookup="book")
book_router.register(r"reviews", ReviewViewSet, basename="book-review")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(book_router.urls)),
]
