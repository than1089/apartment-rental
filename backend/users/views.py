from allauth.socialaccount.providers.facebook.views import \
    FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_auth.registration.views import SocialLoginView
from rest_framework import exceptions, status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import User
from .permissions import UserPermission
from .serializers import InviteUserSerializer, UserSerializer


class UserView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, UserPermission,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['post'])
    def invite(self, request, pk=None):
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

    def get_queryset(self):
        return User.objects.filter(is_superuser=False).all()
    
@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
