from flask import Blueprint, request, jsonify
from functools import wraps
from controllers.pesquisa_controller import (
    processar_pesquisa, 
    buscar_pesquisas_usuario, 
    buscar_pesquisa_por_id, 
    buscar_historico_por_usuario_id_publico,
    buscar_todas_pesquisas
)
from utils.jwt_helper import decodificar_token 

pesquisas_bp = Blueprint("pesquisas", __name__)

# --- Decorador de Autenticação JWT (MANTIDO para rotas POST) ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 1. Tenta pegar o token do header 'Authorization'
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1] 

        if not token:
            return jsonify({"message": "Token é obrigatório! (Bearer token não encontrado no Authorization header)"}), 401

        # 2. Decodifica e valida o token
        current_user_data = decodificar_token(token)

        if "error" in current_user_data:
            return jsonify({"message": current_user_data["error"]}), 401

        # 3. Passa o user_id para a função da rota
        user_id = current_user_data.get('sub')
        
        return f(*args, **kwargs, usuario_id=user_id)

    return decorated
# --- Fim do Decorador ---


# --- ROTA PROTEGIDA (Criação de Pesquisa) ---

@pesquisas_bp.route("/pesquisas", methods=["POST"])
@token_required
def criar_pesquisa(usuario_id): 
    data = request.json
    
    categoria = data.get("categoria")
    genero = data.get("genero")
    preco_opcao = data.get("preco_opcao")
    ordenacao = data.get("ordenacao", "score_inteligente")
    
    pesquisa_id, top_5 = processar_pesquisa(usuario_id, categoria, genero, preco_opcao, ordenacao)

    if not pesquisa_id:
        return jsonify({"message": "Falha ao processar a pesquisa."}), 500

    return jsonify({
        "message": "Pesquisa criada com sucesso!",
        "pesquisa_id": pesquisa_id,
        "top_5_resultados": top_5
    }), 201


# --- ROTAS PÚBLICAS (Consulta) ---

@pesquisas_bp.route("/pesquisas", methods=["GET"])
def get_all_pesquisas(): 
    """
    Rota PÚBLICA: Retorna TODAS as pesquisas no sistema.
    """
    pesquisas = buscar_todas_pesquisas() 
    return jsonify(pesquisas)


@pesquisas_bp.route("/pesquisas/user/<int:usuario_id>", methods=["GET"])
def get_pesquisas_by_user_id(usuario_id): 
    """
    Rota PÚBLICA: Retorna todas as pesquisas feitas por um usuário,
    identificado pelo ID na URL.
    """
    pesquisas = buscar_historico_por_usuario_id_publico(usuario_id) 
    return jsonify(pesquisas)


@pesquisas_bp.route("/pesquisas/<int:pesquisa_id>", methods=["GET"])
def get_pesquisa_by_id_public(pesquisa_id): 
    """
    Rota PÚBLICA: Retorna uma pesquisa específica por ID.
    """
    pesquisa = buscar_pesquisa_por_id(pesquisa_id) 
    if pesquisa:
        return jsonify(pesquisa)
    
    return jsonify({"message": "Pesquisa não encontrada."}), 404