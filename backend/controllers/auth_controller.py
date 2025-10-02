import sys
from models.usuario_model import create_user, get_user_by_email, get_all_usuarios, get_usuario_by_id
from utils.password_helper import hash_password, verify_password
from utils.jwt_helper import gerar_token

def registrar_usuario(nome, data_nascimento, email, senha):
    """
    Controlador para registrar um novo usuário.
    """
    try:
        senha_hash = hash_password(senha)
        return create_user(nome, data_nascimento, email, senha_hash)
    except Exception as e:
        # Imprime o erro no console (apenas para debug)
        print(f"Erro ao registrar usuário no controller: {e}", file=sys.stderr)
        return None

def autenticar_usuario(email, senha):
    """
    Controlador para autenticar o usuário e retornar um token JWT.
    """
    user = get_user_by_email(email)
    if user and verify_password(senha, user["senha_hash"]):
        token = gerar_token(user["id"], user["email"])
        return token
    return None

def listar_usuarios():
    """
    Controlador para retornar todos os usuários.
    """
    return get_all_usuarios()

def buscar_usuario_por_id(user_id):
    """
    Controlador para retornar um usuário específico por ID.
    """
    return get_usuario_by_id(user_id)