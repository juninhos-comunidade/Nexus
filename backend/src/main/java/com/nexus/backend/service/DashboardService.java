package com.nexus.backend.service;

import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.repository.CompraColetivaRepository;
import com.nexus.backend.repository.FornecedorRepository;
import com.nexus.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private CompraColetivaRepository compraColetivaRepository;
    @Autowired private FornecedorRepository fornecedorRepository;

    public Map<String, Object> obterResumo() {
        List<CompraColetiva> compras = compraColetivaRepository.findAll();

        long totalProdutos = produtoRepository.count();
        long totalFornecedores = fornecedorRepository.count();

        long metasProximas = compras.stream().filter(c -> {
            if (c.getQuantidadeMinima() == null || c.getQuantidadeMinima() == 0) return false;
            double progresso = (double) c.getQuantidadeAtual() / c.getQuantidadeMinima();
            return progresso >= 0.75 && progresso < 1.0;
        }).count();

        BigDecimal economiaGerada = compras.stream()
            .map(c -> {
                BigDecimal original = c.getPrecoOriginal() != null ? c.getPrecoOriginal() : BigDecimal.ZERO;
                BigDecimal desconto = c.getPrecoComDesconto() != null ? c.getPrecoComDesconto() : BigDecimal.ZERO;
                int qtd = c.getQuantidadeAtual() != null ? c.getQuantidadeAtual() : 0;
                return original.subtract(desconto).multiply(new BigDecimal(qtd));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalProdutos", totalProdutos);
        resumo.put("totalFornecedores", totalFornecedores);
        resumo.put("metasProximas", metasProximas);
        resumo.put("economiaGerada", economiaGerada);
        resumo.put("comprasRecentes", compras);

        return resumo;
    }
}