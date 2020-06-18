from rest_framework import permissions
from users.models import User


class ApartmentPermission(permissions.BasePermission):
    """
    Check permission for apartments enpoints
    """
    def has_permission(self, request, view):
        # Write permission is only allowed by Admin and Realtor,
        # additional check will perform in has_object_permission method
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user.role in [User.ADMIN, User.REALTOR]
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == User.ADMIN:
            return True
        
        if view.action in ['update', 'partial_update', 'destroy']:
            return request.user.role == User.REALTOR and obj.realtor.id == request.user.id

        return True
