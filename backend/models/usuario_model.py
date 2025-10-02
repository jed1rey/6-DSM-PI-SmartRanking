from db import get_connection

def create_user(nome, data_nascimento, email, senha_hash):
    """
    Cria um novo usuário no banco de dados.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO usuarios (nome, data_nascimento, email, senha_hash, criado_em)
            VALUES (%s, %s, %s, %s, NOW()) RETURNING id
        """, (nome, data_nascimento, email, senha_hash))
        user_id = cur.fetchone()["id"]
        conn.commit()
        return user_id
    except Exception as e:
        # Permite que o controller trate erros de integridade (ex: email duplicado)
        conn.rollback()
        print(f"Erro no DB ao criar usuário: {e}")
        return None
    finally:
        cur.close()
        conn.close()

def get_user_by_email(email):
    """
    Busca um usuário pelo email.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_all_usuarios():
    """
    Retorna a lista de todos os usuários.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome, email, data_nascimento, criado_em FROM usuarios")
    usuarios = cur.fetchall()
    cur.close()
    conn.close()
    return usuarios

def get_usuario_by_id(user_id):
    """
    Busca um usuário pelo ID.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome, email, data_nascimento, criado_em FROM usuarios WHERE id = %s", (user_id,))
    usuario = cur.fetchone()
    cur.close()
    conn.close()
    return usuario