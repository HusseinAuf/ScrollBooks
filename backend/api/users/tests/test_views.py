from users.models import User
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from core.tests.tests import BaseAPITestCase
from users.tests.factories import UserFactory
from urllib.parse import urlencode
from books.tests.factories import AuthorFactory


class UserViewSetTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.client.force_authenticate(self.user)

    def assertRightData(self, instance, data):
        data = data.get("data", data)
        self.assertEqual(instance.email, data["email"])
        self.assertEqual(instance.name, data["name"])
        self.assertEqual(instance.phone_number, data["phone_number"])

    def test_me_endpoint(self):
        """Test /me endpoint."""
        response = self.client.get(reverse("users:user-me"))
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertRightData(self.user, data)

    def test_list_author_users(self):
        """Test list author users"""
        author = AuthorFactory()
        query_params = {"is_author": True}
        response = self.client.get(reverse("users-api:user-list") + f"?{urlencode(query_params)}")
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertEqual(len(data["data"]), 1)
        self.assertEqual(data["meta"]["count"], 1)
        self.assertRightData(author.user, data["data"][0])

    def test_create_user(self):
        """Test create user."""
        user_data = {
            "email": "user@example.com",
            "password": "password123",
            "name": "New Name",
            "phone_number": "00201094448432",
        }
        response = self.client.post(reverse("users-api:user-list"), user_data)
        data = response.json()
        self.assertStatusCode(data, 201)
        user = User.objects.get(id=data["data"]["id"])
        self.assertRightData(user, data)

    def test_update_user(self):
        """Test update user."""
        user_data = {"name": "Updated Name", "phone_number": "00201094448435"}
        response = self.client.patch(reverse("users-api:user-detail", args=[self.user.id]), user_data)
        data = response.json()
        self.assertStatusCode(data, 200)
        self.user.refresh_from_db()
        self.assertRightData(self.user, data)


class LoginViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()

    def test_login_success(self):
        """Test successful login."""
        response = self.client.post(
            reverse("users-api:login"),
            {"email": self.user.email, "password": "defaultpassword"},
        )
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertIn("access_token", data["data"])
        self.assertIn("refresh_token", response.cookies)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        response = self.client.post(
            reverse("users-api:login"),
            {"email": self.user.email, "password": "wrongpassword"},
        )
        data = response.json()
        self.assertStatusCode(data, 401)
        self.assertIn("detail", data)


class VerifyEmailTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory(is_active=False)
        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = PasswordResetTokenGenerator().make_token(self.user)

    def test_verify_email_success(self):
        """Test email verification success."""
        url = reverse("users-api:verify-email", args=[self.uid, self.token])
        response = self.client.get(url)
        data = response.json()
        self.assertStatusCode(data, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_verify_email_invalid_token(self):
        """Test email verification with an invalid token."""
        url = reverse("users-api:verify-email", args=[self.uid, "invalidtoken"])
        response = self.client.get(url)
        data = response.json()
        self.assertStatusCode(data, 400)


class LogoutViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.client.force_authenticate(self.user)

    def test_logout(self):
        """Test successful logout."""
        response = self.client.get(reverse("users-api:logout"))
        data = response.json()
        self.assertStatusCode(data, 200)


class TokenRefreshViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        response = self.client.post(
            reverse("users-api:login"),
            {"email": self.user.email, "password": "defaultpassword"},
        )
        self.refresh_token = response.cookies.get("refresh_token").value

    def test_refresh_token(self):
        """Test refreshing the JWT token."""
        response = self.client.post(reverse("users-api:token-refresh"), {"refresh_token": self.refresh_token})
        data = response.json()
        self.assertStatusCode(data, 200)
        self.assertIn("access_token", data["data"])


class PasswordResetViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()

    def test_password_reset(self):
        """Test password reset email is sent."""
        response = self.client.post(reverse("users-api:password-reset"), {"email": self.user.email})
        data = response.json()
        self.assertStatusCode(data, 200)


class PasswordResetConfirmViewTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = PasswordResetTokenGenerator().make_token(self.user)

    def test_password_reset_confirm(self):
        """Test password reset confirmation."""
        user_data = {
            "new_password": "newpassword123",
            "confirm_new_password": "newpassword123",
        }
        response = self.client.post(
            reverse("users-api:password-reset-confirm", args=[self.uid, self.token]),
            user_data,
        )
        data = response.json()
        self.assertStatusCode(data, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpassword123"))
