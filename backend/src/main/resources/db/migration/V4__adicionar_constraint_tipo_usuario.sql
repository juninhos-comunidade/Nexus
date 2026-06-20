UPDATE usuario SET tipo_usuario = UPPER(tipo_usuario);

ALTER TABLE usuario
    ADD CONSTRAINT chk_tipo_usuario
    CHECK (tipo_usuario IN ('REVENDEDOR', 'FORNECEDOR', 'ADMIN', 'COMUM'));

