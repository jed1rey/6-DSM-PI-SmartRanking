import os
import sys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Carrega a API Key e o e-mail remetente das variáveis de ambiente
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
FROM_EMAIL = os.environ.get("FROM_EMAIL")

def send_welcome_email(to_email: str, nome: str):
    """
    Envia um e-mail de boas-vindas usando a API do SendGrid.
    """
    
    # Verifica se as credenciais do SendGrid estão configuradas
    if not SENDGRID_API_KEY or not FROM_EMAIL:
        print("AVISO (E-mail): SENDGRID_API_KEY ou FROM_EMAIL não definidos no .env. E-mail não enviado.", file=sys.stderr)
        return False # Retorna falha

    # Cria a mensagem de e-mail
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=f"Boas-vindas ao Smart Ranking, {nome}!",
        html_content=(
            f"<h1>Olá, {nome}!</h1>"
            "<p>Sua conta no Smart Ranking foi criada com sucesso.</p>"
            "<p>Estamos felizes em ter você conosco!</p>"
            "<br>"
            "<p>Atenciosamente,<br>Equipe Smart Ranking</p>"
        )
    )

    try:
        # Inicializa o cliente SendGrid
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        
        # Envia o e-mail
        response = sg.send(message)
        
        # Verifica se o SendGrid aceitou o e-mail (202 = Aceito)
        if response.status_code == 202:
            print(f"✅ (E-mail) E-mail de boas-vindas enviado para {to_email} (Status: {response.status_code})")
            return True # Retorna sucesso
        else:
            print(f"❌ ERRO (E-mail): SendGrid rejeitou o e-mail. Status: {response.status_code}. Body: {response.body}", file=sys.stderr)
            return False # Retorna falha
        
    except Exception as e:
        print(f"❌ ERRO (E-mail): Falha ao enviar e-mail via SendGrid: {e}", file=sys.stderr)
        return False # Retorna falha