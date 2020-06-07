from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        from .signals import user_login_failed_callback, user_logged_in_callback
