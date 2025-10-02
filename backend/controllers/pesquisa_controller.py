from models.pesquisa_model import criar_pesquisa
from models.resultado_model import salvar_resultados # Note o nome do arquivo: resultado_models.py (no plural)

def processar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao="score_inteligente"):
    """
    Cria um registro de pesquisa no banco e gera resultados mockados (temporário).
    """
    pesquisa_id = criar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao)

    # Exemplo de ranking mockado (depois vai vir do dataset)
    top_5 = [
        {"app_nome": "App A", "score": 95},
        {"app_nome": "App B", "score": 92},
        {"app_nome": "App C", "score": 90},
        {"app_nome": "App D", "score": 88},
        {"app_nome": "App E", "score": 85},
    ]

    salvar_resultados(pesquisa_id, top_5)
    return pesquisa_id, top_5
