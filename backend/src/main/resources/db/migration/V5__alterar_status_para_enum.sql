ALTER TABLE compra_coletiva DROP CONSTRAINT IF EXISTS chk_status_compra;
ALTER TABLE compra_coletiva ADD CONSTRAINT chk_status_compra
    CHECK (status IN ('ABERTA', 'EM_ANDAMENTO', 'META_ATINGIDA', 'FINALIZADA', 'EXPIRADA', 'CANCELADA'));
