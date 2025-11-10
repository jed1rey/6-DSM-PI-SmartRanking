import psycopg2
from psycopg2.extras import RealDictCursor
from config import DB_CONFIG
import sys

def get_connection():
    """
    Cria e retorna uma conexão com o banco de dados PostgreSQL.
    """
    try:
        # Tenta conectar usando as configurações de config.py
        return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    except psycopg2.OperationalError as e:
        print(f"❌ Falha de Conexão com o Banco de Dados: {e}", file=sys.stderr)
        # Em caso de falha crítica, lança a exceção para o Flask interromper.
        raise

def create_tables():
    """
    Cria as tabelas necessárias se elas não existirem.
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # DDLs para criar as tabelas
        # NOTA: O schema deve corresponder à lógica de INSERT nos modelos!
        
        # Tabela 1: Usuários
        cur.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100),
                data_nascimento DATE,
                email VARCHAR(150) UNIQUE,
                senha_hash TEXT,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Tabela 2: Pesquisas (Inclui os 8 filtros do KNN como histórico)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS pesquisas (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id) NOT NULL,
                
                -- Filtros do KNN (Novas colunas)
                sentiment NUMERIC(3,2),
                category VARCHAR(100),
                min_rating SMALLINT,
                app_type VARCHAR(20),
                app_size NUMERIC(10,2),
                min_installs INTEGER, -- Alterado para INTEGER para suportar valores grandes
                content_rating SMALLINT,
                android_version NUMERIC(3,1),
                
                -- Metadados Antigos (Mantidos ou ajustados)
                ordenacao VARCHAR(50),
                criado_em TIMESTAMP DEFAULT NOW()
            );
        """)

        # Tabela 3: Resultados da Pesquisa (Armazena Top10 e KNN)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS resultados_pesquisa (
                id SERIAL PRIMARY KEY,
                pesquisa_id INTEGER REFERENCES pesquisas(id) NOT NULL,
                
                -- Metadados do App
                app_nome VARCHAR(255) NOT NULL,
                categoria VARCHAR(100),
                rating NUMERIC(3,2),
                installs BIGINT,
                preco NUMERIC(10,2),
                
                -- Dados de Ranking/Recomendação
                tipo_resultado VARCHAR(50) NOT NULL, -- 'TOP10_RANKING' ou 'KNN_RECOMENDACAO'
                posicao SMALLINT,                   -- Posição no Top10 ou KNN
                nota_final NUMERIC(5,2),            -- Score do Top10
                score_knn NUMERIC(5,4),             -- Score de similaridade do KNN
                motivo_knn TEXT
            );
        """)

        conn.commit()
        print("✅ Tabelas verificadas e criadas com sucesso!")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"❌ Erro ao criar tabelas: {e}", file=sys.stderr)
        raise
    finally:
        if conn:
            conn.close()