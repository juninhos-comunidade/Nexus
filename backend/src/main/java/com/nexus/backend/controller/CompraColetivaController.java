package com.nexus.backend.controller;

import com.nexus.backend.dto.CompraColetivaRequestDTO;
import com.nexus.backend.dto.CompraColetivaResponseDTO;
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
    public ResponseEntity<List<CompraColetivaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas().stream().map(CompraColetivaResponseDTO::from).toList());
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<CompraColetivaResponseDTO>> listarAbertas() {
        return ResponseEntity.ok(service.listarAbertas().stream().map(CompraColetivaResponseDTO::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraColetivaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(CompraColetivaResponseDTO.from(service.buscarPorId(id)));
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<CompraColetivaResponseDTO> criar(@Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(CompraColetivaResponseDTO.from(service.criarCompraColetiva(dto)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CompraColetivaResponseDTO> editar(@PathVariable Long id, @Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(CompraColetivaResponseDTO.from(service.editar(id, dto)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<CompraColetivaResponseDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(CompraColetivaResponseDTO.from(service.cancelar(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<CompraColetivaResponseDTO> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(CompraColetivaResponseDTO.from(service.finalizar(id)));
    }
}