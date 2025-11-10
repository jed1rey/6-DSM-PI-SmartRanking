-- Script de Criação de Tabelas para o Smart Ranking
-- (Compatível com PostgreSQL)

-- Limpa tabelas antigas (se existirem) para um novo começo.
-- CUIDADO: Isso apaga todos os dados existentes.
DROP TABLE IF EXISTS resultados_pesquisa;
DROP TABLE IF EXISTS pesquisas;
DROP TABLE IF EXISTS usuarios;


-- Tabela 1: Usuários
-- Armazena as informações de login e perfil.
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 2: Pesquisas (Histórico de Filtros)
-- Armazena os 9 filtros exatos que o usuário selecionou para cada pesquisa.
CREATE TABLE IF NOT EXISTS pesquisas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
    
    -- Colunas dos 8 Filtros (Mapeados para os valores numéricos do KNN)
    sentiment NUMERIC(3,1),      -- (ex: 1.0, 0.0, -1.0)
    category VARCHAR(100),       -- (ex: 'ART_AND_DESIGN')
    min_rating SMALLINT,         -- (ex: 1, 2, 3, 4, 5)
    app_type VARCHAR(20),        -- (ex: 'Free', 'Paid')
    app_size SMALLINT,           -- (ex: 1, 2, 3 para Pequeno/Médio/Grande)
    min_installs INTEGER,        -- (ex: 1, 2, 3, 4, 5 para as faixas)
    content_rating SMALLINT,     -- (ex: 1, 2, 3, 4, 5)
    android_version SMALLINT,    -- (ex: 2, 3, 4, 5, 6, 7, 8)
    
    -- Metadados da Pesquisa
    ordenacao VARCHAR(50),       -- (ex: 'Nota_Final')
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 3: Resultados da Pesquisa (Top10 e KNN)
-- Armazena os resultados gerados pela lógica do KNN para uma pesquisa específica.
CREATE TABLE IF NOT EXISTS resultados_pesquisa (
    id SERIAL PRIMARY KEY,
    pesquisa_id INTEGER REFERENCES pesquisas(id) ON DELETE CASCADE NOT NULL,
    
    -- Metadados do App (do df_model_orig)
    app_nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    rating NUMERIC(3,2),
    installs BIGINT,
    preco NUMERIC(10,2) DEFAULT 0.00,
    
    -- Colunas de Classificação
    tipo_resultado VARCHAR(50) NOT NULL, -- 'TOP10_RANKING' ou 'KNN_RECOMENDACAO'
    posicao SMALLINT NOT NULL,           -- (Posição 1-10 ou 1-5)
    nota_final NUMERIC(5,2),             -- Score do Top10 (Pode ser NULL para KNN)
    score_knn NUMERIC(5,4),              -- Score de similaridade (Pode ser NULL para Top10)
    motivo_knn TEXT                      -- (Opcional, pode ser usado no futuro)
);

-- Cria índices para acelerar consultas comuns
CREATE INDEX IF NOT EXISTS idx_pesquisas_usuario_id ON pesquisas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resultados_pesquisa_id ON resultados_pesquisa(pesquisa_id);