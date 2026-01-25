import qrcode
import os 
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

def generar_codigo_qr(instancia_id, prefijo="tela"):
    """
    Genera un qr le pega el id abajo y lo guarda en la carpeta de media
    retorne el nombre del archivo para guardarlo en la DB
    """
    directorio = os.path.join(settings.MEDIA_ROOT, 'qrs')
    if not os.path.exists(directorio):
        os.makedirs(directorio)

    nombre_archivo = f"qr_{prefijo}_{instancia_id}.png"
    ruta_guardar = os.path.join(directorio, nombre_archivo)

    data = str(instancia_id)

    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(data)
    qr.make(fit=True)
    img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    ancho, alto = img_qr.size 
    espacio_texto = 40
    canvas = Image.new('RGB', (ancho, alto + espacio_texto), 'white')
    canvas.paste(img_qr, (0, 0))

    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 25)
    except:
        font = ImageFont.load_default()

    texto = f"ID: {instancia_id}"
    bbox = draw.textbbox((0, 0), texto, font=font)
    ancho_texto = bbox[2] - bbox[0]
    draw.text(((ancho - ancho_texto) // 2, alto -5), texto, fill="black", font=font)

    canvas.save(ruta_guardar)
    return nombre_archivo