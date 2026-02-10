import requests
from django.db import transaction
from django.contrib.auth import get_user_model
from users.models import Administrator, Saleswoman
from users.serialeizers import SaleswomanSerialeizer

def poblar_vendedoras_faker(cantidad=5, admin_id=None):
    """
    admin_id: El ID del administrador que 'registra' a estas vendedoras.
    """
    url = f"https://fakerapi.it/api/v2/persons?_quantity={cantidad}&_gender=female&_birthday_start=2005-01-01"
    
    try:
        response = requests.get(url)
        data_faker = response.json()
        
        if data_faker['status'] != 'OK':
            return {"error": "No se pudo obtener data de FakerAPI"}

        # 1. Validamos que exista el administrador
        try:
            admin_responsable = Administrator.objects.get(pk=admin_id)
        except Administrator.DoesNotExist:
            return {"error": f"El administrador con ID {admin_id} no existe. Necesitas uno para registrar vendedoras."}

        vendedoras_creadas = 0
        errores = []

        for person in data_faker['data']:
            # 2. Mapeamos la data de Faker a tu modelo
            payload = {
                "first_name": person['firstname'],
                "last_name": person['lastname'],
                "email": person['email'],
                "phone": person['phone'][:15], # Recortamos por tu validación de 16
                "username": person['email'].split('@')[0], # Usamos el inicio del email como username
                "password": "password123", # Password genérica
                "role": "saleswoman",
                "status": True
            }

            # 3. Usamos el SERIALIZADOR para mantener la lógica de creación (User + Saleswoman)
            serializer = SaleswomanSerialeizer(data=payload)
            
            if serializer.is_valid():
                # Forzamos el administrador que pasamos por parámetro
                serializer.save(administrator=admin_responsable)
                vendedoras_creadas += 1
            else:
                errores.append({"email": person['email'], "error": serializer.errors})

        return {
            "status": "success",
            "creados": vendedoras_creadas,
            "errores": errores
        }

    except Exception as e:
        return {"error": str(e)}