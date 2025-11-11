from db import get_connection
from typing import Dict, List
import sys

def salvar_resultados(pesquisa_id: int, resultados: Dict):
    """
    Salva os resultados do Top10 e das Recomendações KNN na tabela resultados_pesquisa.
    """
    conn = get_connection()
    cur = conn.cursor()
    
    registros_para_inserir = []
    
    # 1. Processa o Ranking Top10
    top10 = resultados.get("top10_ranking", [])
    for i, r in enumerate(top10):
        registros_para_inserir.append((
            pesquisa_id,
            r.get("App"),
            r.get("Category"),
            r.get("Rating"),
            r.get("Installs"),
            r.get("Price"),
            "TOP10_RANKING",        # tipo_resultado
            i + 1,                    # posicao (1 a 10)
            r.get("Nota_Final"),      # nota_final
            None,                     # score_knn
            None                      # motivo_knn
        ))
        
    # 2. Processa as Recomendações KNN
    knn_recs = resultados.get("recomendacoes_knn", [])
    for i, r in enumerate(knn_recs):
        registros_para_inserir.append((
            pesquisa_id,
            r.get("App"),
            r.get("Category"),
            r.get("Rating"),
            r.get("Installs"),
            r.get("Price"),
            "KNN_RECOMENDACAO",     # tipo_resultado
            i + 1,                    # posicao (1 a 5)
            None,                     # nota_final
            r.get("score_knn"),       # score_knn
            r.get("motivo_knn")       # motivo_knn
        ))

    # 3. Execução do Batch Insert
    query = """
        INSERT INTO resultados_pesquisa (
            pesquisa_id, app_nome, categoria, rating, installs, preco, 
            tipo_resultado, posicao, nota_final, score_knn, motivo_knn
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    try:
        if registros_para_inserir:
            cur.executemany(query, registros_para_inserir)
            conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Erro no DB ao salvar resultados de pesquisa: {e}", file=sys.stderr)
        raise
    finally:
        cur.close()
        conn.close()


def get_resultados_by_pesquisa_id(pesquisa_id: int) -> List[Dict]:
    """
    Busca todos os resultados (Top10 e KNN) associados a um ID de pesquisa.
    """
    conn = get_connection()
    cur = conn.cursor()
    query = """
        SELECT * FROM resultados_pesquisa
        WHERE pesquisa_id = %s
        ORDER BY tipo_resultado, posicao;
    """
    try:
        cur.execute(query, (pesquisa_id,))
        resultados = cur.fetchall()
        return resultados
    except Exception as e:
        print(f"Erro no DB ao buscar resultados por ID de pesquisa: {e}", file=sys.stderr)
        return []
    finally:
        cur.close()
        conn.close()

def get_todos_resultados_by_user_id(usuario_id: int) -> List[Dict]:
    """
    NOVO: Busca TODOS os resultados (Top10/KNN) de TODAS as pesquisas de um usuário.
    """
    conn = get_connection()
    cur = conn.cursor()
    query = """
        SELECT r.*, p.criado_em as data_pesquisa
        FROM resultados_pesquisa r
        JOIN pesquisas p ON r.pesquisa_id = p.id
        WHERE p.usuario_id = %s
        ORDER BY p.criado_em DESC, r.tipo_resultado, r.posicao;
    """
    try:
        cur.execute(query, (usuario_id,))
        resultados = cur.fetchall()
        return resultados
    except Exception as e:
        print(f"Erro no DB ao buscar TODOS os resultados por ID de usuário: {e}", file=sys.stderr)
        return []
    finally:
        cur.close()
        conn.close()