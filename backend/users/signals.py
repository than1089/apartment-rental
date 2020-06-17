from io import BytesIO

import requests
from allauth.account.signals import user_signed_up
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.core.files import File
from django.dispatch import receiver
from rest_framework import exceptions

from .models import User


@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, **kwargs):
    user = User.get_user_by_email_or_none(credentials.get('email'))
    if not user:
        return

    user.login_attempts += 1
    limit_login_attempts = 3
    if user.login_attempts >= limit_login_attempts:
        if user.is_active:
            user.is_active = False
            user.save()
        raise exceptions.ValidationError('You failed {} login attempts. \
            Please contact admin@example.com to unblock your account.'.format(limit_login_attempts))
    user.save()


@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    if user.login_attempts > 0:
        user.login_attempts = 0
        user.save()

@receiver(user_signed_up)
def social_signed_up_callback(request, user, **kwargs):
    sociallogin = kwargs.get('sociallogin')
    if hasattr(sociallogin, 'account'):
        if hasattr(sociallogin.account, 'get_avatar_url'):
            image_url = sociallogin.account.get_avatar_url()
            resp = requests.get(image_url)
            fp = BytesIO()
            fp.write(resp.content)
            user.profile_img.save(
                "{}.jpeg".format(user.username),
                File(fp)
            )
