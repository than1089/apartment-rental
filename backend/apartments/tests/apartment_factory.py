from apartments.models import Apartment

class ApartmentFactory:
    @staticmethod
    def create_apartment(owner, status='Available'):
        data = {
            'name': 'My Apartment',
            'description': 'Lorem Ipsum',
            'floor_area_size': 80,
            'price_per_month': 500,
            'number_of_rooms': 4,
            'status': status,
            'realtor': owner,
            'lat': 10,
            'lng': 106,
        }
        return Apartment.objects.create(**data)