from django.urls import include
from django.urls import path
from users.apps import UsersConfig

app_name = UsersConfig.name

urlpatterns = [
    path("api/", include("users.api.urls"), name="users-api"),
]
