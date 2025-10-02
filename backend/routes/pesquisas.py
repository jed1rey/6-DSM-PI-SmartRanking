from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from config import SECRET_KEY
from controllers.pesquisa_controller import processar_pesquisa
from utils.jwt_helper import decodificar_token # Importa a função de decodificação

pesquisas_bp = Blueprint("pesquisas", __name__)

# --- Decorador de Autenticação JWT ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 1. Tenta pegar o token do header 'Authorization'
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1] # Extrai a string do token

        if not token:
            return jsonify({
                "message": "Token é obrigatório! (Bearer token não encontrado no Authorization header)"
            }), 401

        # 2. Decodifica e valida o token
        current_user_data = decodificar_token(token)

        # Verifica se houve erro na decodificação (expirado, inválido, etc.)
        if "error" in current_user_data:
            return jsonify({
                "message": current_user_data["error"]
            }), 401

        # 3. Passa o user_id para a função da rota
        # O ID do usuário (sub) é extraído do payload do JWT
        user_id = current_user_data.get('sub')
        
        return f(*args, **kwargs, usuario_id=user_id)

    return decorated
# --- Fim do Decorador ---


@pesquisas_bp.route("/pesquisas", methods=["POST"])
@token_required
def criar_pesquisa(usuario_id): # A rota agora recebe o ID do usuário injetado pelo decorador
    data = request.json
    
    # O usuario_id é seguro porque veio do token, não do corpo da requisição
    categoria = data.get("categoria")
    genero = data.get("genero")
    preco_opcao = data.get("preco_opcao")
    ordenacao = data.get("ordenacao", "score_inteligente")
    
    # Chama o controller com o ID do usuário validado
    pesquisa_id, top_5 = processar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao)

    return jsonify({
        "message": "Pesquisa criada com sucesso!",
        "pesquisa_id": pesquisa_id,
        "top_5_resultados": top_5
    }), 201