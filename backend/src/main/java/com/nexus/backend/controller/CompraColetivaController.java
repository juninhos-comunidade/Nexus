package com.nexus.backend.controller;

import com.nexus.backend.dto.CompraColetivaRequestDTO;
import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.service.CompraColetivaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras-coletivas")
public class CompraColetivaController {

    private final CompraColetivaService service;

    public CompraColetivaController(CompraColetivaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CompraColetiva>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<CompraColetiva>> listarAbertas() {
        return ResponseEntity.ok(service.listarAbertas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraColetiva> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<CompraColetiva> criar(@Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(service.criarCompraColetiva(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CompraColetiva> editar(@PathVariable Long id, @Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(service.editar(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<CompraColetiva> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelar(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<CompraColetiva> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(service.finalizar(id));
    }
}