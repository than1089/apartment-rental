from django.contrib.auth.signals import user_login_failed, user_logged_in
from django.dispatch import receiver
from rest_framework import exceptions
from .models import User

@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, **kwargs):
    user = User.objects.get(email=credentials.get('email'))
    user.login_attempts += 1
    if user.login_attempts >= 3:
        user.is_active = False
        user.save()
        raise exceptions.ValidationError('You failed 3 login attempts. Account is blocked.')

    user.save()

@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    if user.login_attempts > 0:
        user.login_attempts = 0
        user.save()
