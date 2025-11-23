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

### 🖥️ **FRONTEND WEB**

SmartRanking – Frontend Web

Aplicação web desenvolvida em **React.js**, responsável pela interface do usuário do sistema **SmartRanking**.


#### 🚀 **Tecnologias Utilizadas**

React.js 19
React Router DOM
Context API (Autenticação e Tema)
JWT Decode
React Icons
Google Fonts – Inter
CSS puro
Consumo de API REST

#### 📂 Arquitetura do Projeto

src/
 ├─ components/
 │   ├─ Header.js
 │   ├─ Footer.js
 │   └─ Layout.js
 │
 ├─ context/
 │   ├─ AuthContext.js
 │   └─ ThemeContext.js
 │
 ├─ hooks/
 │   └─ useBackground.js
 │
 ├─ pages/
 │   ├─ Home.js
 │   ├─ Login.js
 │   ├─ Cadastro.js
 │   ├─ Pesquisa.js
 │   ├─ Ranking.js
 │   └─ Perfil.js
 │
 ├─ services/
 │   └─ api.js
 │
 ├─ App.js
 ├─ index.js
 └─ index.css

#### 🔐 Autenticação

O sistema utiliza JWT:

Armazena token e dados do usuário no localStorage.

O AuthContext gerencia login, cadastro, logout e carregamento automático do usuário.

Rotas protegidas:
/pesquisa, /ranking, /perfil.

#### 🎨 Sistema de Tema (Dark/Light)

Gerenciado pelo ThemeContext, que fornece:

Paleta de cores dinâmica

Função de alternância (toggleTheme)

Estilos globais suaves com transições



#### 🧠 Funcionalidade Principal – Sistema de Pesquisa

A página /pesquisa permite ao usuário montar filtros como:

Sentimento
Categoria
Avaliação mínima
Tipo de app
Tamanho
Número de instalações
Classificação indicativa
Versão mínima do Android
Ao enviar, ocorre:
criação da pesquisa na API
consulta do resultado
Navegação automática para /ranking

#### 👤 Perfil do Usuário / Histórico

A página /perfil exibe:
Dados do usuário logado
Todas as pesquisas realizadas por ele
Detalhes dos filtros aplicados
Opção de abrir o ranking novamente

#### 📦 Como Rodar o Projeto

npm install
npm start

O app rodará em:
👉 http://localhost:3000



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
    - **MENSAGERIA - Fluxo de Boas-vindas:** Quando um usuário se cadastra, o backend publica um evento no GCP. Um **Worker** separado consome essa mensagem e dispara um E-MAIL de BOAS-VINDAS transacional via **SendGrid**, garantindo que a API responda instantaneamente sem latência.

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

#### **SmartRanking — Frontend Mobile (React Native / Expo)**

Aplicativo móvel do SmartRanking: frontend em **React Native (Expo)** que consome a API do SmartRanking para autenticação, criação de pesquisas e exibição de rankings e recomendações.

#### 🌐 Tecnologias

React Native (Expo)
React (19)
Expo (SDK ~54)
React Navigation (bottom-tabs)
Axios
AsyncStorage (@react-native-async-storage/async-storage)
RNPickerSelect (react-native-picker-select)
jwt-decode (implementado manualmente no AuthContext)
Google Fonts (Poppins via @expo-google-fonts/poppins)


#### ⚙️ Estrutura do projeto (resumida)

src/
 ├─ navigation/
 │   └─ AppNavigator.js
 ├─ context/
 │   ├─ AuthContext.js
 │   └─ ThemeContext.js
 ├─ screens/
 │   ├─ Homepage.js
 │   ├─ Login.js
 │   ├─ Cadastro.js
 │   ├─ Pesquisa.js
 │   ├─ Ranking.js
 │   └─ Perfil.js
 ├─ services/
 │   └─ api.js
 App.js 

#### 🚀 Como rodar (desenvolvimento)

1- Instale dependências:

npm install
# ou
yarn

2-Inicie o Expo:

npm start
# ou
expo start

3-Rodar em Android/iOS:

Expo Go no celular (QR code) ou emulador (expo start --android / --ios).

#### 🔌 Configuração / Variáveis

O app usa a URL da API definida em src/context/AuthContext.js e src/services/api.js. Ajuste conforme ambiente (dev / staging / prod). 


#### 🔐 Autenticação

Token JWT salvo em AsyncStorage (@sr:token e @sr:user).

AuthContext implementa: signIn, signUp, signOut, fetchUserById.

JWT é decodificado manualmente para extrair sub (id do usuário) quando necessário. 


#### 🧭 Navegação

AppNavigator usa Bottom Tab Navigator.

Abas públicas: Home, Login, Cadastro.

Abas privadas (após login): Pesquisa, Ranking, Perfil.

Header customizado com logo e cores por rota (definidas em pageColors). 


#### 💾 API / Interceptor

src/services/api.js cria instância axios com baseURL e injeta token automaticamente via interceptor lendo AsyncStorage. 


#### 🔍 Fluxo principal (Pesquisa → Ranking)

Usuário escolhe filtros na tela Pesquisa (sentimento, categoria, rating, tipo, tamanho, installs, content_rating, android_version).

Frontend faz POST em /api/pesquisas com o payload.

Backend retorna pesquisa_id.

Frontend faz GET em /api/resultados/{pesquisa_id} e navega para Ranking com os dados. 


---

### ☁️ **NUVEM**

#### 🖥️ Infraestrutura – Máquina Virtual (Azure)

A aplicação está hospedada em uma **Máquina Virtual (VM) na Microsoft Azure** , com as seguintes configurações:

#### 📌 Configurações da Máquina Virtual

| Categoria                 | Informações               |
| ------------------------- | ------------------------- |
| **Nome do computador**    | FATECDSM                  |
| **Sistema operacional**   | Linux                     |
| **Distribuição / Imagem** | Ubuntu 24.04 LTS (server) |
| **Fornecedor da imagem**  | Canonical                 |
| **Geração da VM**         | V2                        |
| **Arquitetura**           | x64                       |
| **Controlador de disco**  | SCSI                      |
| **Hibernação**            | Desabilitado              |


#### ⚙️ Tamanho da VM
| Recurso         | Valor        |
| --------------- | ------------ |
| **Tamanho**     | Standard B2s |
| **vCPUs**       | 2            |
| **Memória RAM** | 4 GiB        |

#### 🌐 Rede

| Propriedade                | Valor                                      |
| -------------------------- | ------------------------------------------ |
| **Endereço IP público**    | 40.65.223.83                               |
| **IP público → Interface** | fatecdsm329                                |
| **IP privado**             | 10.0.0.4                                   |
| **Virtual Network**        | FATECDSM-vnet/default                      |
| **DNS público**            | smartranking.eastus2.cloudapp.azure.com    |


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



