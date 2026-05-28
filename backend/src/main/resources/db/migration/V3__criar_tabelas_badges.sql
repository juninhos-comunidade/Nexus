CREATE TABLE badge (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    criterio TEXT NOT NULL,
    icone VARCHAR(255)
);

CREATE TABLE usuario_badge (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_badge_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_badge_badge FOREIGN KEY (badge_id) REFERENCES badge(id) ON DELETE RESTRICT,

    CONSTRAINT uq_usuario_badge UNIQUE (usuario_id, badge_id)
);

INSERT INTO badge (nome, descricao, criterio) VALUES
    ('Primeira de Muitas', 'Participou da sua primeira compra coletiva na plataforma.', 'COMPRA_COLETIVA_COUNT >= 1'),
    ('Comprador Recorrente', 'Demonstrou engajamento participando de 5 compras coletivas.', 'COMPRA_COLETIVA_COUNT >= 5'),
    ('Força Cooperativa', 'Ajudou uma compra coletiva local a atingir a meta mínima exigida.', 'AJUDOU_BATER_META = TRUE'),
    ('Fornecedor Ativo', 'Parceiro comercial com produtos ativamente disponibilizados para lotes.', 'PRODUTOS_ATIVOS >= 1'),
    ('Revendedor Parceiro', 'Pequeno comerciante altamente ativo nas negociações de grupo.', 'REVENDEDOR_PRO = TRUE');