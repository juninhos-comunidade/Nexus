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

    @Transactional
    public Participacao salvarParticipacao(Long produtoId, Integer quantidade, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        CompraColetiva compra = compraColetivaRepository.findByProdutoIdAndStatus(produtoId, "ABERTA")
                .orElseGet(() -> {
                    CompraColetiva novaCompra = new CompraColetiva();
                    novaCompra.setProduto(produto);
                    novaCompra.setFornecedor(produto.getFornecedor());
                    novaCompra.setQuantidadeMinima(50);
                    novaCompra.setPrecoOriginal(produto.getPrecoUnitario());
                    novaCompra.setPrecoComDesconto(produto.getPrecoUnitario().multiply(new BigDecimal("0.90")));
                    return compraColetivaRepository.save(novaCompra);
                });

        Participacao participacao = new Participacao();
        participacao.setUsuario(usuario);
        participacao.setCompraColetiva(compra);
        participacao.setQuantidade(quantidade);
        
        BigDecimal valorEstimado = compra.getPrecoComDesconto().multiply(new BigDecimal(quantidade));
        participacao.setValorEstimado(valorEstimado);

        compra.setQuantidadeAtual(compra.getQuantidadeAtual() + quantidade);
        
        if (compra.getQuantidadeAtual() >= compra.getQuantidadeMinima()) {
            compra.setStatus("META_ATINGIDA");
        }

        compraColetivaRepository.save(compra);
        return participacaoRepository.save(participacao);
    }
    
    public List<Participacao> listarMinhasParticipacoes(String emailUsuario) {
        return participacaoRepository.findByUsuarioEmailOrderByDataParticipacaoDesc(emailUsuario);
    }
}