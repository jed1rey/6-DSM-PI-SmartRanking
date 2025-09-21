from flask import Blueprint, request, jsonify
from models import create_user, get_user_by_email
from passlib.hash import bcrypt
import jwt, datetime
from config import SECRET_KEY

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        user_id = create_user(data["nome"], data["data_nascimento"], data["email"], data["senha"])
        return jsonify({"msg": "Usuário criado com sucesso", "id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = get_user_by_email(data["email"])
    if user and bcrypt.verify(data["senha"], user["senha_hash"]):
        payload = {
            "id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Credenciais inválidas"}), 401
