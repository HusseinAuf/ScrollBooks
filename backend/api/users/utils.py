from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import serializers
from users.models import User


def validate_onetime_token_and_get_user(uidb64, token):
    try:
        user_id = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=user_id)
    except Exception:
        raise serializers.ValidationError("Invalid User id")
    if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError("Invalid token")
    return user
