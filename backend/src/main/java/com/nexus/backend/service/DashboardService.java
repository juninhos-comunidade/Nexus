package com.nexus.backend.service;

import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.model.StatusCompraColetiva;
import com.nexus.backend.repository.CompraColetivaRepository;
import com.nexus.backend.repository.FornecedorRepository;
import com.nexus.backend.repository.ProdutoRepository;
import com.nexus.backend.repository.ParticipacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final CompraColetivaRepository compraColetivaRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ParticipacaoRepository participacaoRepository;

    public DashboardService(ProdutoRepository produtoRepository,
                            CompraColetivaRepository compraColetivaRepository,
                            FornecedorRepository fornecedorRepository,
                            ParticipacaoRepository participacaoRepository) {
        this.produtoRepository = produtoRepository;
        this.compraColetivaRepository = compraColetivaRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.participacaoRepository = participacaoRepository;
    }

    public Map<String, Object> obterResumo(String emailUsuario) {
        List<CompraColetiva> compras = compraColetivaRepository.findAll();

        long totalProdutos = produtoRepository.count();
        long totalFornecedores = fornecedorRepository.count();
        
        long minhasParticipacoes = 0;
        if (emailUsuario != null && !emailUsuario.isEmpty()) {
            minhasParticipacoes = participacaoRepository.findByUsuarioEmailOrderByDataParticipacaoDesc(emailUsuario).size();
        }

        List<CompraColetiva> abertas = compras.stream()
            .filter(c -> c.getStatus() == StatusCompraColetiva.ABERTA
                      || c.getStatus() == StatusCompraColetiva.EM_ANDAMENTO)
            .toList();

        List<CompraColetiva> metasProximas = abertas.stream().filter(c -> {
            if (c.getQuantidadeMinima() == null || c.getQuantidadeMinima() == 0) return false;
            double progresso = (double) c.getQuantidadeAtual() / c.getQuantidadeMinima();
            return progresso >= 0.75 && progresso < 1.0;
        }).toList();

        List<CompraColetiva> comprasProximasPrazo = abertas.stream().filter(c -> 
            c.getDataLimite() != null && c.getDataLimite().isBefore(LocalDateTime.now().plusDays(3))
        ).toList();

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
        resumo.put("metasProximas", metasProximas.size());
        resumo.put("metasProximasList", metasProximas);
        resumo.put("comprasProximasPrazo", comprasProximasPrazo);
        resumo.put("economiaGerada", economiaGerada);
        resumo.put("comprasRecentes", abertas);
        resumo.put("minhasParticipacoes", minhasParticipacoes);

        return resumo;
    }
}