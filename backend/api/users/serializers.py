from rest_framework import serializers
from users.models import User
from books.serializers import AuthorSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import check_password
from users.utils import validate_onetime_token_and_get_user


class UserSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "phone_number", "password", "is_author", "author"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        if "password" in validated_data:
            raise serializers.ValidationError({"password": _("Password cannot be updated from this endpoint.")})
        return super().update(instance, validated_data)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField()
    confirm_new_password = serializers.CharField()

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(_("Passwords do not match"))
        uidb64 = self.context["view"].kwargs["uidb64"]
        token = self.context["view"].kwargs["token"]
        user = validate_onetime_token_and_get_user(uidb64, token)
        attrs["user"] = user  # Save user in attrs to be used in save()
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    confirm_new_password = serializers.CharField()

    def validate(self, attrs):
        user = self.context["request"].user
        attrs = super().validate(attrs)

        if not check_password(attrs.get("old_password"), user.password):
            raise serializers.ValidationError(_("Invalid current password"))

        if attrs.get("new_password") != attrs.get("confirm_new_password"):
            raise serializers.ValidationError(_("Passwords do not match"))

        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()
        return instance


class BaseTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"
    default_error_messages = {"no_active_account": _("Invalid email or password")}

    def validate(self, attrs):
        data = super().validate(attrs)
        # data['access_token'] = data.pop('access')
        data["user"] = UserSerializer(self.user, context=self.context).data
        return data


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def extract_refresh_token(self):
        request = self.context["request"]
        if "refresh" in request.data and request.data["refresh"] != "":
            return request.data["refresh"]

        cookie_name = settings.JWT_AUTH_REFRESH_COOKIE_NAME
        if cookie_name and cookie_name in request.COOKIES:
            return request.COOKIES.get(cookie_name)
        else:
            raise InvalidToken(_("No valid refresh token found"))

    def validate(self, attrs):
        attrs["refresh"] = self.extract_refresh_token()
        data = super().validate(attrs)
        # data['refresh_token'] = data.pop('refresh')
        # data['access_token'] = data.pop('access')
        return data
