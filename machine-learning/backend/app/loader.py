import joblib
import os

# Caminho base e pasta de modelos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "modelos")

def carregar_modelos():
    """
    Carrega os objetos .pkl salvos
    """
    try:
        df_model = joblib.load(os.path.join(MODEL_DIR, "df_model_final.pkl"))
        df_model_orig = joblib.load(os.path.join(MODEL_DIR, "df_model_orig.pkl"))
        X_knn_df = joblib.load(os.path.join(MODEL_DIR, "X_knn_df.pkl"))  # ✅ nome ajustado
        knn_model = joblib.load(os.path.join(MODEL_DIR, "knn_model.pkl"))

        print("✅ Modelos carregados com sucesso!")
        return df_model, df_model_orig, X_knn_df, knn_model

    except Exception as e:
        print(f"❌ Erro ao carregar modelos: {e}")
        raise
