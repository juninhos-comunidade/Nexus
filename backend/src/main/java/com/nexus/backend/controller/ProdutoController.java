package com.nexus.backend.controller;

import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    
    @Autowired
    private ProdutoService service;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Produto p, @RequestParam Long fornecedorId) {
        try {
            return ResponseEntity.ok(service.salvar(p, fornecedorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<Produto>> listarTodos(ProdutoSearchFilter filtro, Pageable pageable) {
        return ResponseEntity.ok(service.listarTodos(filtro, pageable));
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<Page<Produto>> listarDisponiveis(Pageable pageable) {
        return ResponseEntity.ok(service.listarDisponiveis(pageable));
    }

    @GetMapping("/fornecedor/{id}")
    public ResponseEntity<Page<Produto>> buscarPorFornecedor(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(service.buscarPorFornecedor(id, pageable));
    }
}
