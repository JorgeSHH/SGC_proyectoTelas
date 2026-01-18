from django.core.mail import send_mail
from django.conf import settings

def enviar_correo_bienvenida(email_vendedora, nombre, password_plana):
    asunto = "Bienbenida al Sistema de Gestion de Retazos"
    mensaje = f"""
    Hola {nombre},
    
    Tu cuenta como vendedora ha sido creada exitosamente.
    Aquí tienes tus credenciales para acceder a tu cuenta:
    
    Usuario: {email_vendedora}
    Contraseña: {password_plana}
    
    Por favor guardarlas, si desea cammbiar algun dato de su 
    perfil consultar con el  administrador mas cercano.

    - Para acceder al sistema consultar al administrador por el link(enlace) del servidor
    """


    send_mail(
        asunto,
        mensaje,
        settings.DEFAULT_FROM_EMAIL,
        [email_vendedora],
        fail_silently=False,
    )