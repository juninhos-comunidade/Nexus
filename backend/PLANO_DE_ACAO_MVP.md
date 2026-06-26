# 📋 Plano de Ação — Funcionalidades e Endpoints do MVP Nexus

> **Data:** 25/06/2026
> **Baseado em:** Documentação de Requisitos - Projeto Nexus.pdf + análise da codebase atual
>
> **Planos complementares:**
> - [PLANO_VALIDACOES_REGRAS_NEGOCIO.md](PLANO_VALIDACOES_REGRAS_NEGOCIO.md) — Validações de entrada e regras de negócio
> - [PLANO_SEGURANCA_JWT.md](PLANO_SEGURANCA_JWT.md) — Segurança, JWT e autenticação

---

## 1. Diagnóstico do Estado Atual

### ✅ O que já está implementado

| Requisito | Status Backend | Status Frontend |
|---|---|---|
| RF01 — Cadastro de usuário | ✅ Completo | ✅ `auth.html` / `auth.js` |
| RF02 — Login de usuário | ✅ Completo (JWT) | ✅ `auth.html` / `auth.js` |
| RF04 — Login/cadastro por abas | N/A (frontend) | ✅ Implementado |
| RF05 — Controle de acesso por perfil | ✅ `@PreAuthorize` + roles no JWT | ✅ Parcial |
| RF06 — Cadastro de fornecedor | ✅ `FornecedorController.criar()` | ✅ `fornecedor.html` |
| RF07 — Listagem de fornecedores | ✅ Paginado + filtros (Specification) | ✅ `fornecedor.html` |
| RF08 — Cadastro de produto | ✅ `ProdutoController.criar()` | ✅ `products.html` |
| RF09 — Listagem de produtos | ✅ Paginado + filtros (Specification) | ✅ `products.html` |
| RF11 — Busca de produtos | ✅ Via Specification (`nome`) | ✅ Parcial |
| RF12 — Filtro por categoria | ✅ Via Specification (`categoria`) | ✅ Parcial |
| RF15 — Participar de compra coletiva | ✅ `ParticipacaoService` | ✅ `comprasColetivas.html` |
| RF16 — Atualizar volume total | ✅ Automático no `salvarParticipacao()` | ✅ Via renderização |
| RF17 — Verificar meta | ✅ Check no `salvarParticipacao()` | ✅ Via renderização |
| RF21 — Histórico de participações | ✅ `ParticipacaoController.listarMinhas()` | ✅ `compras.html` |
| RF22 — Dashboard | ✅ `DashboardService.obterResumo()` | ✅ `dashboard.html` |
| RF23 — Barra de progresso | ⚠️ Dados expostos, mas sem campo dedicado | ✅ Frontend calcula |
| RF24 — Indicadores numéricos | ✅ Parcial (produtos, fornecedores, economia) | ✅ `dashboard.js` |

### ❌ O que está faltando (escopo deste plano)

| Requisito | Prioridade | Descrição |
|---|---|---|
| RF10 — Detalhes do produto | Alta | Não há endpoint `GET /api/produtos/{id}` |
| RF13 — Faixas de preço regressivas | Média | Entity + Service + Repository existem, mas sem controller/endpoints REST |
| RF14 — Criar compra coletiva (explícita) | Alta | Criação é implícita dentro de `salvarParticipacao()`, não há endpoint direto |
| RF19 — Exibir prazo da compra | Alta | Dado existe no model, mas endpoint de detalhe da compra coletiva não existe |
| RF22 — Dashboard completo | Média | Faltam: compras próximas do prazo, total de participantes, resumo do usuário |
| RF25 — Destacar compras próximas da meta | Média | `DashboardService` calcula mas não expõe lista filtrada |
| RF26 — Destacar compras próximas do prazo | Média | Não implementado |
| RF27 — Conceder badges | Baixa | Tabelas existem no banco, mas sem service/controller |
| RF28 — Exibir badges no perfil | Baixa | Sem endpoint |
| RF31 — Gerenciar usuários (admin) | Média | Sem `UsuarioController` com CRUD admin |
| RF33 — Gerenciar fornecedores (admin) | Média | Sem endpoints de edição e exclusão |
| RF34 — Gerenciar compras coletivas (admin) | Média | Sem endpoints de edição, cancelamento e finalização |
| Controle de perfil (RF05/MVP obrigatório) | Alta | Sem `UsuarioController` com `GET/PUT /api/usuario/perfil` |

