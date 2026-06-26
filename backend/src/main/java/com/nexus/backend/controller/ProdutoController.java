package com.nexus.backend.controller;

import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.service.ProdutoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody Produto p, @RequestParam Long fornecedorId) {
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

    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<Page<Produto>> listarDisponiveis(Pageable pageable) {
        return ResponseEntity.ok(service.listarDisponiveis(pageable));
    }

    @GetMapping("/fornecedor/{id}")
    public ResponseEntity<Page<Produto>> buscarPorFornecedor(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(service.buscarPorFornecedor(id, pageable));
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody Produto p) {
        try {
            return ResponseEntity.ok(service.atualizar(id, p));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluir(@PathVariable Long id) {
        try {
            service.excluir(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
