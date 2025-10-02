from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.pesquisas import pesquisas_bp
from db import get_connection
import psycopg2 # Importar para capturar exceção de conexão

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
    # Se a conexão falhar, o aplicativo deve continuar, mas as rotas DB-dependentes falharão.
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
    return "Backend Smart Ranking funcionando! 🚀"

# ------------------------------
# Tratamento de Erros
# ------------------------------
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Recurso não encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)