from core.permissions import BasePermissions
from core.utils import querydict_data_to_dict


class UserPermissions(BasePermissions):
    def has_permission(self, request, view):
        if view.action in ["create"]:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.pk == user.pk or user.is_superuser
