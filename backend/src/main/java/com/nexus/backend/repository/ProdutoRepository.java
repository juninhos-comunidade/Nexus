package com.nexus.backend.repository;

import com.nexus.backend.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long>, JpaSpecificationExecutor<Produto> {
    List<Produto> findByStatus(String status);
    Page<Produto> findByStatus(String status, Pageable pageable);
    List<Produto> findByFornecedorId(Long fornecedorId);
    Page<Produto> findByFornecedorId(Long fornecedorId, Pageable pageable);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByCategoriaContainingIgnoreCase(String categoria);
}
