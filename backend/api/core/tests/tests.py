from rest_framework.test import APITestCase, APIClient


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def assertStatusCode(self, data, expected_status_code, msg=None):
        if msg is None:
            detail = data.get("detail")
            response_detail = str(detail if detail and detail != "Fail" else data.get("error"))
            msg = (
                f"Expected status {expected_status_code} but got {data['status_code']}. "
                f"Response content: {response_detail}"
            )

        self.assertEqual(data["status_code"], expected_status_code, msg)
