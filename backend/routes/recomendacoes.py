from flask import Blueprint, request, jsonify
from controllers.recomendacao_controller import gerar_recomendacoes
# Importa o decorador de autenticação de outra rota, conforme arquitetura definida
from routes.pesquisas import token_required 

recomendacoes_bp = Blueprint("recomendacoes", __name__)

@recomendacoes_bp.route("/recomendacoes", methods=["POST"])
@token_required # Rota protegida por JWT (apenas usuários logados podem recomendar)
def recomendar_app(usuario_id):
    """
    Recebe 8 filtros detalhados e retorna recomendações de aplicativos via KNN.
    Requer token JWT válido.
    """
    data = request.json
    
    # Extração dos 8 filtros, correspondendo aos campos do JSON
    sentiment = data.get("sentiment")
    category = data.get("category")
    rating = data.get("rating")
    app_type = data.get("type") 
    size = data.get("size")
    installs = data.get("installs")
    content_rating = data.get("content_rating")
    android_version = data.get("android_version")

    # Validação básica de campos
    # Escolhemos campos cruciais para garantir que a consulta KNN faça sentido
    if not all([category, app_type, installs]):
        return jsonify({"error": "Os campos 'category', 'type' e 'installs' são obrigatórios."}), 400

    # Chama o controlador para processar a recomendação
    try:
        # O controlador fará a tradução dos valores de string para o formato numérico do KNN
        recomendacoes = gerar_recomendacoes(
            usuario_id=usuario_id, 
            sentiment=sentiment, 
            category=category, 
            rating=rating, 
            app_type=app_type, 
            size=size, 
            installs=installs, 
            content_rating=content_rating, 
            android_version=android_version
        )
        return jsonify(recomendacoes), 200
        
    except Exception as e:
        print(f"Erro ao processar recomendação: {e}")
        return jsonify({"error": "Falha interna ao gerar recomendações."}), 500