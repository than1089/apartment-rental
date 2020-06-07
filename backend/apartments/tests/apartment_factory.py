from Apartments.models import Apartment

class ApartmentFactory:
    @staticmethod
    def create_apartment(owner):
        data = {
            'destination': 'Australia',
            'start_date': '2020-06-01',
            'end_date': '2020-06-10',
            'owner': owner
        }
        return Apartment.objects.create(**data)