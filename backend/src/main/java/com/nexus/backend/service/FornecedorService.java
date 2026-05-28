package com.nexus.backend.service;

import com.nexus.backend.exceptions.ResourceAlreadyExistsException;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.repository.FornecedorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<Fornecedor> listarTodos() {
        return repo.findAll();
    }

    public List<Fornecedor> listarAtivos() {
        return repo.findByStatus("ATIVO");
    }

    public Fornecedor buscarPorId(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));
    }
}
