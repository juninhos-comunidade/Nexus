package com.nexus.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "participacao")
public class Participacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "compra_coletiva_id", nullable = false)
    private CompraColetiva compraColetiva;

    private Integer quantidade;
    private BigDecimal valorEstimado;
    private LocalDateTime dataParticipacao;

    public Participacao() {}

    @PrePersist
    public void antesDeSalvar() {
        if (this.dataParticipacao == null) this.dataParticipacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public CompraColetiva getCompraColetiva() { return compraColetiva; }
    public void setCompraColetiva(CompraColetiva compraColetiva) { this.compraColetiva = compraColetiva; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getValorEstimado() { return valorEstimado; }
    public void setValorEstimado(BigDecimal valorEstimado) { this.valorEstimado = valorEstimado; }

    public LocalDateTime getDataParticipacao() { return dataParticipacao; }
    public void setDataParticipacao(LocalDateTime dataParticipacao) { this.dataParticipacao = dataParticipacao; }
}