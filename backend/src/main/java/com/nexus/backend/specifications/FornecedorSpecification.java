package com.nexus.backend.specifications;

import com.nexus.backend.dto.FornecedorSearchFilter;
import com.nexus.backend.model.Fornecedor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

public final class FornecedorSpecification {

    private FornecedorSpecification() {
    }

    public static Specification<Fornecedor> filtrar(FornecedorSearchFilter filtro) {
        if (filtro == null) {
            return Specification.unrestricted();
        }

        return Specification.<Fornecedor>unrestricted()
                .and(comNome(filtro.nome()))
                .and(comCategoria(filtro.categoria()))
                .and(comStatus(filtro.status()))
                .and(comDataCadastro(filtro.dataCadastro()));
    }

    public static Specification<Fornecedor> comNome(String nome) {
        if (eValido(nome)) {
            var nomeNormalizado = nome.trim().toLowerCase();
            return (root, query, cb) -> cb.like(cb.lower(root.get("nome")), "%" + nomeNormalizado + "%");
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Fornecedor> comCategoria(String categoria) {
        if (eValido(categoria)) {
            var categoriaNormalizada = categoria.trim().toLowerCase();
            return (root, query, cb) -> cb.like(cb.lower(root.get("categoria")), "%" + categoriaNormalizada + "%");
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Fornecedor> comStatus(String status) {
        if (eValido(status)) {
            var statusNormalizado = status.trim().toLowerCase();
            return (root, query, cb) -> cb.equal(cb.lower(root.get("status")), statusNormalizado);
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Fornecedor> comDataCadastro(LocalDate dataCadastro) {
        if (eValido(dataCadastro)) {
            return (root, query, cb) -> cb.between(
                    root.get("dataCadastro"),
                    dataCadastro.atStartOfDay(),
                    dataCadastro.plusDays(1).atStartOfDay().minusNanos(1)
            );
        } else {
            return Specification.unrestricted();
        }
    }

    private static boolean eValido(String valor) {
        return StringUtils.hasText(valor);
    }

    private static boolean eValido(LocalDate valor) {
        return valor != null;
    }
}

