from rest_framework.response import Response
from core.views import (
    BaseViewSet,
    NonDeletableViewSet,
    NonListableViewSet,
    NonRetrievableViewSet,
)
from users.serializers import UserSerializer, PasswordResetConfirmSerializer, SendEmailSerializer, GoogleAuthSerializer
from users.models import User
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView as JwtTokenRefreshView,
)
from core.renderers import BaseJSONRenderer
from rest_framework.renderers import BrowsableAPIRenderer
from rest_framework import status, generics
from users.authentication import set_jwt_cookies, unset_jwt_cookies
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _
from users.permissions import UserPermissions
from users.utils import validate_onetime_token_and_get_user, generate_uid_and_token, generate_tokens_for_user
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from users.emails import send_reset_password_email
from users.filters import UserFilter
from books.serializers import BookSerializer
from books.models import Book
from django.db.models import Q
from rest_framework.permissions import AllowAny
from users.emails import send_verification_email
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import requests
from datetime import datetime
from users.services.google_auth import GoogleAuthService


class UserViewSet(BaseViewSet, NonDeletableViewSet, NonListableViewSet, NonRetrievableViewSet):
    model = User
    queryset = model.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter
    permission_classes = [UserPermissions]
    # authentication_classes = []
    permission_relation = "pk"

    def get_queryset(self):
        return super().get_queryset().filter(Q(id=self.request.user.id) | Q(author__isnull=False))

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_name="me", url_path="me")
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)


class BaseUserGenericAPIView(generics.GenericAPIView):
    renderer_classes = [BaseJSONRenderer, BrowsableAPIRenderer]
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return User.objects.all()


class LoginView(TokenObtainPairView, BaseUserGenericAPIView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        response.data["access_token"] = response.data["access"]
        set_jwt_cookies(response, response.data.pop("access"), response.data.pop("refresh"))
        return response


class GoogleAuthView(BaseUserGenericAPIView):
    serializer_class = GoogleAuthSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles both Google Login & Signup.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        google_code = serializer.validated_data["google_code"]

        tokens = GoogleAuthService.exchange_code_for_tokens(google_code)
        id_info = GoogleAuthService.extract_user_info(tokens["id_token"])
        email = id_info.get("email")
        name = id_info.get("given_name", "") + id_info.get("family_name", "")

        # Login or Signup
        user, created = GoogleAuthService.get_or_create_user(email, name)

        access_token, refresh_token = generate_tokens_for_user(user)
        response_data = {"access_token": access_token, "user": UserSerializer(user).data, "created": created}

        response = Response(response_data, status=200)
        set_jwt_cookies(response, access_token, refresh_token)

        return response


class VerifyEmail(BaseUserGenericAPIView):
    def get(self, request, uidb64, token, *args, **kwargs):
        user = validate_onetime_token_and_get_user(uidb64, token)
        user.is_verified = True
        user.save()
        return Response(status=status.HTTP_200_OK)


class ResendVerificationEmail(BaseUserGenericAPIView):
    serializer_class = SendEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.data["email"])
        if user.is_verified:
            return Response({"detail": "Email is already verified"}, status=400)
        uid, token = generate_uid_and_token(user)
        send_verification_email(user, uid, token)
        return Response(status=200)


class LogoutView(BaseUserGenericAPIView):
    def get(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        unset_jwt_cookies(response)
        return response


class TokenRefreshView(JwtTokenRefreshView, BaseUserGenericAPIView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        set_jwt_cookies(
            response,
            response.data.get("access_token"),
            response.data.get("refresh_token"),
        )
        return response


class PasswordResetView(BaseUserGenericAPIView):
    serializer_class = SendEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.data["email"])
        uid, token = generate_uid_and_token(user)
        send_reset_password_email(user, uid, token)
        return Response(status=200)


class PasswordResetConfirmView(BaseUserGenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