---

## 2. Plano de Ação por Fase

### 🟡 FASE 1 — Endpoints Faltantes do MVP Obrigatório

#### 1.1 Controle de perfil — Visualizar e editar perfil do usuário

> O documento de requisitos lista "Controle de perfil" como **MVP obrigatório** (seção 11.1).

**Arquivo novo:** `dto/AtualizarPerfilDTO.java`
```java
package com.nexus.backend.dto;

public record AtualizarPerfilDTO(
        String nome,
        String nomeNegocio,
        String telefone
) {}
```

**Arquivo novo:** `controller/UsuarioController.java`
```java
package com.nexus.backend.controller;

import com.nexus.backend.dto.AtualizarPerfilDTO;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.repository.UsuarioRepository;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> meuPerfil(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Map<String, Object> perfil = Map.of(
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "nomeNegocio", usuario.getNomeNegocio() != null ? usuario.getNomeNegocio() : "",
                "telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "",
                "perfil", usuario.getTipoUsuario(),
                "dataCadastro", usuario.getDataCadastro(),
                "status", usuario.getStatus()
        );
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(@RequestBody AtualizarPerfilDTO dto, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Usuario u = repository.findById(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (dto.nome() != null) u.setNome(dto.nome());
        if (dto.nomeNegocio() != null) u.setNomeNegocio(dto.nomeNegocio());
        if (dto.telefone() != null) u.setTelefone(dto.telefone());

        repository.save(u);
        return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso."));
    }
}
```

> ⚠️ **Frontend:** Em `user.js`, alterar a função de salvar perfil para chamar `PUT /api/usuario/perfil` com o token. Também alterar a inicialização para buscar dados via `GET /api/usuario/perfil` em vez de depender apenas do `localStorage`.

---

#### 1.2 Detalhes do produto (RF10)

**Arquivo:** `service/ProdutoService.java` — adicionar:
```java
public Produto buscarPorId(Long id) {
    return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
}
```

**Arquivo:** `controller/ProdutoController.java` — adicionar:
```java
@GetMapping("/{id}")
public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
    return ResponseEntity.ok(service.buscarPorId(id));
}
```

> ⚠️ **Frontend:** Criar uma página `detalhes-produto.html` ou um modal em `products.html` que chame `GET /api/produtos/{id}` e exiba: nome, descrição, categoria, fornecedor, preço normal, preço com desconto (se houver compra coletiva ativa), quantidade mínima, prazo e status. Em `products.js`, adicionar handler de clique no card do produto.

---

#### 1.2 Criação explícita de compra coletiva (RF14)

**Arquivo novo:** `dto/CompraColetivaRequestDTO.java`
```java
package com.nexus.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CompraColetivaRequestDTO(
        @NotNull Long produtoId,
        @NotNull Long fornecedorId,
        @NotNull @Min(1) Integer quantidadeMinima,
        @NotNull @DecimalMin("0.01") BigDecimal precoOriginal,
        @NotNull @DecimalMin("0.01") BigDecimal precoComDesconto,
        @NotNull LocalDateTime dataLimite
) {}
```

