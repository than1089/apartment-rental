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
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings
from rest_framework.routers import SimpleRouter

from apartments.views import ApartmentView
from users.social_views import FacebookConnect, TwitterConnect
from users.views import FacebookLogin, GoogleLogin, UserView, null_view

router = SimpleRouter()
router.register(r'apartments', ApartmentView)
router.register(r'users', UserView)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'api/', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/registration/account-email-verification-sent/', null_view, name='account_email_verification_sent'),
    url(r'^account-confirm-email/(?P<key>[-:\w]+)/$', null_view, name='account_confirm_email'),
    url(r'^rest-auth/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    url(r'^rest-auth/google/$', GoogleLogin.as_view(), name='twitter_login'),
    url(r'^rest-auth/facebook/connect/$', FacebookConnect.as_view(), name='fb_connect'),
    url(r'^rest-auth/twitter/connect/$', TwitterConnect.as_view(), name='twitter_connect'),
    url(r'^accounts/', include('allauth.urls'), name='socialaccount_signup'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
