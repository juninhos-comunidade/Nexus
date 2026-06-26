package com.nexus.backend.dto;

import com.nexus.backend.model.Fornecedor;
import java.time.LocalDateTime;

public record FornecedorResponseDTO(
    Long id,
    String nome,
    String cnpj,
    String email,
    String telefone,
    String categoria,
    String descricao,
    String status,
    LocalDateTime dataCadastro
) {
    public static FornecedorResponseDTO from(Fornecedor f) {
        return new FornecedorResponseDTO(
            f.getId(),
            f.getNome(),
            f.getCnpj(),
            f.getEmail(),
            f.getTelefone(),
            f.getCategoria(),
            f.getDescricao(),
            f.getStatus(),
            f.getDataCadastro()
        );
    }
}
