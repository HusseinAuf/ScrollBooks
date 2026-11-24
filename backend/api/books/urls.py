from books.apps import BooksConfig
from django.urls import include, path

app_name = BooksConfig.name

urlpatterns = [
    path("api/", include("books.api.urls")),
]