**Arquivo novo:** `service/CompraColetivaService.java`
```java
package com.nexus.backend.service;

import com.nexus.backend.dto.CompraColetivaRequestDTO;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import com.nexus.backend.model.*;
import com.nexus.backend.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompraColetivaService {

    private final CompraColetivaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;

    public CompraColetivaService(CompraColetivaRepository repository,
                                  ProdutoRepository produtoRepository,
                                  FornecedorRepository fornecedorRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    public List<CompraColetiva> listarTodas() {
        return repository.findAll();
    }

    public List<CompraColetiva> listarAbertas() {
        return repository.findByStatusIn(
                List.of(StatusCompraColetiva.ABERTA, StatusCompraColetiva.EM_ANDAMENTO));
    }

    public CompraColetiva buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compra coletiva não encontrada"));
    }

    @Transactional
    public CompraColetiva criarCompraColetiva(CompraColetivaRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));

        if (dto.dataLimite().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data limite deve ser no futuro.");
        }

        CompraColetiva compra = new CompraColetiva();
        compra.setProduto(produto);
        compra.setFornecedor(fornecedor);
        compra.setQuantidadeMinima(dto.quantidadeMinima());
        compra.setPrecoOriginal(dto.precoOriginal());
        compra.setPrecoComDesconto(dto.precoComDesconto());
        compra.setDataLimite(dto.dataLimite());

        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva editar(Long id, CompraColetivaRequestDTO dto) {
        CompraColetiva compra = buscarPorId(id);

        if (dto.quantidadeMinima() != null) compra.setQuantidadeMinima(dto.quantidadeMinima());
        if (dto.precoOriginal() != null) compra.setPrecoOriginal(dto.precoOriginal());
        if (dto.precoComDesconto() != null) compra.setPrecoComDesconto(dto.precoComDesconto());
        if (dto.dataLimite() != null) compra.setDataLimite(dto.dataLimite());

        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva cancelar(Long id) {
        CompraColetiva compra = buscarPorId(id);
        compra.setStatus(StatusCompraColetiva.CANCELADA);
        return repository.save(compra);
    }

    @Transactional
    public CompraColetiva finalizar(Long id) {
        CompraColetiva compra = buscarPorId(id);
        compra.setStatus(StatusCompraColetiva.FINALIZADA);
        return repository.save(compra);
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void expirarComprasVencidas() {
        List<CompraColetiva> abertas = repository.findByStatusIn(
                List.of(StatusCompraColetiva.ABERTA, StatusCompraColetiva.EM_ANDAMENTO));

        LocalDateTime agora = LocalDateTime.now();
        for (CompraColetiva compra : abertas) {
            if (compra.getDataLimite() != null && agora.isAfter(compra.getDataLimite())) {
                compra.setStatus(StatusCompraColetiva.EXPIRADA);
                repository.save(compra);
            }
        }
    }
}
```

**Arquivo:** `controller/CompraColetivaController.java` — reescrever:
```java
package com.nexus.backend.controller;

import com.nexus.backend.dto.CompraColetivaRequestDTO;
import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.service.CompraColetivaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras-coletivas")
public class CompraColetivaController {

    private final CompraColetivaService service;

    public CompraColetivaController(CompraColetivaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CompraColetiva>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<CompraColetiva>> listarAbertas() {
        return ResponseEntity.ok(service.listarAbertas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraColetiva> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<CompraColetiva> criar(@Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(service.criarCompraColetiva(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CompraColetiva> editar(@PathVariable Long id, @Valid @RequestBody CompraColetivaRequestDTO dto) {
        return ResponseEntity.ok(service.editar(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<CompraColetiva> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelar(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<CompraColetiva> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(service.finalizar(id));
    }
}
```

> ⚠️ **Frontend:** Em `comprasColetivas.html` / `comprasColetivas.js`, adicionar formulário/modal para criação e edição de compra coletiva (visível apenas para FORNECEDOR/ADMIN). Campos: produto, fornecedor, quantidade mínima, preço original, preço com desconto, data limite. Para edição, preencher o formulário com dados existentes e usar `PUT /api/compras-coletivas/{id}`.

---

#### 1.3 Dashboard completo (RF22, RF25, RF26)

**Arquivo:** `service/DashboardService.java` — expandir `obterResumo()`:
```java
public Map<String, Object> obterResumo() {
    List<CompraColetiva> compras = compraColetivaRepository.findAll();
    LocalDateTime agora = LocalDateTime.now();

    long totalProdutos = produtoRepository.count();
    long totalFornecedores = fornecedorRepository.count();

    List<CompraColetiva> abertas = compras.stream()
            .filter(c -> c.getStatus() == StatusCompraColetiva.ABERTA
                      || c.getStatus() == StatusCompraColetiva.EM_ANDAMENTO)
            .toList();

    long metasProximas = abertas.stream().filter(c -> {
        if (c.getQuantidadeMinima() == null || c.getQuantidadeMinima() == 0) return false;
        double progresso = (double) c.getQuantidadeAtual() / c.getQuantidadeMinima();
        return progresso >= 0.75 && progresso < 1.0;
    }).count();

    List<CompraColetiva> proximasDoPrazo = abertas.stream().filter(c -> {
        if (c.getDataLimite() == null) return false;
        long horasRestantes = java.time.Duration.between(agora, c.getDataLimite()).toHours();
        return horasRestantes > 0 && horasRestantes <= 48;
    }).toList();

    long totalParticipantes = participacaoRepository.count();

    BigDecimal economiaGerada = compras.stream()
            .map(c -> {
                BigDecimal original = c.getPrecoOriginal() != null ? c.getPrecoOriginal() : BigDecimal.ZERO;
                BigDecimal desconto = c.getPrecoComDesconto() != null ? c.getPrecoComDesconto() : BigDecimal.ZERO;
                int qtd = c.getQuantidadeAtual() != null ? c.getQuantidadeAtual() : 0;
                return original.subtract(desconto).multiply(new BigDecimal(qtd));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    Map<String, Object> resumo = new HashMap<>();
    resumo.put("totalProdutos", totalProdutos);
    resumo.put("totalFornecedores", totalFornecedores);
    resumo.put("totalParticipantes", totalParticipantes);
    resumo.put("metasProximas", metasProximas);
    resumo.put("economiaGerada", economiaGerada);
    resumo.put("comprasRecentes", abertas);
    resumo.put("comprasProximasDoPrazo", proximasDoPrazo);

    return resumo;
}
```

