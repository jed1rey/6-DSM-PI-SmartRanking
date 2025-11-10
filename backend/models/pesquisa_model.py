from db import get_connection

def criar_pesquisa(
    usuario_id: int, 
    sentiment: float, 
    category: str, 
    min_rating: int, 
    app_type: str, 
    app_size: float, 
    min_installs: int, 
    content_rating: int, 
    android_version: float
):
    """
    Insere uma nova pesquisa no banco de dados com todos os 8 filtros do KNN.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # AQUI GARANTIMOS QUE O NÚMERO DE COLUNAS E PARÂMETROS BATE
        # São 9 colunas no total, excluindo o 'id' e 'criado_em'
        cur.execute("""
            INSERT INTO pesquisas (
                usuario_id, sentiment, category, min_rating, app_type, app_size, 
                min_installs, content_rating, android_version, criado_em
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()) RETURNING id
        """, (
            usuario_id, sentiment, category, min_rating, app_type, app_size, 
            min_installs, content_rating, android_version
        ))
        pesquisa_id = cur.fetchone()["id"]
        conn.commit()
        return pesquisa_id
    except Exception as e:
        conn.rollback()
        # O log agora deve mostrar o erro real do PostgreSQL, se houver
        print(f"Erro ao criar pesquisa (filtros) no DB: {e}") 
        return None
    finally:
        cur.close()
        conn.close()

def get_all_pesquisas_by_user(usuario_id):
    """
    Retorna todas as pesquisas feitas por um usuário específico.
    """
    conn = get_connection()
    cur = conn.cursor()
    # Seleção de todas as colunas relevantes
    cur.execute("""
        SELECT *
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
    Retorna uma pesquisa específica. Se usuario_id for fornecido, filtra por ele.
    """
    conn = get_connection()
    cur = conn.cursor()
    
    if usuario_id is not None:
        cur.execute("""
            SELECT * FROM pesquisas 
            WHERE id = %s AND usuario_id = %s
        """, (pesquisa_id, usuario_id))
    else:
        # Rota pública: busca apenas pelo ID da pesquisa
        cur.execute("""
            SELECT * FROM pesquisas 
            WHERE id = %s
        """, (pesquisa_id,))
        
    pesquisa = cur.fetchone()
    cur.close()
    conn.close()
    return pesquisa

def get_all_pesquisas():
    """
    Retorna a lista de TODAS as pesquisas no sistema.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT *
        FROM pesquisas 
        ORDER BY criado_em DESC
    """)
    pesquisas = cur.fetchall()
    cur.close()
    conn.close()
    return pesquisas