document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DO DOM ---
    const tabelaCompras = document.getElementById("tabelaCompras");
    const detailsModal = document.getElementById("detailsModal");
    const closeDetailsModal = document.getElementById("closeDetailsModal");
    const closeDetailsModalBottom = document.getElementById("closeDetailsModalBottom");

    const detailsProduct = document.getElementById("detailsProduct");
    const detailsSupplier = document.getElementById("detailsSupplier");
    const detailsQuantity = document.getElementById("detailsQuantity");
    const detailsDeadline = document.getElementById("detailsDeadline");
    const detailsStatus = document.getElementById("detailsStatus");
    const detailsValue = document.getElementById("detailsValue");
    const detailsSavings = document.getElementById("detailsSavings");
    const detailsProgressText = document.getElementById("detailsProgressText");
    const detailsProgressBar = document.getElementById("detailsProgressBar");
    const detailsNextStep = document.getElementById("detailsNextStep");

    let minhasComprasReais = [];

    // --- LIGAÇÃO À API ---
    async function carregarMinhasCompras() {
        const token = localStorage.getItem('nexusToken');

        try {
            const response = await fetch('http://localhost:8080/api/participacao/minhas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const dadosDoBanco = await response.json();
                
                // Mapeia os dados aninhados do Spring Boot para um formato fácil de usar
                minhasComprasReais = dadosDoBanco.map(p => {
                    const compra = p.compraColetiva;
                    const produto = compra.produto;
                    const fornecedorNome = compra.fornecedor ? compra.fornecedor.nome : "Fornecedor Parceiro";
                    
                    let progresso = compra.quantidadeMinima > 0 ? Math.floor((compra.quantidadeAtual / compra.quantidadeMinima) * 100) : 0;
                    if (progresso > 100) progresso = 100;
                    
                    const statusCalculado = compra.status === "META_ATINGIDA" ? "Meta atingida" : (progresso >= 75 ? "Meta próxima" : "Em andamento");
                    
                    // Cálculo da economia: (Preço Original - Preço Desconto) * Quantidade Participada
                    const economiaCalculada = (compra.precoOriginal - compra.precoComDesconto) * p.quantidade;

                    return {
                        id: p.id,
                        produto: produto.nome,
                        fornecedor: fornecedorNome,
                        quantidade: `${p.quantidade} un`,
                        progresso: progresso,
                        prazo: "Até concluir meta", 
                        status: statusCalculado,
                        valor: p.valorEstimado,
                        economia: economiaCalculada
                    };
                });

                atualizarKPIs();
                carregarTabela(minhasComprasReais);

            } else {
                console.error("Erro ao carregar participações:", response.status);
            }
        } catch (error) {
            console.error("Falha na ligação à API:", error);
        }
    }

    // --- ATUALIZAR INDICADORES NUMÉRICOS (KPIS) ---
    function atualizarKPIs() {
        const statTotalParticipacoes = document.getElementById("statTotalParticipacoes");
        const statMetasAtingidas = document.getElementById("statMetasAtingidas");
        const statValorTotal = document.getElementById("statValorTotal");
        const statEconomiaTotal = document.getElementById("statEconomiaTotal");
        const badgeTotalCompras = document.getElementById("badgeTotalCompras");

        if (statTotalParticipacoes) statTotalParticipacoes.textContent = minhasComprasReais.length;
        if (badgeTotalCompras) badgeTotalCompras.textContent = `${minhasComprasReais.length} compras`;

        const metasAtingidas = minhasComprasReais.filter(c => c.status === "Meta atingida").length;
        if (statMetasAtingidas) statMetasAtingidas.textContent = metasAtingidas;

        const valorTotal = minhasComprasReais.reduce((acc, curr) => acc + curr.valor, 0);
        if (statValorTotal) statValorTotal.textContent = formatarMoeda(valorTotal);

        const economiaTotal = minhasComprasReais.reduce((acc, curr) => acc + curr.economia, 0);
        if (statEconomiaTotal) statEconomiaTotal.textContent = formatarMoeda(economiaTotal);
    }

    // --- UTILITÁRIOS ---
    const formatarMoeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

    function definirStatusClass(status) {
        if (status === "Meta atingida") return "bg-green-100 text-green-700";
        if (status === "Meta próxima") return "bg-yellow-100 text-yellow-700";
        return "bg-blue-100 text-blue-700";
    }

    function definirProximoPasso(compra) {
        if (compra.status === "Meta atingida") return "A meta foi atingida. Aguarde a confirmação do fornecedor para fechamento da compra coletiva.";
        if (compra.status === "Meta próxima") return "A compra está próxima da meta. Você pode acompanhar o progresso e aguardar novas participações.";
        return "A compra ainda está em andamento. Continue acompanhando até que a meta mínima seja alcançada.";
    }

    // --- RENDERIZAÇÃO DA TABELA ---
    function carregarTabela(compras) {
        if (!tabelaCompras) return;
        tabelaCompras.innerHTML = "";

        if (compras.length === 0) {
            tabelaCompras.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-sm text-nexus-muted">
                        Você ainda não participou de nenhuma compra coletiva.
                    </td>
                </tr>
            `;
            return;
        }

        compras.forEach((compra) => {
            const linha = document.createElement("tr");
            linha.className = "transition-all duration-300 hover:bg-nexus-background";

            linha.innerHTML = `
                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">${compra.produto}</td>
                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.fornecedor}</td>
                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.quantidade}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-nexus-light">
                            <div class="h-full rounded-full bg-nexus-primary" style="width: ${compra.progresso}%"></div>
                        </div>
                        <span class="text-sm text-nexus-muted">${compra.progresso}%</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.prazo}</td>
                <td class="px-6 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-medium ${definirStatusClass(compra.status)}">${compra.status}</span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">${formatarMoeda(compra.valor)}</td>
                <td class="px-6 py-4">
                    <button type="button" class="view-details text-sm font-semibold text-nexus-primary transition-colors hover:text-nexus-dark cursor-pointer" data-id="${compra.id}">
                        Ver detalhes
                    </button>
                </td>
            `;
            tabelaCompras.appendChild(linha);
        });

        // Adiciona eventos aos botões recém-criados
        document.querySelectorAll(".view-details").forEach((botao) => {
            botao.addEventListener("click", () => {
                const compra = minhasComprasReais.find(item => item.id === Number(botao.dataset.id));
                if (compra) abrirModalDetalhes(compra);
            });
        });
    }

    // --- MODAL DE DETALHES ---
    function abrirModalDetalhes(compra) {
        if (!detailsModal) return;

        detailsProduct.textContent = compra.produto;
        detailsSupplier.textContent = compra.fornecedor;
        detailsQuantity.textContent = compra.quantidade;
        detailsDeadline.textContent = compra.prazo;
        detailsValue.textContent = formatarMoeda(compra.valor);
        detailsSavings.textContent = formatarMoeda(compra.economia);
        detailsProgressText.textContent = `${compra.progresso}%`;
        detailsProgressBar.style.width = `${compra.progresso}%`;
        detailsNextStep.textContent = definirProximoPasso(compra);

        detailsStatus.textContent = compra.status;
        detailsStatus.className = `mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${definirStatusClass(compra.status)}`;

        detailsModal.classList.remove("hidden");
        detailsModal.classList.add("flex");
    }

    function fecharModalDetalhes() {
        if (!detailsModal) return;
        detailsModal.classList.add("hidden");
        detailsModal.classList.remove("flex");
    }

    // --- EVENT LISTENERS GERAIS ---
    if (closeDetailsModal) closeDetailsModal.addEventListener("click", fecharModalDetalhes);
    if (closeDetailsModalBottom) closeDetailsModalBottom.addEventListener("click", fecharModalDetalhes);
    if (detailsModal) detailsModal.addEventListener("click", (e) => { if (e.target === detailsModal) fecharModalDetalhes(); });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") fecharModalDetalhes();
    });

    // Arranca a busca de dados assim que a página carrega
    carregarMinhasCompras();
});