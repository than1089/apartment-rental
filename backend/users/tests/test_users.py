from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from users.tests.user_factory import UserFactory


class UserTests(APITestCase):
    registration_url = '/rest-auth/registration/'
    login_url = '/rest-auth/login/'
    user_url = '/api/users/'

    def test_register_user(self):
        data = {
            'email': 'client@test.com',
            'password': '@abc123',
            'first_name': 'Client',
            'last_name': '1',
        }
        response = self.client.post(self.registration_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().get_full_name(), 'Client 1')
        self.assertEqual(User.objects.get().role, 'Client')

    def test_register_user_with_invalid_role(self):
        data = {
            'email': 'client@test.com',
            'password': '@abc123',
            'first_name': 'Client',
            'last_name': '1',
            'role': 'SuperAdmin'
        }
        response = self.client.post(self.registration_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_admin_role(self):
        """
        Should not open to register Admin role
        """
        data = {
            'email': 'admin@test.com',
            'password': '@abc123',
            'first_name': 'Admin',
            'last_name': '1',
            'role': 'Admin'
        }
        response = self.client.post(self.registration_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_wihout_email(self):
        data = {
            'password': '@abc123',
            'first_name': 'Regular',
            'last_name': 'User',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_without_email_verification(self):
        UserFactory.create_client()

        credential = {'email': 'client@test.com', 'password': '@abc123'}
        response = self.client.post(self.login_url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_user_success(self):
        UserFactory.create_client(verified=True)

        credential = {'email': 'client@test.com', 'password': '@abc123'}
        response = self.client.post(self.login_url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_failure(self):
        credential = {'username': 'regular', 'password': '@abc123'}
        response = self.client.post(self.login_url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_block_user_with_3_attempts(self):
        user = UserFactory.create_client(verified=True)

        credential = {'email': 'client@test.com', 'password': '123'}
        self.client.post(self.login_url, credential, format='json')
        self.client.post(self.login_url, credential, format='json')
        response = self.client.post(self.login_url, credential, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertEqual(user.is_active, False)

    def test_admin_get_users(self):
        admin = UserFactory.create_admin(verified=True)
        self.client.force_authenticate(user=admin)

        response = self.client.get(self.user_url, format='json')
 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_users_without_authorization(self):
        """
        Users list enpoint should be protected
        """
        response = self.client.get(self.user_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_update_user(self):
        admin = UserFactory.create_admin(verified=True)
        client = UserFactory.create_client()

        self.client.force_authenticate(user=admin)
        url = '{}{}/'.format(self.user_url, client.id)
        body = {'last_name': 'User Editted'}
        response = self.client.patch(url, body, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('last_name'), 'User Editted')
    
    def test_admin_invite_new_user(self):
        admin = UserFactory.create_admin(verified=True)

        self.client.force_authenticate(user=admin)
        url = '{}invite/'.format(self.user_url)
        body = {'email': 'new@test.com'}

        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_admin_invite_new_user_without_email(self):
        admin = UserFactory.create_admin(verified=True)

        self.client.force_authenticate(user=admin)
        url = '{}invite/'.format(self.user_url)
        body = {'name': 'new@test.com'}

        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_admin_invite_new_user_with_invalid_email(self):
        admin = UserFactory.create_admin(verified=True)

        self.client.force_authenticate(user=admin)
        url = '{}invite/'.format(self.user_url)
        body = {'email': 'new'}

        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_admin_invite_existing_user(self):
        admin = UserFactory.create_admin(verified=True)
        client = UserFactory.create_client()

        self.client.force_authenticate(user=admin)
        url = '{}invite/'.format(self.user_url)
        body = {'email': client.email}
        response = self.client.post(url, body, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_admin_delete_user(self):
        admin = UserFactory.create_admin(verified=True)
        client = UserFactory.create_client()

        self.client.force_authenticate(user=admin)
        url = '{}{}/'.format(self.user_url, client.id)
        self.client.delete(url, format='json')

        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=client.id)
    
    def test_admin_delete_himself(self):
        admin = UserFactory.create_admin(verified=True)

        self.client.force_authenticate(user=admin)
        url = '{}{}/'.format(self.user_url, admin.id)
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_client_get_users(self):
        client = UserFactory.create_client(verified=True)

        self.client.force_authenticate(user=client)
        response = self.client.get(self.user_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_get_update_delete_themself(self):
        client = UserFactory.create_client(verified=True)
        url = '{}{}/'.format(self.user_url, client.id)
        self.client.force_authenticate(user=client)

        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        body = {'last_name': 'My lastname changed'}
        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_client_get_update_delete_another(self):
        client1 = UserFactory.create_client(verified=True)
        client2 = UserFactory.create_client(email='client2@test.com', verified=True)
    
        url = '{}{}/'.format(self.user_url, client2.id)
        self.client.force_authenticate(user=client1)

        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        body = {'last_name': 'Lastname changed'}
        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
