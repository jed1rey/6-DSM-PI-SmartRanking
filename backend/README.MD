### 🚀 **Como Rodar o BackEnd Localmente**

Siga estes passos para configurar e executar o servidor Python/Flask e o sistema de mensageria na sua máquina.

#### **Pré-requisitos**
- **Python 3.10+** instalado.
- **PostgreSQL** instalado e rodando.
- (Opcional) Conta no **Google Cloud Platform** (Pub/Sub) e **SendGrid** para testar o envio de e-mails da mensageria.

#### **Passo 1: Configuração do Ambiente**

1.  **Acesse a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Crie e ative um ambiente virtual (.venv):**
    ```bash
    # Windows
    python -m venv .venv
    .venv\Scripts\activate

    # Linux/Mac
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

#### **Passo 2: Configuração do Banco de Dados e Variáveis**

1.  Crie um banco de dados no PostgreSQL chamado `smart_ranking`.
2.  Crie um arquivo chamado **`.env`** dentro da pasta `backend/` e preencha com suas credenciais:

    ```env
    # Configuração do Banco de Dados Local
    DB_NAME=smart_ranking
    DB_USER=postgres
    DB_PASS=sua_senha
    DB_HOST=localhost
    DB_PORT=5432
    
    # Segurança
    SECRET_KEY=chave_secreta_para_jwt

    # (Opcional) Configuração de Mensageria e E-mail
    PUB_SUB_PROJECT_ID=seu-projeto-gcp
    PUB_SUB_TOPIC_ID=smart-ranking-registrations
    PUB_SUB_SUBSCRIPTION_ID=sua-subscricao
    GOOGLE_APPLICATION_CREDENTIALS=service-account.json
    SENDGRID_API_KEY=sua_chave_sendgrid
    FROM_EMAIL=seu_email_verificado
    ```

3.  **Arquivos de Modelo:** 

Certifique-se de que os arquivos `.pkl` do modelo de Machine Learning estão na pasta `backend/modelos/` (ou `backend/utils/` conforme configuração).

#### **🔐 Configuração da Service Account (Google Cloud)**

Para que o sistema de mensageria (Pub/Sub) funcione, você precisa de uma chave de autenticação do Google Cloud.

1.  No Console do Google Cloud, vá para **IAM & Admin** > **Service Accounts**.
2.  Crie uma conta de serviço com permissões de `Pub/Sub Editor` e `Pub/Sub Subscriber`.
3.  Crie uma chave JSON para essa conta e faça o download.
4.  Renomeie o arquivo baixado para `service-account.json`.
5.  **Mova este arquivo para a raiz da pasta `backend/`.**
    > ⚠️ **Atenção:** Este arquivo contém credenciais sensíveis. Ele já está configurado no `.gitignore` para não ser enviado ao GitHub. Mantenha-o seguro!

#### **Passo 3: Executando a Aplicação**

O sistema é composto por dois processos principais: a API (Web Service) e o Worker (Processamento em Segundo Plano).

**1. Iniciar a API (Flask):**
Este comando inicia o servidor web, conecta ao banco e carrega os modelos de ML.
```bash
python app.py
```

O servidor estará rodando em: http://127.0.0.1:5000

**2. Iniciar o Worker de E-mails (Opcional):**

Abra um novo terminal e execute este comando para processar a fila de boas-vindas.

```bash
python consumer_worker.py
```

**Passo 4: Documentação e Testes**
Swagger/OpenAPI: O arquivo smart_ranking_openapi.yaml contém a documentação completa. Você pode visualizá-lo em editor.swagger.io.

Testar Rotas: Utilize o Insomnia ou Postman para testar endpoints como POST /auth/login ou POST /api/pesquisas.