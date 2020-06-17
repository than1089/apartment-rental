from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ADMIN = 'Admin'
    REALTOR = 'Realtor'
    CLIENT = 'Client'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (REALTOR, 'Realtor'),
        (CLIENT, 'Client'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=CLIENT,
    )

    login_attempts = models.IntegerField(default=0)

    profile_img = models.ImageField(upload_to="profile_images", null=True)

    @staticmethod
    def get_user_by_email_or_none(email):
        try:
            return User.objects.get(email=email)
        except:
            return