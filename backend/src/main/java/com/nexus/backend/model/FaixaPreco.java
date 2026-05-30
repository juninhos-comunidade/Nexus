package com.nexus.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "faixas_preco")
public class FaixaPreco {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidadeMinima;
    private Integer quantidadeMaxima;
    private BigDecimal precoUnitario;

    public FaixaPreco() {}

    public FaixaPreco(Produto produto, Integer quantidadeMinima, Integer quantidadeMaxima, BigDecimal precoUnitario) {
        this.produto = produto;
        this.quantidadeMinima = quantidadeMinima;
        this.quantidadeMaxima = quantidadeMaxima;
        this.precoUnitario = precoUnitario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(Integer quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }

    public Integer getQuantidadeMaxima() { return quantidadeMaxima; }
    public void setQuantidadeMaxima(Integer quantidadeMaxima) { this.quantidadeMaxima = quantidadeMaxima; }

    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
}
