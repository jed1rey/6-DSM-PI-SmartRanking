from db import get_connection
from typing import Dict, List # <--- CORREÇÃO AQUI

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
        cur.executemany(query, registros_para_inserir)
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Erro no DB ao salvar resultados de pesquisa: {e}")
        raise
    finally:
        cur.close()
        conn.close()