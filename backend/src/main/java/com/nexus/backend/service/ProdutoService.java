package com.nexus.backend.service;

import com.nexus.backend.model.Produto;
import repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<Produto> listarDisponiveis() {
        return repo.findByStatus("DISPONIVEL");
    }

    public List<Produto> buscarPorFornecedor(Long id) {
        return repo.findByFornecedorId(id);
    }
}
