from models.usuario_model import create_user, get_user_by_email
from utils.password_helper import hash_password, verify_password
from utils.jwt_helper import gerar_token

def registrar_usuario(nome, data_nascimento, email, senha):
    """
    Cria o hash da senha e insere o novo usuário no banco de dados.
    """
    try:
        senha_hash = hash_password(senha)
        return create_user(nome, data_nascimento, email, senha_hash)
    except Exception as e:
        # Em um cenário real, você verificaria se o erro é por email duplicado.
        print(f"Erro ao registrar usuário: {e}")
        return None

def autenticar_usuario(email, senha):
    """
    Verifica as credenciais e gera um token JWT em caso de sucesso.
    """
    user = get_user_by_email(email)
    
    # Verifica se o usuário existe e se a senha está correta
    if user and verify_password(senha, user.get("senha_hash", "")):
        # Gera o token usando o ID e email do usuário
        token = gerar_token(user["id"], user["email"])
        return token
    return None
