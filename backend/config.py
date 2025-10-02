import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT", 5432) # Adicionando default port
}

# Chave secreta usada para assinar e verificar JWTs
SECRET_KEY = os.getenv("SECRET_KEY")

# Validação simples para evitar erros ao rodar
if not SECRET_KEY:
    print("AVISO: SECRET_KEY não definida! O JWT não funcionará corretamente.")
