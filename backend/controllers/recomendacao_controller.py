from typing import List, Dict, Any, Optional
from utils.knn_processor import buscar_apps_com_recomendacao

# --- Mapeamento de Valores de Entrada (Strings para Números/Formatos KNN) ---

# 1. Sentiment: Mapeia sentimentos (positivas/neutras/negativas) para o valor mínimo do modelo
SENTIMENT_MAP = {
    "positivas": 0.8,    # Representa um valor mínimo alto de sentimento
    "neutras": 0.4,
    "negativas": 0.0,
}

# 3. Rating: Mapeia estrelas para valor mínimo de rating (float)
RATING_MAP = {
    "1 estrela": 1.0,
    "2 estrelas": 2.0,
    "3 estrelas": 3.0,
    "4 estrelas": 4.0,
    "5 estrelas": 5.0,
}

# 5. Size: Mapeia tamanho para o valor máximo em MB (para filtro <= Size)
SIZE_MAP = {
    "1 - Pequeno (≤10MB)": 10.0,
    "2 - medio (10MB-50MB)": 50.0,
    "3 - grande (>50MB)": 100.0, # Usamos um valor alto como limite superior para simulação
}

# 6. Installs: Mapeia faixas para o valor mínimo de instalações (para filtro >= Installs)
INSTALLS_MAP = {
    "0 a 9,999": 0,
    "10,000 a 99,999": 10000,
    "100,000 a 999,999": 100000,
    "1,000,000 a 9,999,999": 1000000,
    "Mais de 10,000,000": 10000000,
}

# 8. Android Version: Mapeia versão para o valor máximo numérico (para filtro <= Version)
# NOTE: Os valores do seu modelo (2, 4.4, 7, etc.) devem ser usados aqui. 
# Estou usando os valores brutos como strings.
ANDROID_VERSION_MAP = {
    "1.5": 1.5, "1.6": 1.6, "2": 2.0, "2.1": 2.1, "2.2": 2.2, "2.3": 2.3, 
    "3": 3.0, "3.2": 3.2, "4": 4.0, "4.1": 4.1, "4.2": 4.2, "4.3": 4.3, 
    "4.4": 4.4, "5": 5.0, "5.1": 5.1, "6": 6.0, "7": 7.0, "7.1": 7.1, "8": 8.0
}


def gerar_recomendacoes(
    usuario_id: int, 
    sentiment: str, 
    category: str, 
    rating: str, 
    app_type: str, 
    size: str, 
    installs: str, 
    content_rating: str, 
    android_version: str
) -> Dict[str, List]:
    """
    Controlador que recebe os 8 filtros do usuário, traduz para o formato do modelo (float/numérico) 
    e coordena a geração de recomendações.
    """
    
    # --- 1. Tradução de Strings para Valores Numéricos/Formato Esperado ---
    
    # 1. Sentiment: Mínimo esperado
    sentiment_val = SENTIMENT_MAP.get(sentiment)
    
    # 3. Rating: Mínimo esperado
    rating_val = RATING_MAP.get(rating)
    
    # 4. Type: Valor exato (assumindo que o modelo espera 'Paid' ou 'Free' ou similar)
    app_type_val = 'Paid' if app_type.lower() == 'pago' else 'Free' # Ajustar para o que seu df_model_orig espera
    
    # 5. Size: Valor máximo (em MB)
    size_val = SIZE_MAP.get(size)
    
    # 6. Installs: Valor mínimo
    installs_val = INSTALLS_MAP.get(installs)
    
    # 7. Content Rating: Mantido como string (ajustar para o valor esperado pelo DB/Model)
    content_rating_val = content_rating 
    
    # 8. Android Version: Valor máximo
    android_version_val = ANDROID_VERSION_MAP.get(android_version)

    # O Filtro 'category' é passado como string, esperando que o modelo o trate
    
    # --- 2. Chama a lógica de recomendação com valores traduzidos ---
    
    try:
        top10_list, recomendados_list = buscar_apps_com_recomendacao(
            sentiment_val=sentiment_val, 
            category=category, 
            rating_val=rating_val, 
            app_type=app_type_val, 
            size_val=size_val, 
            installs_val=installs_val, 
            content_rating=content_rating_val, 
            android_version_val=android_version_val
        )

        return {
            "top10_ranking": top10_list,
            "recomendacoes_knn": recomendados_list
        }
    
    except Exception as e:
        print(f"Erro Crítico no Controller (KNN): {e}")
        # Retorna uma estrutura de erro consistente para a rota
        return {"error": "Falha ao processar o modelo de recomendação."}, 500