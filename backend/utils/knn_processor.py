import joblib
import os
import pandas as pd
import numpy as np
from typing import List, Dict, Tuple, Any
import sys

# --- CONFIGURAÇÃO DE CAMINHO (Mantenha os PKLs na pasta 'utils' para esta correção) ---
MODEL_DIR = os.path.dirname(os.path.abspath(__file__)) 


# Variáveis globais para armazenar os modelos carregados
df_model_global: Any = None
df_model_orig_global: Any = None
X_knn_df_global: Any = None
knn_model_global: Any = None


def carregar_modelos():
    """ Carrega os objetos .pkl salvos. """
    global df_model_global, df_model_orig_global, X_knn_df_global, knn_model_global
    
    try:
        # Assumindo que o código está no diretório correto (utils/)
        df_model_global = joblib.load(os.path.join(MODEL_DIR, "df_model_final.pkl"))
        df_model_orig_global = joblib.load(os.path.join(MODEL_DIR, "df_model_orig.pkl"))
        X_knn_df_global = joblib.load(os.path.join(MODEL_DIR, "X_knn_df.pkl"))
        knn_model_global = joblib.load(os.path.join(MODEL_DIR, "knn_model.pkl"))

        print("✅ Modelos KNN carregados com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro Crítico ao carregar modelos do joblib (arquivos PKL): {e}", file=sys.stderr)
        raise e


def inicializar_modelos(df_model_f: Any, df_model_orig_f: Any, X_knn_df_f: Any, knn_model_f: Any):
    """ Função CHAMADA PELO app2.py para INJETAR os modelos carregados globalmente. """
    global df_model_global, df_model_orig_global, X_knn_df_global, knn_model_global
    df_model_global = df_model_f
    df_model_orig_global = df_model_orig_f
    X_knn_df_global = X_knn_df_f
    knn_model_global = knn_model_f


def buscar_apps_com_recomendacao(
    sentiment_val: float,
    category: str,
    rating_val: int,
    app_type_val: str,
    size_val: float,
    installs_val: int,
    content_rating_val: int,
    android_version_val: float
) -> Tuple[List[Dict], List[Dict]]:
    """ Executa a lógica de filtragem e KNN usando os modelos globais injetados. """
    
    if df_model_orig_global is None or knn_model_global is None:
        raise Exception("Modelos de recomendação não foram carregados na inicialização do Flask.")

    df_filtrado = df_model_orig_global.copy()

    # --- 2. Aplicação dos Filtros (com Lógica Corrigida) ---
    
    print("\n--- INICIANDO DEBUG DE FILTRO KNN ---", file=sys.stderr)
    print(f"Total de Apps antes do filtro: {df_filtrado.shape[0]}", file=sys.stderr)
    
    if category:
        df_filtrado = df_filtrado[df_filtrado['Category'] == category]
        print(f"Após filtro Category ({category}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    if app_type_val:
        df_filtrado = df_filtrado[df_filtrado['Type'] == app_type_val]
        print(f"Após filtro Type ({app_type_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    if sentiment_val is not None:
        df_filtrado = df_filtrado[df_filtrado['Sentiment'] >= sentiment_val]
        print(f"Após filtro Sentiment (>= {sentiment_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    if rating_val is not None:
        # "4 estrelas" significa 4 ou mais, então >= está CORRETO.
        df_filtrado = df_filtrado[df_filtrado['Rating'] >= rating_val]
        print(f"Após filtro Rating (>= {rating_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    # CORREÇÃO DE LÓGICA (Installs): Mapeamento é para uma categoria (ex: 4), não um mínimo.
    if installs_val is not None:
        df_filtrado = df_filtrado[df_filtrado['Installs'] == installs_val]
        print(f"Após filtro Installs (== {installs_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    if content_rating_val is not None:
        df_filtrado = df_filtrado[df_filtrado['Content_Rating'] == content_rating_val]
        print(f"Após filtro Content_Rating (== {content_rating_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    # CORREÇÃO DE LÓGICA (Size): Mapeamento é para uma categoria (ex: 1), não um máximo.
    if size_val is not None:
        df_filtrado = df_filtrado[df_filtrado['Size'] == size_val]
        print(f"Após filtro Size (== {size_val}): {df_filtrado.shape[0]}", file=sys.stderr)
        
    # CORREÇÃO DE NOME DE COLUNA E LÓGICA (Android_Version):
    if android_version_val is not None:
        # Assumindo que o campo no DF é 'Android_Version' (sem _Num) e que o filtro é ATÉ (<=)
        df_filtrado = df_filtrado[df_filtrado['Android_Version'] <= android_version_val] 
        print(f"Após filtro Android_Version (<= {android_version_val}): {df_filtrado.shape[0]}", file=sys.stderr)

    print("--- FIM DO DEBUG DE FILTRO KNN ---\n", file=sys.stderr)


    if df_filtrado.empty:
        print("DEBUG: O DataFrame ficou vazio após os filtros. Retornando listas vazias.", file=sys.stderr)
        return [], []

    # --- 3. Geração de Ranking e KNN ---
    top10_df = df_filtrado.sort_values(by='Nota_Final', ascending=False).head(10)
    top10_list = top10_df[['App', 'Category', 'Rating', 'Nota_Final']].to_dict(orient="records")

    if top10_df.empty:
        return top10_list, []

    # Geração do KNN
    indices_top10 = top10_df.index
    vetor_referencia = X_knn_df_global.loc[indices_top10].mean(axis=0).values.reshape(1, -1)
    distances, indices_knn = knn_model_global.kneighbors(vetor_referencia, n_neighbors=6)
    vizinhos_indices = X_knn_df_global.index[indices_knn.flatten()[1:]]

    # Seleciona recomendações exclusivas (que não estão no Top10)
    recomendados_df = df_model_orig_global.loc[vizinhos_indices]
    recomendados_df = recomendados_df[~recomendados_df['App'].isin(top10_df['App'])].head(5)
    recomendados_list = recomendados_df[['App', 'Category', 'Rating']].to_dict(orient="records")

    return top10_list, recomendados_list