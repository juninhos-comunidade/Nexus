package com.nexus.backend.dto;

import com.nexus.backend.model.CompraColetiva;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CompraColetivaResponseDTO(
    Long id,
    ProdutoResponseDTO produto,
    FornecedorResponseDTO fornecedor,
    Integer quantidadeMinima,
    Integer quantidadeAtual,
    BigDecimal precoOriginal,
    BigDecimal precoComDesconto,
    LocalDateTime dataInicio,
    LocalDateTime dataLimite,
    String status
) {
    public static CompraColetivaResponseDTO from(CompraColetiva c) {
        return new CompraColetivaResponseDTO(
            c.getId(),
            c.getProduto() != null ? ProdutoResponseDTO.from(c.getProduto()) : null,
            c.getFornecedor() != null ? FornecedorResponseDTO.from(c.getFornecedor()) : null,
            c.getQuantidadeMinima(),
            c.getQuantidadeAtual(),
            c.getPrecoOriginal(),
            c.getPrecoComDesconto(),
            c.getDataInicio(),
            c.getDataLimite(),
            c.getStatus() != null ? c.getStatus().name() : null
        );
    }
}
