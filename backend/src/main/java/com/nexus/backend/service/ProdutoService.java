package com.nexus.backend.service;

import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.repository.ProdutoRepository;
import com.nexus.backend.specifications.ProdutoSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository repo;

    @Autowired
    private FornecedorService fornecedorService;

    public Produto salvar(Produto p, Long fornecedorId) {
        var fornecedor = fornecedorService.buscarPorId(fornecedorId);
        p.setFornecedor(fornecedor);
        return repo.save(p);
    }

    public Page<Produto> listarTodos(ProdutoSearchFilter filtro, Pageable pageable) {
        return repo.findAll(ProdutoSpecification.filtrar(filtro), pageable);
    }

    public Page<Produto> listarDisponiveis(Pageable pageable) {
        return repo.findByStatus("DISPONIVEL", pageable);
    }

    public Page<Produto> buscarPorFornecedor(Long id, Pageable pageable) {
        return repo.findByFornecedorId(id, pageable);
    }

    public Produto atualizar(Long id, Produto pAtualizado) {
        Produto p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        p.setNome(pAtualizado.getNome());
        p.setCategoria(pAtualizado.getCategoria());
        p.setPrecoUnitario(pAtualizado.getPrecoUnitario());
        p.setStatus(pAtualizado.getStatus());
        p.setDescricao(pAtualizado.getDescricao());

        return repo.save(p);
    }

    public void excluir(Long id) {
        Produto p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        repo.delete(p);
    }
}
