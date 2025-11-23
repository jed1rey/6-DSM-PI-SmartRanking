import os
import sys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

# --- Configuração de Caminho ---
# Pega o diretório atual (backend/utils)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Sobe um nível para pegar a pasta 'backend' onde está o .env
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
load_dotenv(os.path.join(BACKEND_DIR, ".env"))


def _criar_html_de_boas_vindas(nome: str) -> str:
    """
    Gera o template HTML para o e-mail de boas-vindas.
    """
    
    # URL do Logo (Use um link público real para produção)
    LOGO_URL = "https://github.com/allisonrps/6-DSM-PI-SmartRanking/blob/main/imagens/logo.png?raw=true"

    # CSS Inline
    style_body = "margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7f6;"
    style_container = "width: 90%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"
    style_header = "background-color: #0a2540; padding: 40px; text-align: center;"
    style_logo = "width: 180px; height: auto;"
    style_content = "padding: 40px; text-align: center; line-height: 1.6em; color: #333;"
    style_h1 = "color: #0a2540; margin-top: 0; margin-bottom: 20px;"
    style_p = "margin-bottom: 20px;"
    style_footer = "padding-top: 20px; font-style: italic; color: #888; font-size: 0.9em;"
    
    html = f"""
    <body style="{style_body}">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
        <tr>
          <td align="center">
            <div style="{style_container}">
              <div style="{style_header}">
                <img src="{LOGO_URL}" alt="Smart Ranking Logo" style="{style_logo}">
              </div>
              <div style="{style_content}">
                <h1 style="{style_h1}">Boas-vindas, {nome}!</h1>
                <p style="{style_p}">Sua conta no <b>Smart Ranking</b> foi criada com sucesso.</p>
                <p style="{style_p}">Estamos muito felizes em ter você conosco!</p>
                <div style="{style_footer}">
                  <p>Atenciosamente,<br>Equipe Smart Ranking</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    """
    return html


def send_welcome_email(to_email: str, nome: str):
    """
    Envia um e-mail de boas-vindas usando a API do SendGrid com um template HTML.
    """
    
    # CORREÇÃO: Lê as variáveis AGORA (no momento do envio), não no início do arquivo.
    # Isso garante que o load_dotenv do consumer_worker.py já tenha rodado.
    api_key = os.environ.get("SENDGRID_API_KEY")
    from_email = os.environ.get("FROM_EMAIL")
    
    if not api_key or not from_email:
        print("AVISO (E-mail): SENDGRID_API_KEY ou FROM_EMAIL não definidos no .env. E-mail não enviado.", file=sys.stderr)
        # Tenta recarregar o .env explicitamente como fallback
        load_dotenv(os.path.join(BACKEND_DIR, ".env"))
        api_key = os.environ.get("SENDGRID_API_KEY")
        from_email = os.environ.get("FROM_EMAIL")
        if not api_key or not from_email:
             return False

    # Gera o HTML
    html_body = _criar_html_de_boas_vindas(nome)

    # Cria a mensagem
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=f"Boas-vindas ao Smart Ranking, {nome}!",
        html_content=html_body
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        
        if response.status_code == 202:
            print(f"✅ (E-mail) E-mail de boas-vindas enviado para {to_email} (Status: {response.status_code})")
            return True
        else:
            print(f"❌ ERRO (E-mail): SendGrid rejeitou o e-mail. Status: {response.status_code}. Body: {response.body}", file=sys.stderr)
            return False
        
    except Exception as e:
        print(f"❌ ERRO (E-mail): Falha ao enviar e-mail via SendGrid: {e}", file=sys.stderr)
        return False