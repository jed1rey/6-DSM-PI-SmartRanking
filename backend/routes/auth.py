from flask import Blueprint, request, jsonify
from controllers.auth_controller import registrar_usuario, autenticar_usuario

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Rota para registro de novo usuário.
    """
    data = request.json
    
    # Validação básica de campos
    if not all(data.get(k) for k in ("nome", "data_nascimento", "email", "senha")):
        return jsonify({"error": "Dados de registro incompletos. Todos os campos são obrigatórios."}), 400

    user_id = registrar_usuario(data["nome"], data["data_nascimento"], data["email"], data["senha"])
    
    if user_id:
        return jsonify({"message": "Usuário registrado com sucesso!", "user_id": user_id}), 201
    
    # Retorno genérico em caso de falha (pode ser email já em uso ou erro no DB)
    return jsonify({"error": "Falha ao registrar usuário. Tente novamente ou verifique o email."}), 409

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Rota para login. Retorna um token JWT em caso de sucesso.
    """
    data = request.json
    
    if not all(data.get(k) for k in ("email", "senha")):
        return jsonify({"error": "Email e senha são obrigatórios."}), 400

    token = autenticar_usuario(data["email"], data["senha"])
    
    if token:
        return jsonify({"token": token})
    return jsonify({"error": "Credenciais inválidas"}), 401
