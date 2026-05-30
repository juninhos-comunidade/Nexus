ALTER TABLE fornecedor ADD COLUMN data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE produto ADD COLUMN data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE produto RENAME COLUMN imagem_url TO imagem;

CREATE TABLE faixas_preco (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    quantidade_minima INT NOT NULL,
    quantidade_maxima INT,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_faixa_produto FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE
);