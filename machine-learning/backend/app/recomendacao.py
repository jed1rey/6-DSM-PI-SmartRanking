import pandas as pd

def buscar_apps_com_recomendacao(
    df_model,
    df_model_orig,
    X_knn_df,
    knn_model,
    app=None,
    Category=None,
    Type=None,
    Sentiment_min=None,
    Rating_min=None,
    Size=None,
    Installs=None,
    Content_Rating=None,
    Android_Version_max=None,
):
    """
    Busca Top10 apps por Nota_Final + 5 recomendações exclusivas usando KNN
    """
    df_filtrado = df_model_orig.copy()

    # Aplica filtros opcionais
    if app:
        df_filtrado = df_filtrado[df_filtrado['App'].str.contains(app, case=False, na=False)]
    if Category:
        df_filtrado = df_filtrado[df_filtrado['Category'] == Category]
    if Type:
        df_filtrado = df_filtrado[df_filtrado['Type'] == Type]
    if Sentiment_min is not None:
        df_filtrado = df_filtrado[df_filtrado['Sentiment'] >= Sentiment_min]
    if Rating_min is not None:
        df_filtrado = df_filtrado[df_filtrado['Rating'] >= Rating_min]
    if Size is not None:
        df_filtrado = df_filtrado[df_filtrado['Size'] <= Size]
    if Installs is not None:
        df_filtrado = df_filtrado[df_filtrado['Installs'] >= Installs]
    if Content_Rating:
        df_filtrado = df_filtrado[df_filtrado['Content Rating'] == Content_Rating]
    if Android_Version_max is not None:
        df_filtrado = df_filtrado[df_filtrado['Android_Version_Num'] <= Android_Version_max]

    if df_filtrado.empty:
        return pd.DataFrame(), pd.DataFrame()

    # --- Top10 pelo Nota_Final
    top10 = df_filtrado.sort_values(by='Nota_Final', ascending=False).head(10)

    # --- Vetor de referência KNN (média do top10)
    indices_top10 = top10.index
    vetor_referencia = X_knn_df.loc[indices_top10].mean(axis=0).values.reshape(1, -1)

    distances, indices_knn = knn_model.kneighbors(vetor_referencia)
    vizinhos_indices = X_knn_df.index[indices_knn.flatten()[1:]]  # ignora o centro

    # --- Seleciona recomendações exclusivas
    recomendados = df_model_orig.loc[vizinhos_indices]
    recomendados = recomendados[~recomendados['App'].isin(top10['App'])].head(5)

    return top10, recomendados
