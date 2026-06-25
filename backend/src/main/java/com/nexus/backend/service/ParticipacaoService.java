package com.nexus.backend.service;

import com.nexus.backend.model.*;
import com.nexus.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import java.math.BigDecimal;

@Service
public class ParticipacaoService {

    @Autowired
    private ParticipacaoRepository participacaoRepository;

    @Autowired
    private CompraColetivaRepository compraColetivaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FaixaPrecoService faixaPrecoService;

    @Transactional
    public Participacao salvarParticipacao(Long produtoId, Integer quantidade, String emailUsuario) {
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        CompraColetiva compra = compraColetivaRepository.findByProdutoIdAndStatus(produtoId, StatusCompraColetiva.ABERTA)
                .orElseGet(() -> {
                    CompraColetiva novaCompra = new CompraColetiva();
                    novaCompra.setProduto(produto);
                    novaCompra.setFornecedor(produto.getFornecedor());
                    novaCompra.setQuantidadeMinima(50);
                    novaCompra.setPrecoOriginal(produto.getPrecoUnitario());
                    novaCompra.setPrecoComDesconto(produto.getPrecoUnitario().multiply(new BigDecimal("0.90")));
                    return compraColetivaRepository.save(novaCompra);
                });

        if (compra.getDataLimite() != null && java.time.LocalDateTime.now().isAfter(compra.getDataLimite())) {
            throw new IllegalArgumentException("Esta compra coletiva já expirou e não aceita mais participações.");
        }

        if (compra.getStatus() != StatusCompraColetiva.ABERTA && compra.getStatus() != StatusCompraColetiva.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Esta compra coletiva não está aberta para participações.");
        }

        Participacao participacao = new Participacao();
        participacao.setUsuario(usuario);
        participacao.setCompraColetiva(compra);
        participacao.setQuantidade(quantidade);
        
        BigDecimal precoAplicavel = faixaPrecoService.calcularPrecoParaQuantidade(
                produtoId, compra.getQuantidadeAtual() + quantidade);
        BigDecimal valorEstimado = precoAplicavel.multiply(new BigDecimal(quantidade));
        participacao.setValorEstimado(valorEstimado);

        compra.setQuantidadeAtual(compra.getQuantidadeAtual() + quantidade);
        
        if (compra.getQuantidadeAtual() >= compra.getQuantidadeMinima()) {
            compra.setStatus(StatusCompraColetiva.META_ATINGIDA);
        }

        compraColetivaRepository.save(compra);
        return participacaoRepository.save(participacao);
    }
    
    public List<Participacao> listarMinhasParticipacoes(String emailUsuario) {
        return participacaoRepository.findByUsuarioEmailOrderByDataParticipacaoDesc(emailUsuario);
    }
}