import os
import joblib
import sys
import psycopg2 # Para capturar exceção de conexão
from flask import Flask, jsonify
from flask_cors import CORS

# --- Importações de Lógica do Projeto ---
from db import get_connection, create_tables 
from routes.auth import auth_bp
from routes.pesquisas import pesquisas_bp
from routes.recomendacoes import recomendacoes_bp
from utils.knn_processor import inicializar_modelos # Importa a função de injeção

# --- LÓGICA DE CARREGAMENTO DE MODELOS (Global) ---
def carregar_modelos_knn():
    """ 
    Tenta carregar os modelos PKL e retorna os objetos.
    Esta função é executada UMA VEZ quando o Gunicorn inicia o app.
    """
    
    # Caminho base: assume que a pasta 'modelos' está na raiz do backend
    # Usamos os.getcwd() pois o Gunicorn é executado da raiz do 'backend'
    MODEL_DIR = os.path.join(os.getcwd(), "modelos") 
    
    # Se você moveu os PKLs para 'utils'
    # MODEL_DIR = os.path.join(os.getcwd(), "utils")

    try:
        if not os.path.isdir(MODEL_DIR):
            print(f"❌ Erro: Diretório de modelos não encontrado. Caminho: {MODEL_DIR}", file=sys.stderr)
            raise FileNotFoundError(f"Pasta de modelos não encontrada em: {MODEL_DIR}")

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

# Configuração de CORS (Permitindo todas as origens)
CORS(app)

# Configurações de segurança (lendo do ambiente do Render)
if os.environ.get("SECRET_KEY"):
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
else:
    print("AVISO: SECRET_KEY não definida! O JWT não funcionará corretamente.", file=sys.stderr)
    # Fallback caso a variável de ambiente não esteja definida no Render
    app.config["SECRET_KEY"] = "super-secret-key-para-fallback" 

# --- Inicialização de Serviços (Executado na Carga do Gunicorn) ---

# 1. Carrega e Injeta Modelos KNN
df_model, df_model_orig, X_knn_df, knn_model = carregar_modelos_knn()
if df_model is not None:
    # Apenas inicializa o utilitário se os modelos carregarem
    inicializar_modelos(df_model, df_model_orig, X_knn_df, knn_model)
else:
    print("⚠️ AVISO: Funcionalidades de Recomendação e Pesquisa NÃO estarão operacionais.", file=sys.stderr)


# 2. Cria as tabelas ao iniciar o app (O Render executa isso na inicialização)
try:
    with app.app_context():
        # Garante que o schema do DB esteja correto
        create_tables() 
except psycopg2.OperationalError as e:
     print(f"❌ Falha ao conectar no banco (Verifique o .env/DATABASE_URL e o status do DB): {e}", file=sys.stderr)
except Exception as e:
    print(f"❌ Erro inesperado ao criar tabelas: {e}", file=sys.stderr)


# --- Registro dos Blueprints de Rotas ---
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pesquisas_bp, url_prefix="/api")
app.register_blueprint(recomendacoes_bp, url_prefix="/api") # Rota de recomendação adicionada


# --- Rotas de Saúde e Erros ---
@app.route("/")
def home():
    """Rota de saúde da API."""
    return jsonify({"message": "API Smart Ranking está Online!"}), 200

@app.errorhandler(404)
def not_found(error):
    # Retorna o erro em formato JSON (padrão de API)
    return jsonify({"error": "Recurso não encontrado"}), 404

# NOTA: O bloco if __name__ == "__main__": é removido
# O Gunicorn (usado pelo Render) importa a variável 'app' diretamente.