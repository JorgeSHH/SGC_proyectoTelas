import requests, os
from dotenv import load_dotenv

# Carga las variables del archivo .env al entorno
load_dotenv()
API_DOLLAR_URL = os.getenv('API_LINK')

def get_value_dollar():
    try:
        req = requests.get(API_DOLLAR_URL, timeout=5)
        req.raise_for_status()

        if req.status_code == 200:
            data = req.json();
            return data;
    except requests.RequestException as err: 
        print(f'Error fetching data: {err}')
        return None


data = get_value_dollar()

if data:
    print(f"Informacion : {data}") # {'currency' : 'USD' , 'dolar': '355.5...'}