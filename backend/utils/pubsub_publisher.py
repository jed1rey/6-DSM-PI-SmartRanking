import os
import sys
import json
from google.cloud import pubsub_v1
from google.api_core.exceptions import NotFound
import datetime

# --- Configuração (Lida das variáveis de ambiente do .env) ---

# ID do Projeto (serjava-demo)
PROJECT_ID = os.environ.get("PUB_SUB_PROJECT_ID")
# ID do Tópico (smart-ranking-registrations)
TOPIC_ID = os.environ.get("PUB_SUB_TOPIC_ID")

# A autenticação é automática via 'GOOGLE_APPLICATION_CREDENTIALS'

def publish_registration_message(user_id: int, email: str, nome: str):
    """
    Publica uma mensagem no tópico do Pub/Sub quando um novo usuário se registra.
    """
    
    if not PROJECT_ID or not TOPIC_ID:
        print("AVISO (Pub/Sub): PROJECT_ID ou TOPIC_ID não definidos no ambiente. Mensagem não enviada.", file=sys.stderr)
        return

    publisher = None
    try:
        # Inicializa o cliente publicador
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

        # 1. Formata a mensagem
        message_data = {
            "event_type": "USER_REGISTERED", # Define o tipo de evento
            "user_id": user_id,
            "email": email,
            "nome": nome,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        # Converte o dicionário JSON para bytes
        data_bytes = json.dumps(message_data).encode("utf-8")

        # 2. Publica a mensagem
        future = publisher.publish(topic_path, data_bytes)
        message_id = future.result(timeout=60) # Aguarda a confirmação
        
        print(f"✅ (Pub/Sub) Mensagem de REGISTRO publicada com ID: {message_id} (Usuário: {user_id})")

    except NotFound:
        print(f"❌ ERRO (Pub/Sub): Tópico '{TOPIC_ID}' não encontrado em '{PROJECT_ID}'. A mensagem falhou.", file=sys.stderr)
    except Exception as e:
        print(f"❌ ERRO (Pub/Sub): Falha ao publicar mensagem de REGISTRO: {e}", file=sys.stderr)
        # Não lança a exceção para não quebrar o fluxo de registro