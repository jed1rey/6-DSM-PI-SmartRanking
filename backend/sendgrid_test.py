import os
import sys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

# --- Configuração ---
# Carrega as variáveis do .env (SENDGRID_API_KEY, FROM_EMAIL)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
FROM_EMAIL = os.environ.get("FROM_EMAIL")

# -------------------------------------------------------------------
# ⚠️ IMPORTANTE: MUDE ESTA LINHA ⚠️
# Coloque aqui o seu e-mail pessoal (ex: Gmail) para onde o teste deve ir.
TO_EMAIL = "allison_rps@hotmail.com"
# -------------------------------------------------------------------


def send_test_email():
    """
    Envia um único e-mail para verificar a integração do SendGrid.
    """
    
    # 1. Verifica se as credenciais estão no .env
    if not SENDGRID_API_KEY or not FROM_EMAIL:
        print("❌ ERRO: SENDGRID_API_KEY ou FROM_EMAIL não estão definidos no seu .env!", file=sys.stderr)
        return
        
    if "seu-email-pessoal-de-teste@gmail.com" in TO_EMAIL:
         print("⚠️ AVISO: Por favor, edite a variável 'TO_EMAIL' neste script (linha 20) para o seu e-mail pessoal.", file=sys.stderr)
         return

    print(f"Tentando enviar e-mail de teste de: {FROM_EMAIL}")
    print(f"Para: {TO_EMAIL}...")

    # 2. Cria a mensagem (Conforme o mínimo exigido pelo SendGrid)
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=TO_EMAIL,
        subject='[Smart Ranking] Teste de Integração SendGrid',
        html_content='<strong>Este é o e-mail de teste para verificar a integração do SendGrid.</strong>'
    )

    try:
        # 3. Envia o e-mail
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print("\n--- SUCESSO! ---")
        print(f"✅ E-mail de teste enviado para {TO_EMAIL}!")
        print(f"Status Code: {response.status_code}")
        print("\nAgora você pode clicar em 'Next' no site do SendGrid!")

    except Exception as e:
        print(f"❌ ERRO AO ENVIAR E-MAIL:", file=sys.stderr)
        print(e)
        if hasattr(e, 'body'):
             print(f"Detalhes do erro (SendGrid): {e.body}", file=sys.stderr)

if __name__ == "__main__":
    send_test_email()