from django.db import models
from django.contrib.gis.db.models import PointField
from django.contrib.gis.geos import Point


class Apartment(models.Model):
    AVAILABLE = 'Available'
    RENTED = 'Rented'

    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (RENTED, 'Rented'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    floor_area_size = models.DecimalField(max_digits=9, decimal_places=2)
    price_per_month = models.DecimalField(max_digits=9, decimal_places=2)
    number_of_rooms = models.SmallIntegerField()
    address = models.CharField(max_length=255)
    lat = models.DecimalField(max_digits=9, decimal_places=6, help_text="Location Latitude")
    lng = models.DecimalField(max_digits=9, decimal_places=6, help_text="Location Longitude")
    location = PointField(null=True, srid=4326, geography=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=AVAILABLE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    realtor = models.ForeignKey('users.User', related_name='apartments', on_delete=models.CASCADE)

    class Meta:
        ordering = ['-created_at']
