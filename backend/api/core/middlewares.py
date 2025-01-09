from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AnonymousUser
from users.authentication import JWTCookieAuthentication


class JWTCookieAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authentication = JWTCookieAuthentication()

    def __call__(self, request):
        self.authenticate(request)
        response = self.get_response(request)
        return response

    def authenticate(self, request):
        try:
            authentication_result = self.jwt_authentication.authenticate(request)
        except AuthenticationFailed:
            authentication_result = None
        if hasattr(request, "user") and not isinstance(request.user, AnonymousUser):
            return
        if authentication_result:
            request.user = authentication_result[0]