Adicionar `@Autowired private ParticipacaoRepository participacaoRepository;` no service.

> ⚠️ **Frontend:** Em `dashboard.js`, consumir os novos campos `totalParticipantes` e `comprasProximasDoPrazo`. Criar uma seção em `dashboard.html` para "Compras próximas do prazo" com destaque visual (badge amarelo/vermelho).

---

### 🟢 FASE 2 — Funcionalidades Desejáveis do MVP

#### 2.1 Faixas de preço regressivas (RF13)

> ℹ️ **Nota:** `FaixaPrecoService` e `FaixaPrecoRepository` já existem na codebase. Falta apenas o controller com endpoints REST.

**Arquivo existente:** `repository/FaixaPrecoRepository.java` — ✅ já implementado

**Arquivo:** `service/FaixaPrecoService.java` — adicionar métodos `listarPorProduto` e `criar`:
```java
public List<FaixaPreco> listarPorProduto(Long produtoId) {
    return faixaRepo.findByProdutoIdOrderByQuantidadeMinimaAsc(produtoId);
}

@Transactional
public FaixaPreco criar(Long produtoId, FaixaPreco faixa) {
    Produto produto = produtoRepo.findById(produtoId)
            .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
    faixa.setProduto(produto);
    return faixaRepo.save(faixa);
}
```

**Arquivo novo:** `controller/FaixaPrecoController.java`
```java
package com.nexus.backend.controller;

import com.nexus.backend.model.FaixaPreco;
import com.nexus.backend.service.FaixaPrecoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/faixas-preco")
public class FaixaPrecoController {

    private final FaixaPrecoService service;

    public FaixaPrecoController(FaixaPrecoService service) {
        this.service = service;
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<FaixaPreco>> listarPorProduto(@PathVariable Long produtoId) {
        return ResponseEntity.ok(service.listarPorProduto(produtoId));
    }

    @PreAuthorize("hasAnyRole('FORNECEDOR', 'ADMIN')")
    @PostMapping("/produto/{produtoId}")
    public ResponseEntity<FaixaPreco> criar(@PathVariable Long produtoId, @RequestBody FaixaPreco faixa) {
        return ResponseEntity.ok(service.criar(produtoId, faixa));
    }

    @GetMapping("/produto/{produtoId}/calcular")
    public ResponseEntity<BigDecimal> calcularPreco(@PathVariable Long produtoId, @RequestParam int quantidade) {
        return ResponseEntity.ok(service.calcularPrecoParaQuantidade(produtoId, quantidade));
    }
}
```

> ⚠️ **Frontend:** Na página de detalhes do produto (a ser criada), exibir uma tabela com as faixas de preço. Em `comprasColetivas.js`, ao informar a quantidade, chamar `GET /api/faixas-preco/produto/{id}/calcular?quantidade=X` para mostrar o preço estimado dinamicamente.

---

#### 2.2 Área administrativa — Gerenciar usuários (RF31)

**Arquivo novo:** `controller/AdminUsuarioController.java`
```java
package com.nexus.backend.controller;

import com.nexus.backend.model.Usuario;
import com.nexus.backend.repository.UsuarioRepository;
import com.nexus.backend.exceptions.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUsuarioController {

    private final UsuarioRepository repository;

    public AdminUsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<Page<Usuario>> listar(Pageable pageable) {
        return ResponseEntity.ok(repository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        Usuario u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return ResponseEntity.ok(u);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Usuario> alterarStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Usuario u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        u.setStatus(body.get("status"));
        return ResponseEntity.ok(repository.save(u));
    }
}
```

