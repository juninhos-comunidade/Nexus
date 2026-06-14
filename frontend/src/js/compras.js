document.addEventListener("DOMContentLoaded", () => {
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

    const minhasCompras = [
        {
            id: 1,
            produto: "Arroz 5kg",
            fornecedor: "Distribuidora Central",
            quantidade: "20 un",
            progresso: 75,
            prazo: "5 dias",
            status: "Em andamento",
            valor: 490.00,
            economia: 98.00
        },
        {
            id: 2,
            produto: "Café 500g",
            fornecedor: "Cafés Premium",
            quantidade: "15 un",
            progresso: 100,
            prazo: "2 dias",
            status: "Meta atingida",
            valor: 247.50,
            economia: 49.50
        },
        {
            id: 3,
            produto: "Leite em pó 400g",
            fornecedor: "Laticínios Brasil",
            quantidade: "25 un",
            progresso: 65,
            prazo: "6 dias",
            status: "Em andamento",
            valor: 497.50,
            economia: 99.50
        },
        {
            id: 4,
            produto: "Feijão 1kg",
            fornecedor: "Grãos do Vale",
            quantidade: "30 un",
            progresso: 90,
            prazo: "3 dias",
            status: "Meta próxima",
            valor: 216.00,
            economia: 43.00
        },
        {
            id: 5,
            produto: "Óleo de Soja 900ml",
            fornecedor: "Distribuidora Central",
            quantidade: "18 un",
            progresso: 50,
            prazo: "4 dias",
            status: "Em andamento",
            valor: 153.00,
            economia: 30.00
        }
    ];

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function definirStatus(status) {
        if (status === "Meta atingida") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Meta próxima") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-blue-100 text-blue-700";
    }

    function definirProximoPasso(compra) {
        if (compra.status === "Meta atingida") {
            return "A meta foi atingida. Aguarde a confirmação do fornecedor para fechamento da compra coletiva.";
        }

        if (compra.status === "Meta próxima") {
            return "A compra está próxima da meta. Você pode acompanhar o progresso e aguardar novas participações.";
        }

        return "A compra ainda está em andamento. Continue acompanhando até que a meta mínima seja alcançada.";
    }

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
        detailsStatus.className = `mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${definirStatus(compra.status)}`;

        detailsModal.classList.remove("hidden");
        detailsModal.classList.add("flex");

        if (typeof createNotification === "function") {
            createNotification({
                title: "Detalhes visualizados",
                message: `Você visualizou os detalhes da compra de ${compra.produto}.`,
                type: "purchase"
            });
        }
    }

    function fecharModalDetalhes() {
        if (!detailsModal) return;

        detailsModal.classList.add("hidden");
        detailsModal.classList.remove("flex");
    }

    function adicionarEventosDetalhes() {
        const botoesDetalhes = document.querySelectorAll(".view-details");

        botoesDetalhes.forEach((botao) => {
            botao.addEventListener("click", () => {
                const compraId = Number(botao.dataset.id);

                const compra = minhasCompras.find((item) => {
                    return item.id === compraId;
                });

                if (compra) {
                    abrirModalDetalhes(compra);
                }
            });
        });
    }

    function carregarTabela() {
        if (!tabelaCompras) return;

        tabelaCompras.innerHTML = "";

        minhasCompras.forEach((compra) => {
            const linha = document.createElement("tr");

            linha.className = "transition-all duration-300 hover:bg-nexus-background";

            linha.innerHTML = `
                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">
                    ${compra.produto}
                </td>

                <td class="px-6 py-4 text-sm text-nexus-muted">
                    ${compra.fornecedor}
                </td>

                <td class="px-6 py-4 text-sm text-nexus-muted">
                    ${compra.quantidade}
                </td>

                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-nexus-light">
                            <div class="h-full rounded-full bg-nexus-primary" style="width: ${compra.progresso}%"></div>
                        </div>

                        <span class="text-sm text-nexus-muted">
                            ${compra.progresso}%
                        </span>
                    </div>
                </td>

                <td class="px-6 py-4 text-sm text-nexus-muted">
                    ${compra.prazo}
                </td>

                <td class="px-6 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-medium ${definirStatus(compra.status)}">
                        ${compra.status}
                    </span>
                </td>

                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">
                    ${formatarMoeda(compra.valor)}
                </td>

                <td class="px-6 py-4">
                    <button 
                        type="button" 
                        class="view-details text-sm font-semibold text-nexus-primary transition-colors hover:text-nexus-dark"
                        data-id="${compra.id}"
                    >
                        Ver detalhes
                    </button>
                </td>
            `;

            tabelaCompras.appendChild(linha);
        });

        adicionarEventosDetalhes();
    }

    if (closeDetailsModal) {
        closeDetailsModal.addEventListener("click", fecharModalDetalhes);
    }

    if (closeDetailsModalBottom) {
        closeDetailsModalBottom.addEventListener("click", fecharModalDetalhes);
    }

    if (detailsModal) {
        detailsModal.addEventListener("click", (event) => {
            if (event.target === detailsModal) {
                fecharModalDetalhes();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharModalDetalhes();
        }
    });

    carregarTabela();
});