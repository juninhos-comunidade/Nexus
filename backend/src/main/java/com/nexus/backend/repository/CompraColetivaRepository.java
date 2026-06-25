package com.nexus.backend.repository;

import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.model.StatusCompraColetiva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CompraColetivaRepository extends JpaRepository<CompraColetiva, Long> {
    Optional<CompraColetiva> findByProdutoIdAndStatus(Long produtoId, StatusCompraColetiva status);
    List<CompraColetiva> findByStatusIn(List<StatusCompraColetiva> statuses);
}