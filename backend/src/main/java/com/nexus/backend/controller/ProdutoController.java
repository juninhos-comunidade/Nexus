package com.nexus.backend.controller;

import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    
    @Autowired
    private ProdutoService service;

    @PostMapping
    private ResponseEntity<?> criar(@RequestBody Produto p, @RequestParam Long fornecedorId) {
        try {
            return ResponseEntity.ok(service.salvar(p, fornecedorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos(ProdutoSearchFilter filtro) {
        return ResponseEntity.ok(service.listarTodos(filtro));
    }

    @GetMapping("/disponiveis")
    public List<Produto> listarDisponiveis() {
        return service.listarDisponiveis();
    }

    @GetMapping("/fornecedor/{id}")
    public List<Produto> buscarPorFornecedor(@PathVariable Long id) {
        return service.buscarPorFornecedor(id);
    }
}
