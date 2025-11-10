import os
import joblib
from flask import Flask, jsonify
from flask_cors import CORS
from db import get_connection, create_tables 
import sys # Para logs de erro

# Importação dos Blueprints de Rotas
from routes.auth import auth_bp
from routes.pesquisas import pesquisas_bp
from routes.recomendacoes import recomendacoes_bp
from utils.knn_processor import inicializar_modelos # Importa a função de injeção

# --- LÓGICA DE CARREGAMENTO DE MODELOS (MOVIDA PARA AQUI) ---

def carregar_modelos_knn():
    """ Tenta carregar os modelos PKL e retorna os objetos. """
    
    # Caminho base: assume que a pasta 'modelos' está na raiz do backend
    MODEL_DIR = os.path.join(os.getcwd(), "modelos") 
    
    # Se você moveu para 'utils' e está rodando de 'backend':
    # MODEL_DIR = os.path.join(os.getcwd(), "utils")

    try:
        if not os.path.isdir(MODEL_DIR):
            print(f"❌ Erro: Diretório de modelos não encontrado. Caminho: {MODEL_DIR}", file=sys.stderr)
            raise FileNotFoundError("Pasta de modelos não encontrada.")

        df_model = joblib.load(os.path.join(MODEL_DIR, "df_model_final.pkl"))
        df_model_orig = joblib.load(os.path.join(MODEL_DIR, "df_model_orig.pkl"))
        X_knn_df = joblib.load(os.path.join(MODEL_DIR, "X_knn_df.pkl"))
        knn_model = joblib.load(os.path.join(MODEL_DIR, "knn_model.pkl"))

        print("✅ Modelos KNN carregados com sucesso!")
        return df_model, df_model_orig, X_knn_df, knn_model
        
    except Exception as e:
        print(f"❌ Erro Crítico ao carregar modelos do joblib: {e}", file=sys.stderr)
        # Retorna None para indicar falha
        return None, None, None, None


# --- Configuração Básica do App ---
app = Flask(__name__)

# Configurações de segurança e ambiente (Mantido)
if os.environ.get("SECRET_KEY"):
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
else:
    app.config["SECRET_KEY"] = "super-secret-default-key" 

# --- CARREGA E INJETA MODELOS AO INICIAR O APP ---
df_model, df_model_orig, X_knn_df, knn_model = carregar_modelos_knn()

if df_model is not None:
    # Apenas inicializa o utilitário se os modelos carregarem
    inicializar_modelos(df_model, df_model_orig, X_knn_df, knn_model)
else:
    print("⚠️ AVISO: Funcionalidades de Recomendação e Pesquisa NÃO estarão operacionais.", file=sys.stderr)


# Cria as tabelas ao iniciar o app (opcional)
try:
    with app.app_context():
        # Assumindo que create_tables() é a função para garantir o schema
        create_tables() 
except Exception as e:
    print(f"❌ Falha ao conectar no banco para criar tabelas: {e}", file=sys.stderr)


# --- Configuração do CORS e Registro de Rotas ---

# Usa a configuração mais simples para o Flask
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/auth/*": {"origins": "*"}}, supports_credentials=True)


app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pesquisas_bp, url_prefix="/api")
app.register_blueprint(recomendacoes_bp, url_prefix="/api")


# --- Rota de Teste de Status ---
@app.route("/")
def home():
    return jsonify({"message": "API Smart Ranking está Online!"}), 200


# --- Inicialização ---
if __name__ == "__main__":
    app.run(debug=True)