<p align="center">
  <img src="imagens/logo.png" alt="Logo Smart Ranking" width="700"/><br/>
</p>



##  Sistema inteligente de ranking e recomendação de aplicativos da Google Play Store

O **Smart Ranking** é uma aplicação que permite que usuários **explorem e ranqueiem aplicativos** da Google Play Store com base em critérios inteligentes e personalizados.  
Por meio de **mineração de dados** e **aprendizado de máquina**, o sistema fornece **recomendações automáticas** e **insights analíticos** sobre categorias, gêneros, preços e qualidade dos apps.  

Esse projeto tem como objetivo auxiliar **usuários finais** a descobrirem **aplicativos de alta qualidade**. 

---

## ⚙️ **TECNOLOGIAS UTILIZADAS**

- **Frontend:** *React JS*
- **Backend:** *Python Flask / PostgreSQL / Werkzeug / JWT / Psycog2 / SendGrid*
- **Mobile:** *React Native*
- **Machine Learning:** *Scikit-Learn / Pandas / NumPy*  
- **Nuvem:** *Google Cloud PubSub / Microsoft Azure VM*  
- **Versionamento:** *Git & GitHub*  

---

## 👩‍💻 **DESENVOLVEDORES**

- **Paula Cristina Abib Teixeira** – *FrontEnd / Machine Learning / Documentação*  
  🔗 [Github: jed1rey](https://github.com/jed1rey)
  
- **Allison Rodrigues de Paula e Silva** – *BackEnd / Arquitetura em Nuvem / Documentação*  
  🔗 [Github: allisonrps](https://github.com/allisonrps)
  
- **Samir Lopes Rosa** – *FrontEnd Web e Mobile / Arquitetura em Nuvem*  
  🔗 [Github: samlope](https://github.com/samlope)

---

## 📘 **DOCUMENTAÇÃO**

### Objetivo do Projeto

O **Smart Ranking** é um sistema que permite que usuários explorem e ranqueiem apps da Google Play Store com base em critérios inteligentes, e recebam recomendações com base na mineração de dados a partir do ranking gerado.

Ele oferece insights sobre categorias, gêneros, preços e **qualidade de apps**, ajudando tanto **desenvolvedores** a escolherem nichos de mercado quanto **usuários finais** a descobrirem **apps de alta qualidade**.

[📘 Clique aqui para saber mais sobre a documentação completa](https://www.notion.so/PI-Smart-Ranking-273aff3cd6f08010a54ee6e3a059dd61?showMoveTo=true&saveParent=true)

---

## 🧩 **ARQUITETURA DO PROJETO**

O sistema é dividido em cinco grandes módulos que se integram entre si:

### 🖥️ **FrontEnd**


---

### ⚙️ **BACKEND**

A camada de **BackEnd** é o núcleo de processamento do Smart Ranking. Desenvolvida em **Python** com o framework **Flask**, ela expõe uma **API RESTful** robusta que orquestra a comunicação entre o FrontEnd, o Banco de Dados e os modelos de Machine Learning.

O backend foi projetado seguindo uma **Arquitetura em Camadas** (Routes, Controllers, Models, Utils) para garantir escalabilidade, segurança e manutenção limpa.

#### 🧩 **Principais Funcionalidades e Arquitetura**

1.  **API RESTful & Documentação**
    - Endpoints organizados para autenticação, gestão de usuários e execução e armazenamento de pesquisas realizadas.
    - Documentação completa da API via **OpenAPI (Swagger)**, facilitando a integração com o FrontEnd e Mobile.
    - [📘 Smart Ranking Swagger Open API](https://app.swaggerhub.com/apis/ALLISONRPS/Smart-Ranking/1.0.0)

2.  **Autenticação e Segurança**
    - Implementação de **JWT (JSON Web Tokens)** para proteção de rotas e gestão de sessões de usuários.
    - Hashing seguro de senhas utilizando a biblioteca `Werkzeug`.

3.  **Integração com Machine Learning**
    - O backend carrega os modelos treinados (`.pkl`) diretamente na memória.
    - Processa as requisições do usuário em tempo real, traduzindo filtros textuais em vetores numéricos e executando o algoritmo **KNN (K-Nearest Neighbors)** para gerar o ranking Top 10 e recomendações personalizadas.

4.  **Arquitetura Orientada a Eventos (Microsserviços)**
    - Utilização do **Google Cloud Pub/Sub** para desacoplar processos.
    - **Fluxo de Boas-vindas:** Quando um usuário se cadastra, o backend publica um evento no GCP. Um **Worker** separado consome essa mensagem e dispara um e-mail transacional via **SendGrid**, garantindo que a API responda instantaneamente sem latência.

5.  **Persistência de Dados**
    - Conexão com banco de dados **PostgreSQL**.
    - Armazenamento histórico de todas as pesquisas realizadas (filtros utilizados) e dos resultados gerados (rankings), permitindo análises futuras de comportamento do usuário.

#### 🧰 **Tecnologias e Bibliotecas Utilizadas**

- **Python & Flask:** Framework principal da aplicação.
- **PostgreSQL & Psycopg2:** Banco de dados relacional e driver de conexão.
- **Pandas & Scikit-Learn:** Para manipulação de dados e execução dos modelos de ML dentro da API.
- **Google Cloud Pub/Sub:** Sistema de mensageria para arquitetura assíncrona.
- **SendGrid:** Serviço de envio de e-mails transacionais.
- **Gunicorn:** Servidor WSGI para produção (deploy no Render).


---

### 📱 **MOBILE**


---

### ☁️ **NUVEM**


---

### 🤖 **MACHINE LEARNING e DATA MINING**

A camada de **Machine Learning** do **Smart Ranking** é responsável por analisar e processar dados da **Google Play Store** e suas respectivas avaliações de usuários, gerando métricas inteligentes e recomendações personalizadas de aplicativos.  

Essa parte do projeto foi desenvolvida em **Python**, utilizando ferramentas de **ciência de dados**, **mineração de informação** e **aprendizado de máquina**, integrando o resultado com as demais camadas do sistema (FrontEnd, BackEnd e Nuvem).

---

#### 🧩 **Etapas do Pipeline de Machine Learning**

1. **Coleta e Integração de Dados**  
   - Os dados utilizados foram obtidos a partir da base pública do **Kaggle**: [Google Play Store Apps Dataset](https://www.kaggle.com/datasets/lava18/google-play-store-apps).  
   - Os arquivos `googleplaystore.csv` e `googleplaystore_user_reviews.csv` foram combinados com base na coluna `App`, unificando informações de **metadados dos aplicativos** (nome, categoria, tamanho, instalações, preço, etc.) com **avaliações e sentimentos de usuários**.

2. **Pré-processamento e Limpeza de Dados**  
   - Padronização e conversão de unidades de tamanho (`Size` → `MB`);  
   - Normalização de colunas como **Installs**, **Content Rating**, **Android Version** e **Rating**;  
   - Substituição e tratamento de valores ausentes usando média (numéricos) e moda (categóricos);  
   - Mapeamento dos sentimentos em escala numérica:  
     - `Positive → 1`, `Neutral → 0`, `Negative → -1`;  
   - Exclusão de colunas irrelevantes ou redundantes para o modelo de análise.

3. **Engenharia de Atributos**  
   - Criação de colunas derivadas como:
     - `Size_Category_Num` — categoriza o tamanho dos apps (leve, médio, pesado).  
     - `Installs_Category_Num` — classifica apps de acordo com sua popularidade.  
     - `Content_Rating_Num` — converte faixas etárias em valores numéricos.  
     - `Android_Version_Num` — extrai e normaliza versões do sistema operacional.  

4. **Redução de Dimensionalidade (PCA)**  
   - Aplicação do **PCA (Principal Component Analysis)** para reduzir a dimensionalidade dos dados e facilitar a visualização dos clusters de apps com características semelhantes.  

5. **Clusterização (K-Means)**  
   - Utilização do algoritmo **K-Means** para agrupar aplicativos com padrões similares de qualidade, popularidade e sentimento, formando grupos de recomendação e insights de mercado.  

6. **Recomendações Inteligentes (Nearest Neighbors)**  
   - Implementação de um modelo de **recomendação baseada em similaridade** usando `NearestNeighbors`, que sugere apps semelhantes de acordo com perfis de atributos e comportamento dos usuários.  

7. **Visualização de Dados (EDA)**  
   - Análise exploratória dos dados com `matplotlib` e `seaborn`, permitindo identificar relações entre **rating, tamanho, popularidade e sentimento dos usuários**.

---

#### 🧰 **Tecnologias e Bibliotecas Utilizadas**

- **Python 3.x** — linguagem principal do módulo  
- **Pandas** — manipulação e limpeza de dados  
- **NumPy** — operações matemáticas e vetorização  
- **Matplotlib / Seaborn** — visualização e análise gráfica  
- **Scikit-Learn (sklearn)** — modelagem, PCA, K-Means e Nearest Neighbors  
- **Regex (re)** — extração e padronização de versões do Android  
- **Google Colab + Google Drive** — ambiente de execução e armazenamento dos datasets  

---



