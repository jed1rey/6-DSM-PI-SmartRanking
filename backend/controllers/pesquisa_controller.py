from models.pesquisa_model import criar_pesquisa, get_all_pesquisas_by_user, get_pesquisa_by_id, get_all_pesquisas
from models.resultado_model import salvar_resultados
import sys

def processar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao="score_inteligente"):
    """
    Cria uma nova pesquisa, simula o ranking e salva os resultados.
    """
    pesquisa_id = criar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao)

    if not pesquisa_id:
        return None, None

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

def buscar_pesquisas_usuario(usuario_id):
    """
    Busca todas as pesquisas de um usuário específico.
    """
    return get_all_pesquisas_by_user(usuario_id)

def buscar_pesquisa_por_id(pesquisa_id, usuario_id=None):
    """
    Busca uma pesquisa específica. O filtro por usuário é opcional.
    """
    return get_pesquisa_by_id(pesquisa_id, usuario_id)

def buscar_historico_por_usuario_id_publico(usuario_id):
    """
    Busca todas as pesquisas feitas por um ID de usuário, para uso em rota pública.
    """
    return get_all_pesquisas_by_user(usuario_id)

def buscar_todas_pesquisas():
    """
    Busca todas as pesquisas no sistema, sem filtro de usuário.
    """
    return get_all_pesquisas()