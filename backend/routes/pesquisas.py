from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from config import SECRET_KEY
from db import get_connection

pesquisas_bp = Blueprint("pesquisas", __name__)

# Middleware para proteger rotas
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"error": "Token é necessário"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data["id"]
        except:
            return jsonify({"error": "Token inválido ou expirado"}), 401
        return f(user_id, *args, **kwargs)
    return decorated

@pesquisas_bp.route("/pesquisas", methods=["POST"])
@token_required
def criar_pesquisa(user_id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO pesquisas (usuario_id, categoria, genero, preco_opcao, ordenacao)
        VALUES (%s, %s, %s, %s, %s) RETURNING id
    """, (user_id, data["categoria"], data["genero"], data["preco_opcao"], data["ordenacao"]))

    pesquisa_id = cur.fetchone()["id"]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg": "Pesquisa salva", "id": pesquisa_id})

@pesquisas_bp.route("/historico", methods=["GET"])
@token_required
def listar_pesquisas(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM pesquisas WHERE usuario_id = %s ORDER BY criado_em DESC", (user_id,))
    pesquisas = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(pesquisas)
