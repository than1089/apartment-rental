from users.models import User

class UserFactory:
    @staticmethod
    def create_regular_user(username='regular'):
        data = {
            'username': username,
            'email': 'regular@test.com',
            'password': '@abc123',
            'first_name': 'Regular',
            'last_name': 'User',
        }
        return User.objects.create_user(**data)

    @staticmethod
    def create_admin_user(username='admin'):
        data = {
            'username': username,
            'email': 'admin@test.com',
            'password': '@abc123',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'Admin'
        }
        return User.objects.create_user(**data)

    @staticmethod
    def create_manager_user(uesrname='manager'):
        data = {
            'username': uesrname,
            'email': 'manager@test.com',
            'password': '@abc123',
            'first_name': 'Manager',
            'last_name': 'User',
            'role': 'Manager'
        }
        return User.objects.create_user(**data)