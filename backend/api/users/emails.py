from core.emails import send_email
from core.utils import render_to_string_global_context
from django.conf import settings
from django.utils.translation import gettext_lazy as _


def send_verification_email(user, uid, token):
    context = {"user_name": user.name, "verify_link": f"{settings.WEB_ROOT_URL}/verify-email/{uid}/{token}"}
    html_content = render_to_string_global_context("users/verify_email.html", context)
    send_email.delay(
        subject=_("Verify your email address"),
        message=_("Verify your email address"),
        html_content=html_content,
        to=[
            user.email,
        ],
    )


def send_reset_password_email(user, uid, token):
    context = {
        "user_name": user.name,
        "reset_link": f"{settings.WEB_ROOT_URL}/reset-password/{uid}/{token}",
    }
    html_content = render_to_string_global_context("users/password_reset_email.html", context)
    return send_email.delay(
        subject=_("Password Reset"),
        message=_("Link to reset password"),
        html_content=html_content,
        to=[
            user.email,
        ],
    )
