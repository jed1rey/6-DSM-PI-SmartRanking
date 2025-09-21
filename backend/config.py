import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "rankingdb"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASS", "senha"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432")
}

SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_super_segura")
