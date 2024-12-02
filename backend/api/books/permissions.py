from core.permissions import BasePermissions


class AuthorPermissions(BasePermissions):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.author.user.pk == user.pk or user.is_superuser


class BookPermissions(BasePermissions):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.author.user.pk == user.pk or user.is_superuser


class ReviewPermissions(BasePermissions):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.user.pk == user.pk or user.is_superuser
