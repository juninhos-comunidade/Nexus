package com.nexus.backend.specifications;

import com.nexus.backend.dto.ProdutoSearchFilter;
import com.nexus.backend.model.Produto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class ProdutoSpecification {

    private ProdutoSpecification() {
    }

    public static Specification<Produto> filtrar(ProdutoSearchFilter filtro) {
        if (filtro == null) {
            return Specification.unrestricted();
        }

        return Specification.<Produto>unrestricted()
                .and(comNome(filtro.nome()))
                .and(comCategoria(filtro.categoria()))
                .and(comPrecoMaiorQue(filtro.precoMaiorQue()))
                .and(comStatus(filtro.status()))
                .and(comDataCadastro(filtro.dataCadastro()));
    }

    public static Specification<Produto> comNome(String nome) {
        if (eValido(nome)) {
            var nomeNormalizado = nome.trim().toLowerCase();
            return (root, query, cb) -> cb.like(cb.lower(root.get("nome")), "%" + nomeNormalizado + "%");
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Produto> comCategoria(String categoria) {
        if (eValido(categoria)) {
            var categoriaNormalizada = categoria.trim().toLowerCase();
            return (root, query, cb) -> cb.like(cb.lower(root.get("categoria")), "%" + categoriaNormalizada + "%");
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Produto> comPrecoMaiorQue(BigDecimal precoMaiorQue) {
        if (eValido(precoMaiorQue) && precoMaiorQue.compareTo(BigDecimal.ZERO) >= 0) {
            return (root, query, cb) -> cb.greaterThan(root.get("precoUnitario"), precoMaiorQue);
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Produto> comStatus(String status) {
        if (eValido(status)) {
            var statusNormalizado = status.trim().toLowerCase();
            return (root, query, cb) -> cb.equal(cb.lower(root.get("status")), statusNormalizado);
        } else {
            return Specification.unrestricted();
        }
    }

    public static Specification<Produto> comDataCadastro(LocalDate dataCadastro) {
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

    private static boolean eValido(BigDecimal valor) {
        return valor != null;
    }

    private static boolean eValido(LocalDate valor) {
        return valor != null;
    }
}



