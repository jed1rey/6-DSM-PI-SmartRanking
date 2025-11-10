Table usuarios {
  id SERIAL [pk]
  nome VARCHAR(100)
  data_nascimento DATE
  email VARCHAR(150) [unique]
  senha_hash TEXT
  criado_em TIMESTAMP
}

Table pesquisas {
  id SERIAL [pk]
  usuario_id INT [ref: > usuarios.id]
  categoria VARCHAR(100)
  genero VARCHAR(100)
  preco_opcao VARCHAR(20) // "gratuito", "pago_ate_10", "pago_acima_10"
  ordenacao VARCHAR(50)   // "score", "rating", "popularidade", "custo_beneficio"
  criado_em TIMESTAMP
}

Table resultados_pesquisa {
  id SERIAL [pk]
  pesquisa_id INT [ref: > pesquisas.id]
  app_nome VARCHAR(255)
  categoria VARCHAR(100)
  rating NUMERIC(3,2)
  installs BIGINT
  preco NUMERIC(10,2)
  score NUMERIC(5,2)
  posicao INT
}
