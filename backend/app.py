from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.pesquisas import pesquisas_bp
from db import get_connection

app = Flask(__name__)
CORS(app)

# ------------------------------
# Teste de conexão com o banco
# ------------------------------
try:
    conn = get_connection()
    if conn:
        print("✅ Conexão com db smart_ranking realizada com sucesso!")
        conn.close()
except Exception as e:
    print("❌ Falha ao conectar no banco:", e)

# ------------------------------
# Rotas
# ------------------------------
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pesquisas_bp, url_prefix="/api")

@app.route("/")
def home():
    return "Backend Smart Ranking funcionando! 🚀"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
