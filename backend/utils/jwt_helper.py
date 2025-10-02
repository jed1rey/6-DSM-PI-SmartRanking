import jwt
import datetime
from config import SECRET_KEY
import sys

# Define a chave secreta como uma constante em bytes, eliminando a inconsistência do .env
CHAVE_SECRETA_FIXA = b'1234' 

def _get_secret_key_bytes():
    """Retorna a chave secreta fixa em formato bytes."""
    return CHAVE_SECRETA_FIXA

def gerar_token(user_id: int, user_email: str) -> str:
    """
    Gera um JWT (JSON Web Token) contendo o ID e e-mail do usuário.
    """
    chave_bytes = _get_secret_key_bytes()

    # DEBUG: Mostra a chave usada para assinar
    print(f"DEBUG JWT: Chave usada na ASSINATURA (Login): {chave_bytes!r}", file=sys.stderr)

    try:
        # Define o payload do token
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id, 
            'email': user_email
        }
        # Codifica o token usando a chave em bytes
        return jwt.encode(payload, chave_bytes, algorithm='HS256')
    except Exception as e:
        print(f"Erro ao gerar token: {e}")
        return None

def decodificar_token(token: str) -> dict:
    """
    Decodifica o token JWT e retorna o payload, ou um dicionário de erro em caso de falha.
    """
    chave_bytes = _get_secret_key_bytes()
    
    # DEBUG: Mostra a chave usada para verificar
    print(f"DEBUG JWT: Chave usada na VERIFICAÇÃO (Pesquisa): {chave_bytes!r}", file=sys.stderr)

    try:
        # Decodifica o token usando a chave em bytes
        return jwt.decode(token, chave_bytes, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expirado. Faça login novamente."}
    except jwt.InvalidSignatureError:
        # Token inválido: A chave não bateu
        return {"error": "Token inválido."}
    except jwt.InvalidTokenError:
        return {"error": "Token inválido."}
    except Exception:
        return {"error": "Falha na decodificação do token."}