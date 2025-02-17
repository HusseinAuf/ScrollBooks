import requests
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse

User = get_user_model()


class GoogleAuthService:
    @staticmethod
    def exchange_code_for_tokens(code):
        """
        Exchange Google authorization code for tokens.
        """
        url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.WEB_ROOT_URL,
            "grant_type": "authorization_code",
        }
        response = requests.post(url, data=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()

    @staticmethod
    def extract_user_info(id_token_str):
        """
        Extract user info.
        """
        id_info = id_token.verify_oauth2_token(id_token_str, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
        return id_info

    @staticmethod
    def get_or_create_user(email, name):
        """
        Get or create a user based on email.
        """
        created = False
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            created = True
            user = User.objects.create_user(
                email=email,
                password=User.objects.make_random_password(length=12),
                name=name,
            )
        return user, created
