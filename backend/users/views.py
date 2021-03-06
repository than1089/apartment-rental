from allauth.socialaccount.providers.facebook.views import \
    FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Q
from django.template.loader import render_to_string
from rest_auth.registration.views import SocialLoginView
from rest_framework import exceptions, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import User
from .permissions import UserPermission
from .serializers import (InviteUserSerializer, ProfileImageSerializer,
                          UserSerializer)


class UserView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, UserPermission,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['post'])
    def invite(self, request):
        """
        Invite a new user by sending email to them
        """
        serializer = InviteUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                raise exceptions.ValidationError('This email address alredy exists.')
            # Send email
            send_mail(
                'Apartment Rentals Invitation',
                render_to_string('account/email/registration_invitation.txt', {'email': email}),
                settings.DEFAULT_FROM_EMAIL,
                [email]
            )

            return Response({'detail': 'Email sent.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def upload_avatar(self, request, pk=None):
        user = User.objects.get(pk=pk)
        file_serializer = ProfileImageSerializer(data=request.data)

        if file_serializer.is_valid():
            user.profile_img = file_serializer.validated_data['profile_img']
            user.save()
            return Response({'profile_img': user.profile_img.url}, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get_queryset(self):
        queryset = User.objects.filter(is_superuser=False).all()
        q = self.request.query_params.get('q', None)
        roles = self.request.query_params.getlist('roles', None)
        if q:
            queryset = queryset.filter(
                Q(first_name__icontains=q) |
                Q(last_name__icontains=q) |
                Q(email__icontains=q)
            )
        if roles:
            queryset = queryset.filter(role__in=roles)

        return queryset

    
@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
