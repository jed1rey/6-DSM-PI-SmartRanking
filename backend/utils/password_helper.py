from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """
    Gera o hash da senha usando Werkzeug's security (seguro e moderno).
    Isso substitui o bcrypt e elimina o problema de compatibilidade com Python 3.10.
    """
    print(f"DEBUG: Hashing senha de {len(password)} caracteres usando Werkzeug.")
    
    # Werkzeug usa um algoritmo seguro (pbkdf2:sha256 por padrão) e não requer truncamento manual.
    return generate_password_hash(password)

def verify_password(password, hash_value):
    """
    Verifica se a senha fornecida corresponde ao hash do Werkzeug.
    """
    return check_password_hash(hash_value, password)