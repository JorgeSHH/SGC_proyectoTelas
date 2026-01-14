from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):

    ADMIN = 'admin'
    SALESWOMAN = 'saleswoman'
    
    role_choices = (
        (ADMIN, 'administrator'),
        (SALESWOMAN, 'Saleswoman'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, choices=role_choices)
    profile_id = models.IntegerField(null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class Administrator(models.Model):
    role_choices = User.role_choices

    administrator_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=60)
    role = models.CharField(max_length=30, choices=role_choices, default='admin')
    created_at = models.DateTimeField(auto_now_add=True)

class Saleswoman(models.Model):
    role_choices = User.role_choices

    saleswoman_id = models.AutoField(primary_key=True)
    administrator = models.ForeignKey(Administrator, on_delete=models.SET_NULL, null= True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=16)
    status = models.BooleanField(default=True)
    username = models.CharField(max_length=60)
    role = models.CharField(max_length=30, choices=role_choices, default='saleswoman')
    created_at = models.DateTimeField(auto_now_add=True)



