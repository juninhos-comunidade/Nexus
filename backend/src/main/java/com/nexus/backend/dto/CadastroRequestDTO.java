package com.nexus.backend.dto;

public record CadastroRequestDTO(

        String nome,
        String email,
        String senha,
        String tipoUsuario,
        String telefone,

        // dependendo do perfil, podem vir vazios
        String nomeNegocio, // Usado na entidade Usuario
        String cnpj, // especifico do fornecedor
        String categoria, // especifico do fornecedor
        String descricao // especifico do fornecedor
) {
}