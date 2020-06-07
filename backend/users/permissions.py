from rest_framework import permissions
from .models import User


class UserPermission(permissions.BasePermission):
    """
    Check permission for users enpoints
    """

    def has_permission(self, request, view):
        if view.action in ['list', 'create', 'destroy']:
            return request.user and request.user.is_authenticated \
                and request.user.role in [User.ADMIN, User.MANAGER]

        if view.action == 'register':
            return True

        if view.action in ['retrieve', 'update', 'partial_update']:
            return request.user and request.user.is_authenticated

        return False
