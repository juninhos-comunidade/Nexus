package com.nexus.backend.dto;

import com.nexus.backend.model.Participacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ParticipacaoResponseDTO(
    Long id,
    UsuarioResponseDTO usuario,
    CompraColetivaResponseDTO compraColetiva,
    Integer quantidade,
    BigDecimal valorEstimado,
    LocalDateTime dataParticipacao
) {
    public static ParticipacaoResponseDTO from(Participacao p) {
        return new ParticipacaoResponseDTO(
            p.getId(),
            p.getUsuario() != null ? UsuarioResponseDTO.from(p.getUsuario()) : null,
            p.getCompraColetiva() != null ? CompraColetivaResponseDTO.from(p.getCompraColetiva()) : null,
            p.getQuantidade(),
            p.getValorEstimado(),
            p.getDataParticipacao()
        );
    }
}
