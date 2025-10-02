import jwt
import datetime
from config import SECRET_KEY
import sys

def _get_secret_key_bytes():
    """Converte e limpa a SECRET_KEY para o formato bytes, garantindo consistência."""
    # Força a SECRET_KEY a ser string para remover espaços invisíveis e depois converte para bytes
    return str(SECRET_KEY).strip().encode('utf-8')

def gerar_token(user_id: int, user_email: str) -> str:
    """
    Gera um JWT (JSON Web Token) contendo o ID e e-mail do usuário.
    O token expira após 24 horas.
    """
    chave_bytes = _get_secret_key_bytes()

    if not chave_bytes:
        raise ValueError("A chave secreta (SECRET_KEY) não está configurada ou é inválida.")

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

    if not chave_bytes:
        return {"error": "Configuração de chave secreta ausente."}
        
    try:
        # Decodifica o token usando a chave em bytes
        return jwt.decode(token, chave_bytes, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expirado. Faça login novamente."}
    except jwt.InvalidSignatureError:
        # Token inválido: Chave incorreta ou token adulterado.
        return {"error": "Token inválido."}
    except jwt.InvalidTokenError:
        return {"error": "Token inválido."}
    except Exception:
        return {"error": "Falha na decodificação do token."}