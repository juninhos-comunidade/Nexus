package com.nexus.backend.dto;

import com.nexus.backend.model.TipoUsuario;
import jakarta.validation.constraints.*;

public record CadastroRequestDTO(

        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String senha,
        @NotNull TipoUsuario tipoUsuario,
        String telefone,

        // dependendo do perfil, podem vir vazios
        String nomeNegocio, // Usado na entidade Usuario
        String cnpj, // especifico do fornecedor
        String categoria, // especifico do fornecedor
        String descricao // especifico do fornecedor
) {
}