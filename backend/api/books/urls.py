from django.urls import include
from django.urls import path
from books.apps import BooksConfig

app_name = BooksConfig.name

urlpatterns = [
    path("api/", include("books.api.urls")),
]
