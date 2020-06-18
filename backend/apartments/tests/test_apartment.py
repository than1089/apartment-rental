from rest_framework import status
from rest_framework.test import APITestCase
from apartments.models import Apartment
from users.models import User
from users.tests.user_factory import UserFactory
from apartments.tests.apartment_factory import ApartmentFactory


class ApartmentTests(APITestCase):
    url = '/api/apartments/'
    apartment_data = {
        'name': 'My Apartment',
        'description': 'Lorem Ipsum',
        'floor_area_size': 80,
        'price_per_month': 500,
        'number_of_rooms': 4,
        'lat': 10,
        'lng': 106,
    }

    def test_get_apartments_without_authorization(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_client_get_apartments(self):
        client = UserFactory.create_client(verified=True)
        owner = UserFactory.create_realtor(verified=True)
        ApartmentFactory.create_apartment(owner)
        ApartmentFactory.create_apartment(owner, status='Rented')

        self.client.force_authenticate(user=client)
        response = self.client.get(self.url, format='json')
        self.assertEqual(len(response.json().get('results')), 1)
    
    def test_realtor_admin_get_apartments(self):
        owner = UserFactory.create_realtor(verified=True)
        another_realtor = UserFactory.create_realtor('new_realtor@test.com', verified=True)
        admin = UserFactory.create_admin(verified=True)
        ApartmentFactory.create_apartment(owner)
        ApartmentFactory.create_apartment(owner, status='Rented')

        self.client.force_authenticate(user=another_realtor)
        response = self.client.get(self.url, format='json')
        self.assertEqual(len(response.json().get('results')), 2)

        self.client.force_authenticate(user=admin)
        response = self.client.get(self.url, format='json')
        self.assertEqual(len(response.json().get('results')), 2)
    
    def test_client_create_apartment(self):
        client = UserFactory.create_client(verified=True)

        self.client.force_authenticate(user=client)
        response = self.client.post(self.url, self.apartment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_client_update_delete_apartment(self):
        client = UserFactory.create_client(verified=True)
        owner = UserFactory.create_realtor(verified=True)
        apartment = ApartmentFactory.create_apartment(owner)
        
        body = {'name': 'Apartment new name'}
        url = '{}{}/'.format(self.url, apartment.id)
        self.client.force_authenticate(user=client)
        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_realtor_create_apartment(self):
        realtor = UserFactory.create_realtor(verified=True)

        self.client.force_authenticate(user=realtor)
        response = self.client.post(self.url, self.apartment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_admin_create_apartment(self):
        admin = UserFactory.create_admin(verified=True)

        self.client.force_authenticate(user=admin)
        response = self.client.post(self.url, self.apartment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_realtor_update_delete_apartment(self):
        realtor = UserFactory.create_realtor(verified=True)
        apartment = ApartmentFactory.create_apartment(realtor)

        self.client.force_authenticate(user=realtor)
        url = '{}{}/'.format(self.url, apartment.id)
        body = {'name': 'Apartment New Name'}
        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        apartment.refresh_from_db()
        self.assertEqual(apartment.name, body['name'])

        response = self.client.delete(url, format='json')
        with self.assertRaises(Apartment.DoesNotExist):
            Apartment.objects.get(pk=apartment.id)
    
    def test_realtor_update_delete_apartment_of_another(self):
        realtor = UserFactory.create_realtor(verified=True)
        realtor1 = UserFactory.create_realtor(email='realtor1@test.com', verified=True)
        apartment = ApartmentFactory.create_apartment(realtor1)

        self.client.force_authenticate(user=realtor)
        url = '{}{}/'.format(self.url, apartment.id)
        body = {'name': 'Apartment New Name'}

        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_admin_update_delete_apartment(self):
        realtor = UserFactory.create_realtor(verified=True)
        admin = UserFactory.create_admin(verified=True)
        apartment = ApartmentFactory.create_apartment(realtor)

        self.client.force_authenticate(user=admin)
        url = '{}{}/'.format(self.url, apartment.id)
        body = {'name': 'Apartment New Name'}
        response = self.client.patch(url, body, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        apartment.refresh_from_db()
        self.assertEqual(apartment.name, body['name'])

        response = self.client.delete(url, format='json')
        with self.assertRaises(Apartment.DoesNotExist):
            Apartment.objects.get(pk=apartment.id)

    def test_filter_apartments(self):
        realtor = UserFactory.create_realtor(verified=True)
        client = UserFactory.create_client(verified=True)

        ApartmentFactory.create_apartment(realtor)
        ApartmentFactory.create_apartment(realtor)

        self.client.force_authenticate(user=client)

        url = '{}?min_size=70'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.json().get('results')), 2)

        url = '{}?min_size=90'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.json().get('results')), 0)

        url = '{}?max_price=300'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.json().get('results')), 0)

        url = '{}?number_of_rooms=4'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.json().get('results')), 2)

        url = '{}?number_of_rooms=2'.format(self.url)
        response = self.client.get(url, format='json')
        self.assertEqual(len(response.json().get('results')), 0)
