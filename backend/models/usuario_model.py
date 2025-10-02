from db import get_connection
import psycopg2 # Importado para capturar o IntegrityError

def create_user(nome, data_nascimento, email, senha_hash):
    """
    Insere um novo usuário no banco de dados, incluindo a data de criação.
    Retorna o ID do novo usuário ou None em caso de falha de integridade.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # AQUI: Inclusão de 'criado_em' preenchida por NOW() para evitar erro NOT NULL
        cur.execute("""
            INSERT INTO usuarios (nome, data_nascimento, email, senha_hash, criado_em)
            VALUES (%s, %s, %s, %s, NOW()) RETURNING id
        """, (nome, data_nascimento, email, senha_hash))
        
        user_id = cur.fetchone()["id"]
        conn.commit()
        return user_id
    except psycopg2.IntegrityError as e:
        # Captura erros de email duplicado (UNIQUE) ou NOT NULL violation (como criado_em ausente)
        print(f"Erro de integridade ao criar usuário: {e}")
        conn.rollback()
        return None
    finally:
        cur.close()
        conn.close()

def get_user_by_email(email):
    """
    Busca um usuário pelo email.
    Retorna o dicionário do usuário ou None.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user