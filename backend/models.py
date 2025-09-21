from db import get_connection
from passlib.hash import bcrypt

# ---------------- Usuários ----------------
def create_user(nome, data_nascimento, email, senha):
    conn = get_connection()
    cur = conn.cursor()
    senha_hash = bcrypt.hash(senha)

    cur.execute("""
        INSERT INTO usuarios (nome, data_nascimento, email, senha_hash)
        VALUES (%s, %s, %s, %s) RETURNING id
    """, (nome, data_nascimento, email, senha_hash))

    user_id = cur.fetchone()["id"]
    conn.commit()
    cur.close()
    conn.close()
    return user_id

def get_user_by_email(email):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user
