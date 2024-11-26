from django.urls import path
from django.urls import include


urlpatterns = [
    path("v1/books/", include("books.api.v1.urls"), name="books-api-v1"),
]
