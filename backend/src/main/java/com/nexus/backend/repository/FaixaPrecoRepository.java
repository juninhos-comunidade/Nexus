package com.nexus.backend.repository;

import com.nexus.backend.model.FaixaPreco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FaixaPrecoRepository extends JpaRepository<FaixaPreco, Long> {
    List<FaixaPreco> findByProdutoIdOrderByQuantidadeMinimaAsc(Long produtoId);
}
