from fastapi import FastAPI, Query
from typing import Optional
import pandas as pd

from app.loader import carregar_modelos
from app.recomendacao import buscar_apps_com_recomendacao

# Inicializa FastAPI
app = FastAPI(title="API de Recomendação de Apps")

# Carrega modelos
df_model, df_model_orig, X_knn_scaled_df, knn_model = carregar_modelos()

@app.get("/")
def home():
    return {"mensagem": "API de Recomendação está rodando!"}

@app.get("/api/recommend")
def recomendar(
    app: Optional[str] = Query(None),
    Category: Optional[str] = Query(None),
    Type: Optional[str] = Query(None),
    Sentiment_min: Optional[float] = Query(None),
    Rating_min: Optional[float] = Query(None),
    Size: Optional[float] = Query(None),
    Installs: Optional[float] = Query(None),
    Content_Rating: Optional[str] = Query(None),
    Android_Version_max: Optional[float] = Query(None)
):
    top10, recomendacoes = buscar_apps_com_recomendacao(
        df_model,
        df_model_orig,
        X_knn_scaled_df,
        knn_model,
        app=app,
        Category=Category,
        Type=Type,
        Sentiment_min=Sentiment_min,
        Rating_min=Rating_min,
        Size=Size,
        Installs=Installs,
        Content_Rating=Content_Rating,
        Android_Version_max=Android_Version_max
    )

    return {
        "top10": top10.to_dict(orient="records"),
        "recomendacoes": recomendacoes.to_dict(orient="records")
    }
