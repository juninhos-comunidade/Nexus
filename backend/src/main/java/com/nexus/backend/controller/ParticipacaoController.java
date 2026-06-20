package com.nexus.backend.controller;

import com.nexus.backend.model.Participacao;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.service.ParticipacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/participacao")
@CrossOrigin(origins = "*")
public class ParticipacaoController {

    @Autowired
    private ParticipacaoService service;

    @PostMapping
    public ResponseEntity<?> registrarParticipacao(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long produtoId = Long.valueOf(payload.get("produtoId").toString());
            Integer quantidade = Integer.valueOf(payload.get("quantidade").toString());
            Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
            String emailUsuario = usuarioLogado.getEmail();

            Participacao p = service.salvarParticipacao(produtoId, quantidade, emailUsuario);
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    
    @GetMapping("/minhas")
    public ResponseEntity<?> listarMinhasParticipacoes(Authentication authentication) {
        try {
            Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
            return ResponseEntity.ok(service.listarMinhasParticipacoes(usuarioLogado.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    
}