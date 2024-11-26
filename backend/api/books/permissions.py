from core.permissions import BasePermissions


class BookPermissions(BasePermissions):
    def has_permission(self, request, view):
        if view.action in ["create"]:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.author.user.pk == user.pk or user.is_superuser
