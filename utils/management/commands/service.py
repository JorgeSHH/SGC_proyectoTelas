import requests, os
from django.core.management.base import BaseCommand
from decimal import Decimal
from dotenv import load_dotenv
from utils.models import Dollar_Rate

# Carga las variables del archivo .env al entorno
load_dotenv()

class Command(BaseCommand):
    help = 'Actualiza la tasa de dólar desde una API externa'

    def handle(self, *args, **kwargs):
        API_DOLLAR_URL = os.getenv('API_LINK')

        try:
            #Peticion
            req = requests.get(API_DOLLAR_URL, timeout=10)
            
            #Valida si la peticion fue exitosa
            req.raise_for_status()

            if req.status_code == 200:
                data = req.json();
                
                #Limpieza
                raw_rate = str(data.get('dolar')).replace(',', '.')
                new_rate = Decimal(raw_rate)
                origin = data.get('currency').strip().lower()

                #Actualiza la tasa en el modelo Dollar_Rate
                obj, created = Dollar_Rate.objects.update_or_create( 
                    id=1, # Identificador único para la tasa principal - solo existe uno
                    defaults={
                        'rate': new_rate,
                        'origin': origin
                    }
                )
        
                #Mensajes para el usuario (Actualizada o creada) -> cron_dollar.log
                status = "creada" if created else "actualizada"
                self.stdout.write(self.style.SUCCESS(f'Tasa {status}: {new_rate} - {origin}'))

        #Mensajes para el usuario (Error) -> cron_dollar.log
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al actualizar: {e}'))