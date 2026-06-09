package com.nexus.backend.controller;

import com.nexus.backend.dto.PaginacaoDTO;
import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<Produto>> listarTodos(ProdutoSearchFilter filtro, PaginacaoDTO paginacao) {
        return ResponseEntity.ok(service.listarTodos(filtro, paginacao));
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<Page<Produto>> listarDisponiveis(PaginacaoDTO paginacao) {
        return ResponseEntity.ok(service.listarDisponiveis(paginacao));
    }

    @GetMapping("/fornecedor/{id}")
    public ResponseEntity<Page<Produto>> buscarPorFornecedor(@PathVariable Long id, PaginacaoDTO paginacao) {
        return ResponseEntity.ok(service.buscarPorFornecedor(id, paginacao));
    }
}

