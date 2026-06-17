package com.nexus.backend.repository;

import com.nexus.backend.model.CompraColetiva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompraColetivaRepository extends JpaRepository<CompraColetiva, Long> {
    Optional<CompraColetiva> findByProdutoIdAndStatus(Long produtoId, String status);
}