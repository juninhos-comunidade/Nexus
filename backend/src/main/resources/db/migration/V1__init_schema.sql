CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(70) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    nome_negocio VARCHAR(255),
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE fornecedor (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    categoria VARCHAR(255),
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE produto (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(255),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'DISPONÍVEL',
    fornecedor_id BIGINT NOT NULL ,
    CONSTRAINT fk_produto_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE RESTRICT
);

CREATE TABLE compra_coletiva (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    fornecedor_id BIGINT NOT NULL,
    quantidade_minima INT NOT NULL CHECK (quantidade_minima > 0),
    quantidade_atual INT NOT NULL DEFAULT 0,
    preco_original DECIMAL(10, 2) NOT NULL CHECK (preco_original >= 0),
    preco_com_desconto DECIMAL(10, 2) NOT NULL CHECK (preco_com_desconto >= 0),
    data_inicio TIMESTAMP NOT NULL,
    data_limite TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA',
    CONSTRAINT fk_compra_produto FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT,
    CONSTRAINT fk_compra_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE RESTRICT
);

CREATE TABLE participacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    compra_coletiva_id BIGINT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    valor_estimado DECIMAL(10, 2) NOT NULL,
    data_participacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_participacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT,
    CONSTRAINT fk_participacao_compra FOREIGN KEY (compra_coletiva_id) REFERENCES compra_coletiva(id) ON DELETE RESTRICT
);