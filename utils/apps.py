# utils/apps.py
from django.apps import AppConfig
from django.conf import settings
import os

def execute_rate_update():
    """Función puente para evitar el error de pickling"""
    from django.core.management import call_command
    # Reemplaza 'nombre_de_tu_comando' por el nombre del archivo .py 
    # (ej: si es actualizar_tasa.py, pon 'actualizar_tasa')
    call_command('service')

class MyConfig(AppConfig):
    name = 'utils'

    def ready(self):
        # 1. Evitar ejecuciones duplicadas en desarrollo
        if os.environ.get('RUN_MAIN') != 'true':
            return
        
        from apscheduler.schedulers.background import BackgroundScheduler
        from django_apscheduler.jobstores import DjangoJobStore

        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), "default")

        # 2. Programar usando la FUNCIÓN, no el comando directo
        # Tarea de las 5 PM
        scheduler.add_job(
            execute_rate_update, 
            trigger='cron', 
            hour='20', 
            minute='25',
            id='tasa_5pm', # ID único
            name='Actualización Tarde 1',
            jobstore="default",
            replace_existing=True
        )

        # Tarea de las 6 PM
        scheduler.add_job(
            execute_rate_update, 
            trigger='cron', 
            hour='18', 
            minute='0',
            id='tasa_6pm', # ID único
            name='Actualización Tarde 2',
            jobstore="default",
            replace_existing=True
        )
        
        try:
            scheduler.start()
        except Exception as e:
            print(f"Error iniciando scheduler: {e}")