from core.permissions import BasePermissions


class UserPermissions(BasePermissions):
    def has_permission(self, request, view):
        if view.action in ["create"]:
            return True
        return super().has_permission(request, view)
