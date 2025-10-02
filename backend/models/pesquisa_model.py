from db import get_connection

def criar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao):
    """
    Insere uma nova pesquisa no banco de dados e retorna seu ID.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO pesquisas (usuario_id, categoria, genero, preco_opcao, ordenacao, criado_em)
            VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id
        """, (usuario_id, categoria, genero, preco_opcao, ordenacao))
        pesquisa_id = cur.fetchone()["id"]
        conn.commit()
        return pesquisa_id
    except Exception as e:
        conn.rollback()
        print(f"Erro ao criar pesquisa no DB: {e}")
        return None
    finally:
        cur.close()
        conn.close()

def get_all_pesquisas_by_user(usuario_id):
    """
    Retorna todas as pesquisas feitas por um usuário específico (usado em rotas protegidas).
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, categoria, genero, preco_opcao, ordenacao, criado_em 
        FROM pesquisas 
        WHERE usuario_id = %s
        ORDER BY criado_em DESC
    """, (usuario_id,))
    pesquisas = cur.fetchall()
    cur.close()
    conn.close()
    return pesquisas

def get_pesquisa_by_id(pesquisa_id, usuario_id=None):
    """
    Retorna uma pesquisa específica. Se usuario_id for fornecido, filtra por ele (segurança).
    Se for None (rota pública), busca apenas pelo ID da pesquisa.
    """
    conn = get_connection()
    cur = conn.cursor()
    
    if usuario_id is not None:
        cur.execute("""
            SELECT id, categoria, genero, preco_opcao, ordenacao, criado_em 
            FROM pesquisas 
            WHERE id = %s AND usuario_id = %s
        """, (pesquisa_id, usuario_id))
    else:
        # Rota pública: busca apenas pelo ID da pesquisa
        cur.execute("""
            SELECT id, categoria, genero, preco_opcao, ordenacao, criado_em 
            FROM pesquisas 
            WHERE id = %s
        """, (pesquisa_id,))
        
    pesquisa = cur.fetchone()
    cur.close()
    conn.close()
    return pesquisa

def get_all_pesquisas():
    """
    NOVO: Retorna a lista de TODAS as pesquisas no sistema (usado em rota pública).
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, usuario_id, categoria, genero, preco_opcao, ordenacao, criado_em 
        FROM pesquisas 
        ORDER BY criado_em DESC
    """)
    pesquisas = cur.fetchall()
    cur.close()
    conn.close()
    return pesquisas