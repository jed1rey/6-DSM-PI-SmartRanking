from models.pesquisa_model import criar_pesquisa, get_all_pesquisas_by_user, get_pesquisa_by_id, get_all_pesquisas
from models.resultado_model import salvar_resultados
from utils.knn_processor import buscar_apps_com_recomendacao
from typing import List, Dict, Any, Optional
import sys

# --- Mapeamento de Valores de Entrada (Strings do FRONT para Valores do MODELO) ---
# ATENÇÃO: As chaves aqui (strings) devem ser EXATAMENTE o que o front envia.

# 2. Sentiment: Mapeia string para o valor numérico (1, 0, -1)
SENTIMENT_MAP = {
    "POSITIVO": 1.0,
    "NEUTRO": 0.0,
    "NEGATIVO": -1.0,
    # Adicionando os aliases que vimos no log de erro (ex: 'positivas')
    "POSITIVAS": 1.0,
    "NEUTRAS": 0.0,
    "NEGATIVAS": -1.0,
}

# 4. Rating: Mapeia estrelas para valor numérico (INT)
RATING_MAP = {
    "1 estrela": 1,
    "2 estrelas": 2,
    "3 estrelas": 3,
    "4 estrelas": 4,
    "5 estrelas": 5,
}

# 6. Type: Mapeia string do front para o valor do dataset/modelo ('Paid' ou 'Free')
TYPE_MAP = {
    "PAGO": 'Paid',
    "GRÁTIS": 'Free',
}

# 7. Size: Mapeia faixas para o valor numérico (1, 2, 3)
SIZE_MAP = {
    "PEQUENO (ATÉ 10 MB)": 1,
    "MÉDIO ( ENTRE 10 A 50 MB)": 2,
    "GRANDE (MAIOR QUE 50 MB)": 3,
}

# 8. Installs: Mapeia faixas para o valor numérico (1 a 5)
INSTALLS_MAP = {
    "0 – 9,999": 1,
    "10,000 – 99,999": 2,
    "100,000 – 999,999": 3,
    "1,000,000 – 9,999,999": 4,
    "10,000,000+": 5,
}

# 9. Content Rating: Mapeia string do front para o valor numérico (INT 1 a 5)
CONTENT_RATING_MAP = {
    "LIVRE": 1,
    "LIVRE ACIMA DE 10 ANOS": 2,
    "ADOLESCENTE": 3,
    "ACIMA DE 17 ANOS": 4,
    "ADULTOS +18": 5
}

# 10. Android Version: Mapeia string do front para o valor numérico (INT 2 a 8)
ANDROID_VERSION_MAP = {
    "ANDROID VERSÃO ATÉ 2.0": 2, 
    "ANDROID VERSÃO ATÉ 3.0": 3, 
    "ANDROID VERSÃO ATÉ 4.0": 4, 
    "ANDROID VERSÃO ATÉ 5.0": 5, 
    "ANDROID VERSÃO ATÉ 6.0": 6, 
    "ANDROID VERSÃO ATÉ 7.0": 7, 
    "ANDROID VERSÃO ACIMA DE 8.0": 8
}
# --- Fim do Mapeamento ---


