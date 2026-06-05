package com.nexus.backend.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record FornecedorSearchFilter(
        String nome,
        String categoria,
        String status,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataCadastro
) {
}

