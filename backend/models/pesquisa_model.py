from db import get_connection
import psycopg2 # Importar para tratar exceções

def criar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao):
    """
    Salva os parâmetros da pesquisa no banco de dados, incluindo o timestamp de criação.
    Retorna o ID da nova pesquisa.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # A coluna 'criado_em' é preenchida com o horário atual usando NOW()
        cur.execute("""
            INSERT INTO pesquisas (usuario_id, categoria, genero, preco_opcao, ordenacao, criado_em)
            VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id
        """, (usuario_id, categoria, genero, preco_opcao, ordenacao))
        pesquisa_id = cur.fetchone()["id"]
        conn.commit()
        return pesquisa_id
    except psycopg2.Error as e:
        # Em caso de erro (ex: FK violada), faz rollback e imprime o erro
        print(f"Erro ao criar pesquisa: {e}")
        conn.rollback()
        return None
    finally:
        cur.close()
        conn.close()