def _traduzir_filtros(
    sentiment: str, category: str, rating: str, app_type: str, size: str, installs: str, content_rating: str, android_version: str
) -> Dict[str, Any]:
    """
    Traduz as strings do frontend para os valores numéricos/formatos que o modelo espera.
    """
    
    try:
        # Mapeamento (usando .get() para evitar KeyError se a string for None)
        # Convertemos para UPPERCASE para garantir consistência
        sentiment_val = SENTIMENT_MAP.get(sentiment.upper() if sentiment else None)
        rating_val = RATING_MAP.get(rating)
        app_type_val = TYPE_MAP.get(app_type.upper() if app_type else None)
        size_val = SIZE_MAP.get(size)
        installs_val = INSTALLS_MAP.get(installs)
        content_rating_val = CONTENT_RATING_MAP.get(content_rating)
        android_version_val = ANDROID_VERSION_MAP.get(android_version)
    except AttributeError as e:
        # Captura se uma das strings de entrada for None e tentarmos .upper()
        print(f"Erro de Atributo na Tradução: {e}", file=sys.stderr)
        raise ValueError("Um dos valores de filtro é inválido ou nulo.")

    # Verifica se todos os mapeamentos numéricos funcionaram
    if any(v is None for v in [sentiment_val, rating_val, app_type_val, size_val, installs_val, content_rating_val, android_version_val]):
        print(f"DEBUG: Falha na Tradução. Valores recebidos (originais):", file=sys.stderr)
        print(f"Sentiment: {sentiment} -> {sentiment_val}", file=sys.stderr)
        print(f"Rating: {rating} -> {rating_val}", file=sys.stderr)
        print(f"Type: {app_type} -> {app_type_val}", file=sys.stderr)
        print(f"Size: {size} -> {size_val}", file=sys.stderr)
        print(f"Installs: {installs} -> {installs_val}", file=sys.stderr)
        print(f"Content: {content_rating} -> {content_rating_val}", file=sys.stderr)
        print(f"Android: {android_version} -> {android_version_val}", file=sys.stderr)
        raise ValueError("Um dos valores de filtro não pôde ser traduzido. Verifique o JSON de entrada.")

    return {
        "sentiment_val": sentiment_val, 
        "category": category, 
        "rating_val": rating_val, 
        "app_type_val": app_type_val, 
        "size_val": size_val, 
        "installs_val": installs_val, 
        "content_rating_val": content_rating_val, 
        "android_version_val": android_version_val
    }


def processar_pesquisa(
    usuario_id: int, 
    sentiment: str, 
    category: str, 
    rating: str, 
    app_type: str, 
    size: str, 
    installs: str, 
    content_rating: str, 
    android_version: str,
    ordenacao: str 
) -> tuple:
    """ Controlador que coordena a tradução dos filtros, a execução do KNN e o salvamento do histórico. """
    
    try:
        # 1. Traduzir strings do front para o formato do modelo (Numérico/String)
        filtros_traduzidos = _traduzir_filtros(
            sentiment, category, rating, app_type, size, installs, content_rating, android_version
        )
    except ValueError as e:
        print(f"Erro de Tradução: {e}", file=sys.stderr)
        raise e
    except Exception as e:
        print(f"Erro desconhecido na tradução de filtros: {e}", file=sys.stderr)
        raise e

    
    # 2. Inserir os filtros na tabela de histórico ('pesquisas')
    pesquisa_id = criar_pesquisa(
        usuario_id=usuario_id, 
        sentiment=filtros_traduzidos['sentiment_val'], 
        category=filtros_traduzidos['category'], 
        min_rating=filtros_traduzidos['rating_val'], 
        app_type=filtros_traduzidos['app_type_val'],
        app_size=filtros_traduzidos['size_val'], 
        min_installs=filtros_traduzidos['installs_val'], 
        content_rating=filtros_traduzidos['content_rating_val'], 
        android_version=filtros_traduzidos['android_version_val']
    )

    if not pesquisa_id:
        return None, None
    
    # 3. Execução do KNN e Geração do Ranking
    try:
        top10_list, recomendados_list = buscar_apps_com_recomendacao(
            sentiment_val=filtros_traduzidos['sentiment_val'], 
            category=filtros_traduzidos['category'], 
            rating_val=filtros_traduzidos['rating_val'], 
            app_type_val=filtros_traduzidos['app_type_val'],
            size_val=filtros_traduzidos['size_val'], 
            installs_val=filtros_traduzidos['installs_val'], 
            content_rating_val=filtros_traduzidos['content_rating_val'], 
            android_version_val=filtros_traduzidos['android_version_val']
        )
        
        resultados = {
            "top10_ranking": top10_list,
            "recomendacoes_knn": recomendados_list
        }

        # 4. Salvar resultados Top10 e KNN na tabela 'resultados_pesquisa'
        salvar_resultados(pesquisa_id, resultados)
        
        return pesquisa_id, resultados

    except Exception as e:
        print(f"Erro Crítico durante KNN/Salvamento: {e}", file=sys.stderr)
        raise e


# --- Funções de Consulta (Mantidas) ---

def buscar_pesquisas_usuario(usuario_id):
    return get_all_pesquisas_by_user(usuario_id)

def buscar_pesquisa_por_id(pesquisa_id, usuario_id=None):
    return get_pesquisa_by_id(pesquisa_id, usuario_id)

def buscar_historico_por_usuario_id_publico(usuario_id):
    return get_all_pesquisas_by_user(usuario_id)

def buscar_todas_pesquisas():
    return get_all_pesquisas()