from rest_framework import status
from rest_framework.test import APITestCase
from Apartments.models import Apartment
from users.models import User
from users.tests.user_factory import UserFactory
from Apartments.tests.Apartment_factory import ApartmentFactory


class ApartmentTests(APITestCase):
    def test_get_Apartments_without_authorization(self):
        url = '/api/Apartments'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_Apartment(self):
        regular = UserFactory.create_regular_user()
        self.client.force_authenticate(user=regular)

        url = '/api/Apartments'
        body = {'destination': 'Australia', 'start_date': '2020-06-01', 'end_date': '2020-06-10'}
        response = self.client.post(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_update_Apartment(self):
        regular = UserFactory.create_regular_user()
        Apartment = ApartmentFactory.create_Apartment(regular)

        self.client.force_authenticate(user=regular)
        url = '/api/Apartments/{}'.format(Apartment.id)
        body = {'destination': 'England'}
        response = self.client.patch(url, body, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('destination'), 'England')

    def test_delete_Apartment(self):
        regular = UserFactory.create_regular_user()
        Apartment = ApartmentFactory.create_Apartment(regular)

        self.client.force_authenticate(user=regular)
        url = '/api/Apartments/{}'.format(Apartment.id)
        response = self.client.delete(url, format='json')

        with self.assertRaises(Apartment.DoesNotExist):
            Apartment.objects.get(id=Apartment.id)
    
    def test_regular_get_Apartments(self):
        """
        A regular user can only get their own Apartments
        """
        regular1 = UserFactory.create_regular_user('regular1')
        regular2 = UserFactory.create_regular_user('regular2')
        Apartment1 = ApartmentFactory.create_Apartment(regular1)
        Apartment2 = ApartmentFactory.create_Apartment(regular2)

        url = '/api/Apartments'
        self.client.force_authenticate(user=regular1)
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
    
    def test_admin_get_Apartments(self):
        """
        Admin can get all Apartments
        """
        regular1 = UserFactory.create_regular_user('regular1')
        regular2 = UserFactory.create_regular_user('regular2')
        admin = UserFactory.create_admin_user()
        ApartmentFactory.create_Apartment(regular1)
        ApartmentFactory.create_Apartment(regular2)

        url = '/api/Apartments'
        self.client.force_authenticate(user=admin)
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 2)

