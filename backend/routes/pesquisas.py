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
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1] 

        if not token:
            return jsonify({"message": "Token é obrigatório! (Bearer token não encontrado no Authorization header)"}), 401

        current_user_data = decodificar_token(token)

        if "error" in current_user_data:
            return jsonify({"message": current_user_data["error"]}), 401

        user_id = current_user_data.get('sub')
        
        return f(*args, **kwargs, usuario_id=user_id)

    return decorated
# --- Fim do Decorador ---


# --- ROTA PROTEGIDA (Criação de Pesquisa - AGORA USA 9 FILTROS) ---

@pesquisas_bp.route("/pesquisas", methods=["POST"])
@token_required
def criar_pesquisa(usuario_id): 
    data = request.json
    
    # 9 filtros para o KNN/DB
    sentiment = data.get("sentiment")
    category = data.get("category")
    rating = data.get("rating")
    app_type = data.get("type") 
    size = data.get("size")
    installs = data.get("installs")
    content_rating = data.get("content_rating")
    android_version = data.get("android_version")
    ordenacao = data.get("ordenacao", "Nota_Final") # Novo critério de ordenação

    # Validação básica de campos
    if not all([category, app_type, installs, sentiment, rating]):
        return jsonify({"error": "Os campos category, type, installs, sentiment e rating são obrigatórios."}), 400

    # Chama o controlador para processar a pesquisa (KNN + Salvar Histórico)
    try:
        pesquisa_id, resultados = processar_pesquisa(
            usuario_id, 
            sentiment, 
            category, 
            rating, 
            app_type, 
            size, 
            installs, 
            content_rating, 
            android_version, 
            ordenacao
        )

        if not pesquisa_id:
            return jsonify({"message": "Falha ao processar a pesquisa."}), 500
            
        return jsonify({
            "message": "Pesquisa e Ranking gerados com sucesso!",
            "pesquisa_id": pesquisa_id,
            "top10_ranking": resultados.get("top10_ranking", []),
            "recomendacoes_knn": resultados.get("recomendacoes_knn", [])
        }), 201
        
    except Exception as e:
        print(f"Erro Crítico ao criar pesquisa: {e}")
        return jsonify({"message": "Erro interno ao salvar dados no histórico."}), 500


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
    Rota PÚBLICA: Retorna todas as pesquisas feitas por um usuário.
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