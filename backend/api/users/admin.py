from django.contrib import admin
from users.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from core.utils import dynamic_admin_readonly_fields


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "name", "phone_number", "is_verified")
    search_fields = ("email", "name")
    readonly_fields = dynamic_admin_readonly_fields(User, extra_fields=["last_login"])
    ordering = None
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {"fields": ("name", "phone_number", "last_login", "created", "modified")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_verified",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "is_verified",
        "groups",
    )
    filter_horizontal = (
        "groups",
        "user_permissions",
    )

    actions = ["activate_selected_users", "deactivate_selected_users"]

    def activate_selected_users(self, request, queryset):
        queryset.update(is_active=True)

    def deactivate_selected_users(self, request, queryset):
        queryset.update(is_active=False)
