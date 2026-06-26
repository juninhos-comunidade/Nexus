package com.nexus.backend.dto;

import com.nexus.backend.model.Usuario;
import java.time.LocalDateTime;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email,
    String tipoUsuario,
    String nomeNegocio,
    String telefone,
    LocalDateTime dataCadastro,
    String status
) {
    public static UsuarioResponseDTO from(Usuario u) {
        return new UsuarioResponseDTO(
            u.getId(),
            u.getNome(),
            u.getEmail(),
            u.getTipoUsuario(),
            u.getNomeNegocio(),
            u.getTelefone(),
            u.getDataCadastro(),
            u.getStatus()
        );
    }
}
