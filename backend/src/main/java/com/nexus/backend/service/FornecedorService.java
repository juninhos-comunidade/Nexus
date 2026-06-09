package com.nexus.backend.service;

import com.nexus.backend.dto.FornecedorSearchFilter;
import com.nexus.backend.dto.PaginacaoDTO;
import com.nexus.backend.exceptions.ResourceAlreadyExistsException;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.repository.FornecedorRepository;
import com.nexus.backend.specifications.FornecedorSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class FornecedorService {
    
    @Autowired
    private FornecedorRepository repo;

    public Fornecedor salvar(Fornecedor f) {
        if (repo.findByEmail(f.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Esse email já está cadastrado");
        }
        if (f.getCnpj() != null && repo.findByCnpj(f.getCnpj()).isPresent()) {
            throw new ResourceAlreadyExistsException("Esse CNPJ já está cadastrado");
        }
        return repo.save(f);
    }

    public Page<Fornecedor> listarTodos(FornecedorSearchFilter filtro, PaginacaoDTO paginacao) {
        return repo.findAll(FornecedorSpecification.filtrar(filtro), toPageable(paginacao));
    }

    public Page<Fornecedor> listarAtivos(PaginacaoDTO paginacao) {
        return repo.findByStatus("ATIVO", toPageable(paginacao));
    }

    public Fornecedor buscarPorId(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));
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

