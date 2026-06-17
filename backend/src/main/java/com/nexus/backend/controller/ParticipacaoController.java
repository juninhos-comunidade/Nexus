package com.nexus.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/participacao")
@CrossOrigin(origins = "*")
public class ParticipacaoController {

    @PostMapping
    public ResponseEntity<?> registrarParticipacao(@RequestBody Map<String, Object> payload) {
        System.out.println("Nova intenção de participação recebida: " + payload);

        return ResponseEntity.ok().body(Map.of("mensagem", "Participação registrada com sucesso!"));
    }
}