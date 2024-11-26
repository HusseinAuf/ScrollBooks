from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from users.views import (
    UserViewSet,
    LoginView,
    LogoutView,
    PasswordResetView,
    PasswordResetConfirmView,
    TokenRefreshView,
    VerifyEmail,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", LoginView.as_view(), name="login"),
    path("verify-email/<slug:uidb64>/<slug:token>/", VerifyEmail.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password/reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "password/reset/confirm/<slug:uidb64>/<slug:token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
]
