from db import get_connection
import psycopg2

def salvar_resultados(pesquisa_id, resultados):
    """
    Salva os resultados do ranking (top 5) associados a uma pesquisa.
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        for r in resultados[:5]:  # Salva apenas o top 5
            cur.execute("""
                INSERT INTO resultados_pesquisa (pesquisa_id, app_nome, score)
                VALUES (%s, %s, %s)
            """, (pesquisa_id, r["app_nome"], r["score"]))
        conn.commit()
    except psycopg2.Error as e:
        print(f"Erro ao salvar resultados: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()