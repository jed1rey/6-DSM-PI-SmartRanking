from flask import Blueprint, request, jsonify
from functools import wraps
from controllers.pesquisa_controller import (
    processar_pesquisa, 
    buscar_todas_pesquisas,
    buscar_historico_por_usuario_id_publico,
    buscar_pesquisa_por_id,
    
    # Controladores de Resultados
    buscar_resultados_por_pesquisa_id,
    buscar_resultados_ultima_pesquisa_usuario,
    buscar_todos_resultados_por_usuario # NOVO: Importa o controlador de TODOS os resultados
)
from utils.jwt_helper import decodificar_token 
import sys

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


# --- ROTA PROTEGIDA (Criação de Pesquisa) ---

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
    ordenacao = data.get("ordenacao", "Nota_Final") 

    if not all([category, app_type, installs, sentiment, rating, size, content_rating, android_version]):
        return jsonify({"error": "Todos os 8 campos de filtro (sentiment, category, rating, type, size, installs, content_rating, android_version) são obrigatórios."}), 400

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
            return jsonify({"message": "Falha ao processar a pesquisa (nenhum resultado encontrado ou erro no DB)."}), 500
            
        return jsonify({
            "message": "Pesquisa e Ranking gerados com sucesso!",
            "pesquisa_id": pesquisa_id,
            "top10_ranking": resultados.get("top10_ranking", []),
            "recomendacoes_knn": resultados.get("recomendacoes_knn", [])
        }), 201
        
    except ValueError as e:
        print(f"Erro de Tradução: {e}", file=sys.stderr)
        return jsonify({"message": f"Erro nos dados de entrada: {e}"}), 400
    except Exception as e:
        print(f"Erro Crítico ao criar pesquisa: {e}", file=sys.stderr)
        return jsonify({"message": f"Erro interno ao processar a pesquisa: {e}"}), 500


# --- ROTAS PÚBLICAS (Consulta de Histórico de Filtros) ---

@pesquisas_bp.route("/pesquisas", methods=["GET"])
def get_all_pesquisas(): 
    """ Rota PÚBLICA: Retorna TODAS as pesquisas (histórico de filtros) no sistema. """
    pesquisas = buscar_todas_pesquisas() 
    return jsonify(pesquisas)


@pesquisas_bp.route("/pesquisas/user/<int:usuario_id>", methods=["GET"])
def get_pesquisas_by_user_id(usuario_id): 
    """ Rota PÚBLICA: Retorna todas as pesquisas (filtros) feitas por um usuário. """
    pesquisas = buscar_historico_por_usuario_id_publico(usuario_id) 
    return jsonify(pesquisas)


@pesquisas_bp.route("/pesquisas/<int:pesquisa_id>", methods=["GET"])
def get_pesquisa_by_id_public(pesquisa_id): 
    """ Rota PÚBLICA: Retorna uma pesquisa específica (filtros) por ID. """
    pesquisa = buscar_pesquisa_por_id(pesquisa_id) 
    if pesquisa:
        return jsonify(pesquisa)
    return jsonify({"message": "Pesquisa não encontrada."}), 404


# --- ROTAS PÚBLICAS (Consulta de Resultados - Top10/KNN) ---

@pesquisas_bp.route("/resultados/<int:pesquisa_id>", methods=["GET"])
def get_resultados_por_id(pesquisa_id):
    """ Rota PÚBLICA: Retorna os resultados (Top10/KNN) de uma pesquisa_id. """
    resultados = buscar_resultados_por_pesquisa_id(pesquisa_id)
    if resultados:
        return jsonify(resultados)
    return jsonify({"message": "Resultados não encontrados para esta pesquisa."}), 404

@pesquisas_bp.route("/resultados/user/<int:usuario_id>/latest", methods=["GET"])
def get_resultados_latest_user(usuario_id):
    """ Rota PÚBLICA: Retorna os resultados da última pesquisa de um usuário. """
    resposta = buscar_resultados_ultima_pesquisa_usuario(usuario_id)
    if isinstance(resposta, tuple) and len(resposta) == 2: # Tratamento de erro 404
            return jsonify(resposta[0]), resposta[1]
    return jsonify(resposta), 200

@pesquisas_bp.route("/resultados/user/<int:usuario_id>", methods=["GET"])
def get_todos_resultados_por_usuario_id(usuario_id):
    """
    NOVO: Rota PÚBLICA: Retorna TODOS os resultados (Top10/KNN) de TODAS
    as pesquisas feitas por um usuário_id.
    """
    resultados = buscar_todos_resultados_por_usuario(usuario_id)
    if resultados:
        return jsonify(resultados)
    return jsonify({"message": "Nenhum resultado encontrado para este usuário."}), 404