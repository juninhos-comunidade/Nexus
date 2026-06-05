package com.nexus.backend.controller;

import com.nexus.backend.dto.FornecedorSearchFilter;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*")
public class FornecedorController {
    
    @Autowired
    private FornecedorService service;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Fornecedor f) {
        try {
            return ResponseEntity.ok(service.salvar(f));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Fornecedor>> listar(FornecedorSearchFilter filtro) {
        return ResponseEntity.ok(service.listarTodos(filtro));
    }

    @GetMapping("/ativos")
    public List<Fornecedor> listarAtivos() {
        return service.listarAtivos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
