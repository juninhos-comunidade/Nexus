package com.nexus.backend.dto;

import com.nexus.backend.model.Produto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProdutoResponseDTO(
    Long id,
    String nome,
    String descricao,
    String categoria,
    BigDecimal precoUnitario,
    String imagem,
    String status,
    LocalDateTime dataCadastro,
    FornecedorResponseDTO fornecedor
) {
    public static ProdutoResponseDTO from(Produto p) {
        return new ProdutoResponseDTO(
            p.getId(),
            p.getNome(),
            p.getDescricao(),
            p.getCategoria(),
            p.getPrecoUnitario(),
            p.getImagem(),
            p.getStatus(),
            p.getDataCadastro(),
            p.getFornecedor() != null ? FornecedorResponseDTO.from(p.getFornecedor()) : null
        );
    }
}
