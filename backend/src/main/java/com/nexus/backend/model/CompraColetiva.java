package com.nexus.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "compra_coletiva")
public class CompraColetiva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Fornecedor fornecedor;

    private Integer quantidadeMinima;
    private Integer quantidadeAtual;
    private BigDecimal precoOriginal;
    private BigDecimal precoComDesconto;
    private LocalDateTime dataInicio;
    private LocalDateTime dataLimite;
    private String status;

    public CompraColetiva() {}

    @PrePersist
    public void antesDeSalvar() {
        if (this.quantidadeAtual == null) this.quantidadeAtual = 0;
        if (this.status == null) this.status = "ABERTA";
        if (this.dataInicio == null) this.dataInicio = LocalDateTime.now();
        if (this.dataLimite == null) this.dataLimite = LocalDateTime.now().plusDays(7);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Fornecedor getFornecedor() { return fornecedor; }
    public void setFornecedor(Fornecedor fornecedor) { this.fornecedor = fornecedor; }

    public Integer getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(Integer quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }

    public Integer getQuantidadeAtual() { return quantidadeAtual; }
    public void setQuantidadeAtual(Integer quantidadeAtual) { this.quantidadeAtual = quantidadeAtual; }

    public BigDecimal getPrecoOriginal() { return precoOriginal; }
    public void setPrecoOriginal(BigDecimal precoOriginal) { this.precoOriginal = precoOriginal; }

    public BigDecimal getPrecoComDesconto() { return precoComDesconto; }
    public void setPrecoComDesconto(BigDecimal precoComDesconto) { this.precoComDesconto = precoComDesconto; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

    public LocalDateTime getDataLimite() { return dataLimite; }
    public void setDataLimite(LocalDateTime dataLimite) { this.dataLimite = dataLimite; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}