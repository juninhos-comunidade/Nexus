package com.nexus.backend.service;

import com.nexus.backend.dto.PaginacaoDTO;
import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import com.nexus.backend.repository.ProdutoRepository;
import com.nexus.backend.specifications.ProdutoSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Page<Produto> listarTodos(ProdutoSearchFilter filtro, PaginacaoDTO paginacao) {
        return repo.findAll(ProdutoSpecification.filtrar(filtro), toPageable(paginacao));
    }

    public Page<Produto> listarDisponiveis(PaginacaoDTO paginacao) {
        return repo.findByStatus("DISPONIVEL", toPageable(paginacao));
    }

    public Page<Produto> buscarPorFornecedor(Long id, PaginacaoDTO paginacao) {
        return repo.findByFornecedorId(id, toPageable(paginacao));
    }

    private Pageable toPageable(PaginacaoDTO dto) {
        int pagina = (dto != null && dto.pagina() != null) ? dto.pagina() : 0;
        int tamanho = (dto != null && dto.tamanho() != null) ? dto.tamanho() : 10;
        String ordenarPor = (dto != null && dto.ordenarPor() != null) ? dto.ordenarPor() : "id";
        Sort.Direction direcao = (dto != null && dto.direcao() != null && dto.direcao().equalsIgnoreCase("DESC"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(pagina, tamanho, Sort.by(direcao, ordenarPor));
    }
}

