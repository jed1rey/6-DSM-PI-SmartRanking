import os
import time
import json
import sys
from google.cloud import pubsub_v1
from dotenv import load_dotenv

# NOVO: Importa a função de envio de e-mail
from utils.email_sender import send_welcome_email

# --- Configuração (Lida das variáveis de ambiente) ---

# Carrega o .env para que este script (rodado separadamente) 
# também tenha acesso às variáveis de ambiente.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Credenciais do GCP (do .env do professor)
PROJECT_ID = os.environ.get("PUB_SUB_PROJECT_ID")
SUBSCRIPTION_ID = os.environ.get("PUB_SUB_SUBSCRIPTION_ID")


def processar_mensagem(message: pubsub_v1.types.ReceivedMessage):
    """
    Função callback executada para CADA mensagem recebida.
    """
    data_str = ""
    try:
        # 1. Decodifica a mensagem de bytes para JSON
        data_str = message.data.decode("utf-8")
        data_json = json.loads(data_str)
        event_type = data_json.get('event_type')
        
        print(f"\n--- 📩 Mensagem Recebida (ID: {message.message_id}) ---")
        print(f"  Evento: {event_type}")

        # --- LÓGICA DE ROTEAMENTO DE EVENTOS ---
        
        if event_type == "USER_REGISTERED":
            user_id = data_json.get('user_id')
            email = data_json.get('email')
            nome = data_json.get('nome')
            
            print(f"  Usuário ID: {user_id}")
            print(f"  Email: {email}")
            print(f"  Nome: {nome}")
            
            # --- LÓGICA DE NEGÓCIOS (E-MAIL REAL) ---
            print(f"  AÇÃO: Preparando e-mail de boas-vindas para {email}...")
            
            # 2. Chama o utilitário de envio de e-mail
            sucesso = send_welcome_email(email, nome)
            
            if sucesso:
                # 3. Confirma o recebimento (ACK) para remover a mensagem da fila.
                message.ack()
                print(f"  Status: Mensagem confirmada (ACK).")
            else:
                # 4. Não confirma (NACK) se o envio do e-mail falhar.
                print(f"  Status: Envio de e-mail falhou. Mensagem não confirmada (NACK).")
                message.nack()

        else:
            print(f"  AVISO: Evento desconhecido '{event_type}'. Mensagem será ignorada (ACK).")
            message.ack() # Confirma mesmo assim para não travar a fila
        
    except json.JSONDecodeError:
        print(f"❌ Erro: Mensagem não é um JSON válido. Conteúdo: {data_str}", file=sys.stderr)
        message.ack() # Remove da fila
    except Exception as e:
        print(f"❌ Erro inesperado ao processar mensagem {message.message_id}: {e}", file=sys.stderr)
        message.nack() # Tenta reprocessar mais tarde

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

        print(f"🎧 Ouvindo mensagens na subscrição: {subscription_path} ...")
        
        # Abre a subscrição e passa a função de callback
        streaming_pull_future = subscriber.subscribe(
            subscription_path, 
            callback=processar_mensagem
        )

        # Mantém o script rodando indefinidamente para "ouvir"
        print("Pressione CTRL+C para parar o consumidor.")
        while True:
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n⏹️ Parando o consumidor...")
    except Exception as e:
        print(f"❌ Erro fatal no consumidor (ex: credenciais): {e}", file=sys.stderr)
    finally:
        if streaming_pull_future:
            streaming_pull_future.cancel() # Para de "ouvir"
        if subscriber:
            subscriber.close()

if __name__ == "__main__":
    iniciar_consumidor()