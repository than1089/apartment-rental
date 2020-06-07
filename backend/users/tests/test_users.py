from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from users.tests.user_factory import UserFactory


class UserTests(APITestCase):

    def test_register_user(self):
        url = '/api/users/register'
        data = {
            'username': 'regular',
            'email': 'regular@test.com',
            'password': '@abc123',
            'first_name': 'Regular',
            'last_name': 'User',
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().get_full_name(), 'Regular User')
        self.assertEqual(User.objects.get().role, 'Regular')

    def test_register_user_with_admin_role(self):
        url = '/api/users/register'
        data = {
            'username': 'regular',
            'email': 'regular@test.com',
            'password': '@abc123',
            'first_name': 'Regular',
            'last_name': 'User',
            'role': 'Admin'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get().role, 'Regular')

    def test_register_user_wihout_username(self):
        url = '/api/users/register'
        data = {
            'email': 'test@test.com',
            'password': '@abc123',
            'first_name': 'Regular',
            'last_name': 'User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        UserFactory.create_regular_user()
        url = '/api/token'

        credential = {'username': 'regular', 'password': '@abc123'}
        response = self.client.post(url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_failure(self):
        url = '/api/token'

        credential = {'username': 'regular', 'password': '@abc123'}
        response = self.client.post(url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_get_users(self):
        admin = UserFactory.create_admin_user()

        self.client.force_authenticate(user=admin)
        url = '/api/users'
        response = self.client.get(url, format='json')
 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_manager_get_users(self):
        manager = UserFactory.create_manager_user()

        self.client.force_authenticate(user=manager)
        url = '/api/users'
        response = self.client.get(url, format='json')
 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
    
    def test_regular_get_users(self):
        """
        Regular user cannot get users list
        """
        regular = UserFactory.create_regular_user()

        self.client.force_authenticate(user=regular)
        url = '/api/users'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_users_without_authorization(self):
        """
        Users list enpoint should be protected
        """
        url = '/api/users'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_update_user(self):
        admin = UserFactory.create_admin_user()
        regular = UserFactory.create_regular_user()

        self.client.force_authenticate(user=admin)
        url = '/api/users/{}'.format(regular.id)
        body = {'last_name': 'User Editted'}
        response = self.client.patch(url, body, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('last_name'), 'User Editted')
    
    def test_admin_delete_user(self):
        admin = UserFactory.create_admin_user()
        regular = UserFactory.create_regular_user()

        self.client.force_authenticate(user=admin)
        url = '/api/users/{}'.format(regular.id)
        self.client.delete(url, format='json')

        with self.assertRaises(User.DoesNotExist):
            User.objects.get(username='regular')
