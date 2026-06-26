package com.nexus.backend.controller;

import com.nexus.backend.dto.AtualizarPerfilDTO;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.repository.UsuarioRepository;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> meuPerfil(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Map<String, Object> perfil = Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "nomeNegocio", usuario.getNomeNegocio() != null ? usuario.getNomeNegocio() : "",
                "telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "",
                "perfil", usuario.getTipoUsuario(),
                "dataCadastro", usuario.getDataCadastro(),
                "status", usuario.getStatus()
        );
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(@RequestBody AtualizarPerfilDTO dto, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Usuario u = repository.findById(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (dto.nome() != null) u.setNome(dto.nome());
        if (dto.nomeNegocio() != null) u.setNomeNegocio(dto.nomeNegocio());
        if (dto.telefone() != null) u.setTelefone(dto.telefone());

        repository.save(u);
        return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso."));
    }
}
