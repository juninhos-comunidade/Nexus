package com.nexus.backend.repository;

import com.nexus.backend.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    Optional<Fornecedor> findByEmail(String email);
    Optional<Fornecedor> findByCnpj(String cnpj);
    List<Fornecedor> findByStatus(String status);
    List<Fornecedor> findByNomeContainingIgnoreCase(String nome);
}
