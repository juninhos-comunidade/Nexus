package com.nexus.backend.service;

import com.nexus.backend.dto.CompraColetivaRequestDTO;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import com.nexus.backend.model.*;
import com.nexus.backend.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompraColetivaService {

    private final CompraColetivaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;

    public CompraColetivaService(CompraColetivaRepository repository,
                                  ProdutoRepository produtoRepository,
                                  FornecedorRepository fornecedorRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    public List<CompraColetiva> listarTodas() {
        return repository.findAll();
    }

    public List<CompraColetiva> listarAbertas() {
        return repository.findByStatusIn(
                List.of(StatusCompraColetiva.ABERTA, StatusCompraColetiva.EM_ANDAMENTO));
    }

    public CompraColetiva buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra coletiva não encontrada"));
    }

    @Transactional
    public CompraColetiva criarCompraColetiva(CompraColetivaRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));

        if (dto.dataLimite().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data limite deve ser no futuro.");
        }

        CompraColetiva compra = new CompraColetiva();
        compra.setProduto(produto);
        compra.setFornecedor(fornecedor);
        compra.setQuantidadeMinima(dto.quantidadeMinima());
        compra.setPrecoOriginal(dto.precoOriginal());
        compra.setPrecoComDesconto(dto.precoComDesconto());
        compra.setDataLimite(dto.dataLimite());

        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva editar(Long id, CompraColetivaRequestDTO dto) {
        CompraColetiva compra = buscarPorId(id);

        if (dto.quantidadeMinima() != null) compra.setQuantidadeMinima(dto.quantidadeMinima());
        if (dto.precoOriginal() != null) compra.setPrecoOriginal(dto.precoOriginal());
        if (dto.precoComDesconto() != null) compra.setPrecoComDesconto(dto.precoComDesconto());
        if (dto.dataLimite() != null) compra.setDataLimite(dto.dataLimite());

        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva cancelar(Long id) {
        CompraColetiva compra = buscarPorId(id);
        compra.setStatus(StatusCompraColetiva.CANCELADA);
        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva finalizar(Long id) {
        CompraColetiva compra = buscarPorId(id);
        compra.setStatus(StatusCompraColetiva.FINALIZADA);
        return repository.save(compra);
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void expirarComprasVencidas() {
        List<CompraColetiva> abertas = repository.findByStatusIn(
                List.of(StatusCompraColetiva.ABERTA, StatusCompraColetiva.EM_ANDAMENTO));

        LocalDateTime agora = LocalDateTime.now();
        for (CompraColetiva compra : abertas) {
            if (compra.getDataLimite() != null && agora.isAfter(compra.getDataLimite())) {
                compra.setStatus(StatusCompraColetiva.EXPIRADA);
                repository.save(compra);
            }
        }
    }
}
