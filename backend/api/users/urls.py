from django.urls import include, path
from users.apps import UsersConfig

urlpatterns = [
    path("api/", include("users.api.urls")),
]