> ⚠️ **Frontend:** Criar página `admin.html` com listagem de usuários em tabela, com ações de ativar/inativar. Proteger a rota verificando se o perfil no `localStorage` é `ADMIN`.

---

#### 2.3 Gerenciar fornecedores completo (RF33)

**Arquivo:** `service/FornecedorService.java` — adicionar:
```java
@Transactional
public Fornecedor atualizar(Long id, Fornecedor fAtualizado) {
    Fornecedor f = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));

    f.setNome(fAtualizado.getNome());
    f.setTelefone(fAtualizado.getTelefone());
    f.setCategoria(fAtualizado.getCategoria());
    f.setDescricao(fAtualizado.getDescricao());
    f.setStatus(fAtualizado.getStatus());

    return repo.save(f);
}

public void excluir(Long id) {
    Fornecedor f = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));
    repo.delete(f);
}
```

**Arquivo:** `controller/FornecedorController.java` — adicionar:
```java
@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{id}")
public ResponseEntity<Object> atualizar(@PathVariable Long id, @RequestBody Fornecedor f) {
    return ResponseEntity.ok(service.atualizar(id, f));
}

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> excluir(@PathVariable Long id) {
    service.excluir(id);
    return ResponseEntity.noContent().build();
}
```

> ⚠️ **Frontend:** Em `fornecedor.html` / `fornecedor.js`, adicionar botões de editar e excluir visíveis apenas para ADMIN.

---

---

### 🔵 FASE 3 — Gamificação (Baixa Prioridade)

#### 3.1 Sistema de Badges (RF27, RF28)

As tabelas `badge` e `usuario_badge` já existem no banco (V3). As entities `Badge` e `UsuarioBadge` precisam ser criadas.

**Arquivo novo:** `model/Badge.java`
```java
package com.nexus.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "badge")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;
    private String criterio;
    private String icone;

    public Badge() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCriterio() { return criterio; }
    public void setCriterio(String criterio) { this.criterio = criterio; }

    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }
}
```

**Arquivo novo:** `model/UsuarioBadge.java`
```java
package com.nexus.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_badge")
public class UsuarioBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    private LocalDateTime dataConquista;

    @PrePersist
    public void antesDeSalvar() {
        if (this.dataConquista == null) this.dataConquista = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }

    public LocalDateTime getDataConquista() { return dataConquista; }
    public void setDataConquista(LocalDateTime dataConquista) { this.dataConquista = dataConquista; }
}
```

**Arquivos novos:** `repository/BadgeRepository.java` e `repository/UsuarioBadgeRepository.java`

```java
package com.nexus.backend.repository;

import com.nexus.backend.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<Badge, Long> {}
```

```java
package com.nexus.backend.repository;

import com.nexus.backend.model.UsuarioBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioBadgeRepository extends JpaRepository<UsuarioBadge, Long> {
    List<UsuarioBadge> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndBadgeId(Long usuarioId, Long badgeId);
}
```

**Arquivo novo:** `service/BadgeService.java`
```java
package com.nexus.backend.service;

import com.nexus.backend.model.*;
import com.nexus.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepo;
    private final UsuarioBadgeRepository usuarioBadgeRepo;
    private final ParticipacaoRepository participacaoRepo;

    public BadgeService(BadgeRepository badgeRepo, UsuarioBadgeRepository usuarioBadgeRepo,
                        ParticipacaoRepository participacaoRepo) {
        this.badgeRepo = badgeRepo;
        this.usuarioBadgeRepo = usuarioBadgeRepo;
        this.participacaoRepo = participacaoRepo;
    }

    public List<UsuarioBadge> listarBadgesDoUsuario(Long usuarioId) {
        return usuarioBadgeRepo.findByUsuarioId(usuarioId);
    }

    @Transactional
    public void avaliarBadges(Usuario usuario) {
        long totalParticipacoes = participacaoRepo.findByUsuarioEmailOrderByDataParticipacaoDesc(
                usuario.getEmail()).size();

        concederSeNecessario(usuario, 1L, totalParticipacoes >= 1);
        concederSeNecessario(usuario, 2L, totalParticipacoes >= 5);
    }

    private void concederSeNecessario(Usuario usuario, Long badgeId, boolean condicao) {
        if (condicao && !usuarioBadgeRepo.existsByUsuarioIdAndBadgeId(usuario.getId(), badgeId)) {
            Badge badge = badgeRepo.findById(badgeId).orElse(null);
            if (badge != null) {
                UsuarioBadge ub = new UsuarioBadge();
                ub.setUsuario(usuario);
                ub.setBadge(badge);
                usuarioBadgeRepo.save(ub);
            }
        }
    }
}
```

