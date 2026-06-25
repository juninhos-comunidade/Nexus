package com.nexus.backend.service;

import com.nexus.backend.model.FaixaPreco;
import com.nexus.backend.model.Produto;
import com.nexus.backend.repository.FaixaPrecoRepository;
import com.nexus.backend.repository.ProdutoRepository;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FaixaPrecoService {

    private final FaixaPrecoRepository faixaRepo;
    private final ProdutoRepository produtoRepo;

    public FaixaPrecoService(FaixaPrecoRepository faixaRepo, ProdutoRepository produtoRepo) {
        this.faixaRepo = faixaRepo;
        this.produtoRepo = produtoRepo;
    }

    public BigDecimal calcularPrecoParaQuantidade(Long produtoId, int quantidade) {
        List<FaixaPreco> faixas = faixaRepo.findByProdutoIdOrderByQuantidadeMinimaAsc(produtoId);

        for (int i = faixas.size() - 1; i >= 0; i--) {
            FaixaPreco faixa = faixas.get(i);
            if (quantidade >= faixa.getQuantidadeMinima()) {
                return faixa.getPrecoUnitario();
            }
        }

        Produto produto = produtoRepo.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return produto.getPrecoUnitario();
    }
}
