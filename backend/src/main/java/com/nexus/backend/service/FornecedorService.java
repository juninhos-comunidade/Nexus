package com.nexus.backend.service;

import com.nexus.backend.dto.FornecedorSearchFilter;
import com.nexus.backend.exceptions.ResourceAlreadyExistsException;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.repository.FornecedorRepository;
import com.nexus.backend.specifications.FornecedorSpecification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<Fornecedor> listarTodos(FornecedorSearchFilter filtro, Pageable pageable) {
        return repo.findAll(FornecedorSpecification.filtrar(filtro), pageable);
    }

    public Page<Fornecedor> listarAtivos(Pageable pageable) {
        return repo.findByStatus("ATIVO", pageable);
    }

    public Fornecedor buscarPorId(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));
    }
}