**Arquivo novo:** `controller/BadgeController.java`
```java
package com.nexus.backend.controller;

import com.nexus.backend.model.Usuario;
import com.nexus.backend.model.UsuarioBadge;
import com.nexus.backend.service.BadgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    private final BadgeService service;

    public BadgeController(BadgeService service) {
        this.service = service;
    }

    @GetMapping("/meus")
    public ResponseEntity<List<UsuarioBadge>> meusBadges(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(service.listarBadgesDoUsuario(usuario.getId()));
    }
}
```

Integrar a avaliação de badges no `ParticipacaoService.salvarParticipacao()`:
```java
@Autowired
private BadgeService badgeService;

badgeService.avaliarBadges(usuario);
```

> ⚠️ **Frontend:** Em `user.html` / `user.js`, adicionar uma seção "Minhas Conquistas" que chame `GET /api/badges/meus` e exiba os badges com ícone, nome e data de conquista.

---

## 3. Arquivos Novos a Criar

| Camada | Arquivo | Fase | Observação |
|---|---|---|---|
| DTO | `AtualizarPerfilDTO.java` | 1 | |
| Controller | `UsuarioController.java` | 1 | Perfil do usuário |
| DTO | `CompraColetivaRequestDTO.java` | 1 | |
| Service | `CompraColetivaService.java` | 1 | |
| Controller | `FaixaPrecoController.java` | 2 | |
| Controller | `AdminUsuarioController.java` | 2 | |
| Service | `BadgeService.java` | 3 | |
| Controller | `BadgeController.java` | 3 | |
| Repository | `BadgeRepository.java` | 3 | |
| Repository | `UsuarioBadgeRepository.java` | 3 | |
| Model | `Badge.java` | 3 | |
| Model | `UsuarioBadge.java` | 3 |

> ℹ️ `FaixaPrecoService.java` e `FaixaPrecoRepository.java` já existem na codebase — precisam apenas de métodos adicionais (`listarPorProduto`, `criar`).

---

## 4. Impacto no Frontend — Resumo

| Alteração Backend | Arquivo Frontend Impactado | O que fazer | Fase |
|---|---|---|---|
| `GET /api/usuario/perfil` | `user.js` | Buscar dados do perfil via API em vez de depender só do localStorage | 1 |
| `PUT /api/usuario/perfil` | `user.js` | Enviar atualização do perfil para o backend | 1 |
| `GET /api/produtos/{id}` | `products.js` + nova página ou modal | Criar visualização de detalhes do produto com faixas de preço | 1 |
| `POST /api/compras-coletivas` | `comprasColetivas.js` / `comprasColetivas.html` | Adicionar formulário de criação (FORNECEDOR/ADMIN) | 1 |
| `PUT /api/compras-coletivas/{id}` | `comprasColetivas.js` / `comprasColetivas.html` | Adicionar edição de compra coletiva (ADMIN) | 1 |
| Dashboard expandido | `dashboard.js` / `dashboard.html` | Consumir `comprasProximasDoPrazo`, `totalParticipantes` | 1 |
| `GET /api/badges/meus` | `user.html` / `user.js` | Criar seção "Minhas Conquistas" | 3 |
| Admin: gerenciar usuários | Nova página `admin.html` | Criar tela com tabela de usuários e ações | 2 |
| Admin: editar/excluir fornecedores | `fornecedor.js` | Adicionar botões de edição/exclusão para ADMIN | 2 |

---

## 5. Observações Técnicas

1. **Serialização circular:** As entities `CompraColetiva` → `Produto` → `Fornecedor` podem gerar recursão infinita no JSON. Considerar adicionar `@JsonIgnoreProperties` ou criar DTOs de resposta para os endpoints que retornam entidades com relacionamentos.

2. **Paginação no `CompraColetivaController`:** O endpoint atual retorna `List` e não `Page`. Para a listagem geral, considerar usar `Pageable` e retornar `Page<CompraColetiva>` para evitar carregar todas as compras em memória.

3. **`@EnableScheduling`:** Para que o `@Scheduled(fixedRate = 3600000)` de `expirarComprasVencidas()` funcione, a classe principal `BackendApplication.java` precisa ter `@EnableScheduling`.
