package com.nexus.backend.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoSearchFilter(
        String nome,
        String categoria,
        BigDecimal precoMaiorQue,
        String status,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataCadastro
) {
}


