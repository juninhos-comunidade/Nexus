package com.nexus.backend.dao;

import com.nexus.backend.model.Usuario;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioDAO {

    // ainda estamos sem os dados, então essa tabela simula
    private final List<Usuario> bancoDeUsuarios = new ArrayList<>();
    private Long contadorId = 1L;

    // salva novo usuário
    public void salvar(Usuario usuario) {
        boolean emailExiste = bancoDeUsuarios.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(usuario.getEmail()));

        if (emailExiste) {
            throw new IllegalArgumentException("Erro: E-mail já está em uso!");
        }

        usuario.setId(contadorId++);
        bancoDeUsuarios.add(usuario);
        System.out.println("💾 Usuário salvo no banco em memória: " + usuario.getEmail());
    }

    public Optional<Usuario> buscarPorEmailESenha(String email, String senha) {
        return bancoDeUsuarios.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email) && u.getSenha().equals(senha))
                .findFirst();
    }
}