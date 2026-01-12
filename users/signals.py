# from django.db.models.signals import post_save, post_delete
# from django.dispatch import receiver
# from django.db import transaction
# from .models import User, Saleswoman, Administrator


#esta son las señales que permiten el uso simultanio de el registro en la tabla User
#Saleswoman, Administrator facilitando, si se crea un admin/ en simultanio la señal la toma y crea un user


# @receiver(post_save, sender=Administrator)
# def crear_admin_user(sender, instance, created, **kwargs):
#     """Crea un User de Django cuando se crea un Administrator"""
#     if created:

#         transaction.on_commit( lambda: User.objects.create_user(
#             username = instance.username,
#             email = instance.email,
#             role = User.ADMIN,
#             profile_id= instance.pk
#         ))
            


# @receiver(post_save, sender=Saleswoman)
# def crear_saleswoman_user(sender, instance, created, **kwargs):
#     """Crea un User de Django cuando se crea una Saleswoman"""
#     if created:
#         transaction.on_commit( lambda:User.objects.create_user(
#             username = instance.username,
#             email = instance.email,
#             role = User.SALESWOMAN,
#             profile_id= instance.pk
#         ))

# @receiver(post_delete, sender=Administrator)
# @receiver(post_delete, sender=Saleswoman)
# def borrar_user(sender, instance, **kwargs):
#     """Borra el User de login si el perfil de negocio desaparece"""
#     User.objects.filter(email=instance.email).delete()


