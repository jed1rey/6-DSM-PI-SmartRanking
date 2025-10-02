import psycopg2
from psycopg2.extras import RealDictCursor
from config import DB_CONFIG

def get_connection():
    """
    Estabelece e retorna uma nova conexão com o banco de dados.
    Usa RealDictCursor para retornar resultados como dicionários.
    """
    try:
        return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    except psycopg2.Error as e:
        print(f"Erro de conexão com o PostgreSQL: {e}")
        # Re-lança a exceção para que o app.py possa capturá-la no startup
        raise
