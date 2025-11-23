import os
import time
import json
import sys
from google.cloud import pubsub_v1
from dotenv import load_dotenv

# NOVO: Importa a função de envio de e-mail
from utils.email_sender import send_welcome_email

# --- Configuração (Lida das variáveis de ambiente) ---

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

PROJECT_ID = os.environ.get("PUB_SUB_PROJECT_ID")
SUBSCRIPTION_ID = os.environ.get("PUB_SUB_SUBSCRIPTION_ID")


def processar_mensagem(message: pubsub_v1.types.ReceivedMessage):
    """
    Função callback executada para CADA mensagem recebida.
    """
    data_str = ""
    try:
        data_str = message.data.decode("utf-8")
        data_json = json.loads(data_str)
        event_type = data_json.get('event_type')
        
        # --- LOGGING LIMPO (Uma linha por evento) ---
        print(f"📩 Recebido Evento: {event_type} (ID: {message.message_id})", end="... ")

        # --- LÓGICA DE ROTEAMENTO DE EVENTOS ---
        
        if event_type == "USER_REGISTERED":
            email = data_json.get('email')
            nome = data_json.get('nome')
            
            # --- LÓGICA DE NEGÓCIOS (E-MAIL REAL) ---
            sucesso = send_welcome_email(email, nome)
            
            if sucesso:
                message.ack()
                print(f"✅ E-mail enviado para {email}. (ACK)")
            else:
                message.nack()
                print(f"❌ Falha no SendGrid. (NACK)")

        else:
            print(f"AVISO: Evento desconhecido. (ACK)")
            message.ack()
        
    except json.JSONDecodeError:
        print(f"❌ Erro: Mensagem não é JSON. (ACK)", file=sys.stderr)
        message.ack()
    except Exception as e:
        print(f"❌ Erro Inesperado: {e}. (NACK)", file=sys.stderr)
        message.nack()

def iniciar_consumidor():
    """
    Inicia o "ouvinte" (subscriber) e o mantém ativo.
    """
    if not PROJECT_ID or not SUBSCRIPTION_ID:
        print("❌ ERRO: PUB_SUB_PROJECT_ID ou PUB_SUB_SUBSCRIPTION_ID não definidos no .env.", file=sys.stderr)
        return

    subscriber = None
    streaming_pull_future = None
    try:
        subscriber = pubsub_v1.SubscriberClient()
        subscription_path = subscriber.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)

        # --- NOVO: CONTROLO DE FLUXO (FlowControl) ---
        # Define o worker para processar apenas 1 mensagem de cada vez (síncrono)
        flow_control = pubsub_v1.types.FlowControl(max_messages=1)
        
        print(f"🎧 Ouvindo mensagens na subscrição: {subscription_path} ... (Modo Síncrono: 1 por vez)")
        
        # Abre a subscrição e passa a função de callback
        streaming_pull_future = subscriber.subscribe(
            subscription_path, 
            callback=processar_mensagem,
            flow_control=flow_control # <-- Aplica o controlo de fluxo
        )

        print("Pressione CTRL+C para parar o consumidor.")
        while True:
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n⏹️ Parando o consumidor...")
    except Exception as e:
        print(f"❌ Erro fatal no consumidor (ex: credenciais): {e}", file=sys.stderr)
    finally:
        if streaming_pull_future:
            streaming_pull_future.cancel()
        if subscriber:
            subscriber.close()

if __name__ == "__main__":
    iniciar_consumidor()