package com.nexus.backend.dto;

public record PaginacaoDTO(
        Integer pagina,
        Integer tamanho,
        String ordenarPor,
        String direcao
) {
}
