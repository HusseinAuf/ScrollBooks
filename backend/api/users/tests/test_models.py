from django.test import TestCase
from django.db.utils import IntegrityError
from users.models import User
from books.models import Author
from users.tests.factories import UserFactory


class UserModelTestCase(TestCase):
    def setUp(self):
        """Set up test data."""
        self.user_data = {
            "email": "testuser@example.com",
            "password": "testpassword123",
            "name": "Test User",
        }

    def test_manager_create_user(self):
        """Test creating a superuser."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data["email"])
        self.assertTrue(user.check_password(self.user_data["password"]))
        self.assertFalse(user.is_verified)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_manager_create_superuser(self):
        """Test creating a superuser."""
        superuser = User.objects.create_superuser(**self.user_data)
        self.assertEqual(superuser.email, self.user_data["email"])
        self.assertTrue(superuser.check_password(self.user_data["password"]))
        self.assertTrue(superuser.is_verified)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_str_method(self):
        """Test the __str__ method."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), user.email)

    def test_is_author_property(self):
        """Test the is_author property."""
        user = User.objects.create_user(**self.user_data)
        self.assertFalse(user.is_author)  # Initially, user has no related 'author'

        # Attaching an author profile to the user
        Author.objects.create(user=user)
        self.assertTrue(user.is_author)
