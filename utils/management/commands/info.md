# Primeras Palabras

Se optó por esta implementacion para automatizar el proceso de cada una de las peticiones de una API externa del dolar (bcv). Y posteriormente actualizar cuyo valor en la BD (Dollar_Rate). 

Se debe de tener en cuenta que cron + Management Command son nativos, no se utilizó una libreria externa para su uso.

-OS : Linux y MacOS

# Implementación de cron + Management Command

Esta implementación permite que el sistema mantenga actualizada la tasa del dólar de forma autónoma, sin intervención manual y sin necesidad de que un desarrollador mantenga procesos activos en su terminal.

Comando: crontab -e

Pegar: 
dr : Direccion actual del proyecto adentro de tu SO
0 17,18 * * 1-5 (dr + SGC_proyectoTelas/venv/bin/python) (dr + / manage.py service ) >> (dr + /cron_dollar.log 2>&1)

# Managament command

Se ha desarrollado un comando personalizado de Django ubicado en utils/management/commands/. Este script utiliza el ORM de Django para interactuar con la base de datos de forma segura.

- Petición: Se conecta a la API externa definida en el .env.

- Validación: Confirma que la respuesta sea exitosa (HTTP 200).

- Limpieza: Convierte el formato de moneda (coma por punto) y lo transforma a Decimal para evitar errores de precisión financiera.

- Persistencia: Utiliza update_or_create con un id=1 fijo. Esto garantiza que solo exista un registro maestro en la tabla, actualizándolo si ya existe o creándolo si es la primera vez.

# Automatizacion con cron (Proviene de Linux)

Para que el código se ejecute solo, se utiliza el programador de tareas del sistema operativo (Cron). No es necesario tener runserver iniciado ni el VS Code abierto, ya que Cron despierta el entorno virtual de Python, ejecuta el comando y luego se apaga.

# Formato : 0 16,17 * * 1-5

- 0 : Minuto exacto 0.

- 16,17 : Se ejecuta a las 4:00 PM y a las 5:00 PM.

- * * : Todos los días del mes y todos los meses.

- 1-5 : Solo de lunes a viernes (días hábiles bancarios).

# Proceso y Logs

Cada vez que el proceso se dispara (automático o manual), el sistema genera o alimenta un archivo llamado cron_dollar.log. El log es importante para analizar el comportamiento de los procesos.

- Éxito: Registra si la tasa fue actualizada o creada junto al valor obtenido.

- Errores: Si la API falla o hay problemas de red, el error se captura y se escribe en el log (ej. Connection aborted), permitiendo auditar fallos sin revisar el código.