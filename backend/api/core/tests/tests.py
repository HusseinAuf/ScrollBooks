from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def assertStatusCode(self, data, expected_status_code, msg=None):
        if msg is None:
            msg = f"Expected status {expected_status_code} but got {data['status_code']}. " f"Response content: " + (
                data.get("detail") if data.get("detail") and data.get("detail") != "Fail" else data.get("error")
            )
        self.assertEqual(data["status_code"], expected_status_code, msg)
