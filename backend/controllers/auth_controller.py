import sys
from models.usuario_model import create_user, get_user_by_email, get_all_usuarios, get_usuario_by_id
from utils.password_helper import hash_password, verify_password
from utils.jwt_helper import gerar_token
# NOVO: Importa a nova função de publicação de registro
from utils.pubsub_publisher import publish_registration_message 

def registrar_usuario(nome, data_nascimento, email, senha):
    """
    Controlador para registrar um novo usuário.
    """
    try:
        senha_hash = hash_password(senha)
        # 1. Tenta criar o usuário no banco de dados
        user_id = create_user(nome, data_nascimento, email, senha_hash)
        
        # 2. NOVO: Publica a mensagem de registro se o usuário foi criado
        if user_id:
            try:
                # Dispara a mensagem para o Pub/Sub
                publish_registration_message(user_id, email, nome)
            except Exception as e:
                # Apenas loga o erro, mas permite que o registro continue
                # O usuário foi criado, mas a mensagem falhou.
                print(f"AVISO (Pub/Sub): Falha ao publicar mensagem de REGISTRO para {email}. Erro: {e}", file=sys.stderr)
        
        return user_id
        
    except Exception as e:
        print(f"Erro ao registrar usuário no controller: {e}", file=sys.stderr)
        return None

def autenticar_usuario(email, senha):
    """
    Controlador para autenticar o usuário e retornar um token JWT.
    (Esta função não precisa publicar mensagens, apenas a de registro)
    """
    user = get_user_by_email(email)
    
    if user and verify_password(senha, user["senha_hash"]):
        # 1. Usuário autenticado, gera o token
        token = gerar_token(user["id"], user["email"])
        user_id = user["id"]
            
        # 2. Retorna o token E o ID para o usuário
        return {
            "token": token
        }
        
    return None, None

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