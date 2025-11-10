from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2 # Importar para capturar exceção de conexão



# Importa os Blueprints
from routes.auth import auth_bp
from routes.pesquisas import pesquisas_bp

# Importa a função de conexão, que deve ler a DATABASE_URL
from db import get_connection 

# Cria a instância da aplicação Flask
app = Flask(__name__)

# Configuração de CORS para permitir requisições de frontend
CORS(app)

# ------------------------------
# Teste de conexão com o banco
# ------------------------------
try:
    conn = get_connection()
    if conn:
        print("✅ Conexão com db smart_ranking realizada com sucesso!")
        conn.close()
except psycopg2.OperationalError as e:
    print("❌ Falha ao conectar no banco (Verifique o .env e o status do DB):", e)
    # Em produção, o Gunicorn tentará novamente.
except Exception as e:
      print("❌ Erro inesperado na conexão com o banco:", e)

# ------------------------------
# Rotas
# ------------------------------
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pesquisas_bp, url_prefix="/api")

@app.route("/")
def home():
    """Rota de saúde da API."""
    return "Backend Smart Ranking! 🚀"

# ------------------------------
# Tratamento de Erros
# ------------------------------
@app.errorhandler(404)
def not_found(error):
    # Retorna o erro em formato JSON (padrão de API)
    return jsonify({"error": "Recurso não encontrado"}), 404

# ------------------------------
# Início da Aplicação
# ------------------------------

# O bloco if __name__ == "__main__": é usado APENAS para testes locais.
# EM PRODUÇÃO NO RENDER, O GUNICORN IMPORTA E EXECUTA DIRETAMENTE A VARIÁVEL 'app'.
# Portanto, a chamada app.run() deve ser removida ou comentada.
#
# Se for rodar localmente, você pode executar o comando: gunicorn app:app

# if __name__ == "__main__":
#     # app.run(debug=True, port=5000)  <-- COMENTADO/REMOVIDO PARA O DEPLOY DO RENDER
#     pass