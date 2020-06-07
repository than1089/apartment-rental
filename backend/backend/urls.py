"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.routers import SimpleRouter

from apartments.views import ApartmentView
from users.views import FacebookLogin, TwitterLogin, UserView, null_view

router = SimpleRouter()
router.register(r'apartments', ApartmentView)
router.register(r'users', UserView)

urlpatterns = [
    url('api/', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/registration/account-email-verification-sent/', null_view, name='account_email_verification_sent'),
    url(r'^rest-auth/registration/account-confirm-email/', null_view, name='account_confirm_email'),
    url(r'^rest-auth/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    url(r'^rest-auth/twitter/$', TwitterLogin.as_view(), name='twitter_login'),
]
