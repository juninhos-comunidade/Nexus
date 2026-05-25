package com.nexus.backend.dao;

import com.nexus.backend.model.Fornecedor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class FornecedorDAO {

    private final List<Fornecedor> bancoDeFornecedores = new ArrayList<>();
    private Long contadorId = 1L;

    public void salvar(Fornecedor fornecedor) {
        boolean cnpjExiste = bancoDeFornecedores.stream()
                .anyMatch(f -> f.getCnpj().equals(fornecedor.getCnpj()));

        if (cnpjExiste) {
            throw new IllegalArgumentException("Erro: CNPJ já está cadastrado!");
        }
        fornecedor.setId(contadorId++);

        bancoDeFornecedores.add(fornecedor);
        System.out.println(
                "🏢 Fornecedor salvo no banco em memória: " + fornecedor.getNome() + " com ID: " + fornecedor.getId());
    }
}