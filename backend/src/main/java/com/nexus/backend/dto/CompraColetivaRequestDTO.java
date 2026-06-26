package com.nexus.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CompraColetivaRequestDTO(
        @NotNull Long produtoId,
        @NotNull Long fornecedorId,
        @NotNull @Min(1) Integer quantidadeMinima,
        @NotNull @DecimalMin("0.01") BigDecimal precoOriginal,
        @NotNull @DecimalMin("0.01") BigDecimal precoComDesconto,
        @NotNull LocalDateTime dataLimite
) {}
