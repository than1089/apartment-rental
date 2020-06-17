from rest_framework import permissions
from .models import User


class UserPermission(permissions.BasePermission):
    """
    Check permission for users enpoints
    """

    def has_permission(self, request, view):
        if view.action in ['list', 'create', 'destroy', 'invite']:
            return request.user.role == User.ADMIN
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == User.ADMIN:
            return True

        if view.action in ['retrieve', 'update', 'partial_update', 'upload_avatar']:
            return request.user.id == obj.id
        
        if view.action == 'destroy':
            return request.user.id != obj.id

        return False