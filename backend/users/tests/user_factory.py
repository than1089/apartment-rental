from users.models import User
from allauth.account.models import EmailAddress

class UserFactory:
    @staticmethod
    def create_client(email='client@test.com', verified=False):
        data = {
            'username': email,
            'email': email,
            'password': '@abc123',
            'first_name': 'Client',
            'last_name': 'User',
        }
        user = User.objects.create_user(**data)

        EmailAddress.objects.create(**{
            'user': user,
            'email': email,
            'verified': verified
        })
        return user

    @staticmethod
    def create_admin(email='admin@test.com', verified=False):
        data = {
            'username': email,
            'email': email,
            'password': '@abc123',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'Admin'
        }
        user = User.objects.create_user(**data)
        EmailAddress.objects.create(**{
            'user': user,
            'email': email,
            'verified': verified
        })
        return user

    @staticmethod
    def create_realtor(email="realtor@test.com", verified=False):
        data = {
            'username': email,
            'email': email,
            'password': '@abc123',
            'first_name': 'Realtor',
            'last_name': 'User',
            'role': 'Realtor'
        }
        user = User.objects.create_user(**data)
        EmailAddress.objects.create(**{
            'user': user,
            'email': email,
            'verified': verified
        })
        return user