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
