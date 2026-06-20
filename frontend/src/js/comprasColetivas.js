document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DO DOM ---
    const collectivePurchasesTable = document.getElementById("collectivePurchasesTable");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");

    // KPIs (Indicadores)
    const availablePurchasesCount = document.getElementById("availablePurchasesCount");
    const nearGoalCount = document.getElementById("nearGoalCount");
    const goalReachedCount = document.getElementById("goalReachedCount");
    const potentialSavings = document.getElementById("potentialSavings");

    // Filtros
    const topbarSearch = document.getElementById("topbarSearch");
    const purchaseSearch = document.getElementById("purchaseSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const clearFilters = document.getElementById("clearFilters");

    // Modal de Participação
    const joinModalOverlay = document.getElementById("joinModalOverlay");
    const closeJoinModal = document.getElementById("closeJoinModal");
    const cancelJoinModal = document.getElementById("cancelJoinModal");
    const joinPurchaseForm = document.getElementById("joinPurchaseForm");
    const joinQuantity = document.getElementById("joinQuantity");
    const joinError = document.getElementById("joinError");

    const modalProductName = document.getElementById("modalProductName");
    const modalSupplier = document.getElementById("modalSupplier");
    const modalGoal = document.getElementById("modalGoal");
    const modalProgress = document.getElementById("modalProgress");

    const successToast = document.getElementById("successToast");

    let collectivePurchases = [];
    let selectedPurchase = null;

    // --- FUNÇÕES AUXILIARES ---
    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function getStatusClass(status) {
        if (status === "Meta atingida") return "bg-green-100 text-green-700";
        if (status === "Meta próxima") return "bg-yellow-100 text-yellow-700";
        return "bg-blue-100 text-blue-700";
    }

    function showToast(message) {
        successToast.textContent = message;
        successToast.classList.remove("hidden");
        setTimeout(() => successToast.classList.add("hidden"), 2500);
    }

    // --- LIGAÇÃO À API (SPRING BOOT) ---

async function carregarCompras() {
    const token = localStorage.getItem('nexusToken');

    try {
        const response = await fetch('http://localhost:8080/api/compras-coletivas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const dadosDoBanco = await response.json();
            const listaCompras = dadosDoBanco || [];

            collectivePurchases = listaCompras.map(c => {
                const p = c.produto;
                let progress = 0;
                if (c.quantidadeMinima > 0) {
                    progress = Math.floor((c.quantidadeAtual / c.quantidadeMinima) * 100);
                }
                if (progress > 100) progress = 100;
                
                return {
                    id: p.id,
                    product: p.nome,
                    description: p.descricao || "Sem descrição",
                    category: p.categoria || "Geral",
                    supplier: p.fornecedor ? p.fornecedor.nome : "Fornecedor",
                    collectivePrice: c.precoComDesconto,
                    basePrice: c.precoOriginal,
                    goal: c.quantidadeMinima,
                    progress: progress,
                    status: c.status === "META_ATINGIDA" ? "Meta atingida" : (progress >= 75 ? "Meta próxima" : "Em andamento")
                };
            });

            updateSummary();
            renderPurchases(collectivePurchases);

        } else {
            console.error("Erro ao carregar compras reais:", response.status);
        }
    } catch (error) {
        console.error("Falha na ligação à API:", error);
    }
}

    // --- RENDERIZAÇÃO ---

    function updateSummary() {
        if (!availablePurchasesCount) return;

        const available = collectivePurchases.length;
        const nearGoals = collectivePurchases.filter(p => p.status === "Meta próxima").length;
        const reachedGoals = collectivePurchases.filter(p => p.status === "Meta atingida").length;

        const savings = collectivePurchases.reduce((total, p) => {
            return total + ((p.basePrice - p.collectivePrice) * p.goal);
        }, 0);

        availablePurchasesCount.textContent = available;
        nearGoalCount.textContent = nearGoals;
        goalReachedCount.textContent = reachedGoals;
        potentialSavings.textContent = formatCurrency(savings);
    }

    function renderPurchases(purchases) {
        if (!collectivePurchasesTable) return;
        collectivePurchasesTable.innerHTML = "";

        if (resultCount) resultCount.textContent = `${purchases.length} compras`;

        if (purchases.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        }

        emptyState.classList.add("hidden");

        purchases.forEach((purchase) => {
            const row = document.createElement("tr");
            row.className = "transition-all duration-300 hover:bg-[#F8FFFB]";

            row.innerHTML = `
                <td class="px-6 py-5">
                    <div>
                        <p class="text-sm font-semibold text-nexus-dark">${purchase.product}</p>
                        <span class="mt-1 block text-xs text-nexus-muted">${purchase.description}</span>
                    </div>
                </td>
                <td class="px-6 py-5 text-sm text-nexus-muted">${purchase.category}</td>
                <td class="px-6 py-5">
                    <div>
                        <p class="text-sm font-medium text-nexus-text">${purchase.supplier}</p>
                        <span class="mt-1 block text-xs text-nexus-primary">Fornecedor verificado</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div>
                        <p class="text-sm font-semibold text-nexus-dark">${formatCurrency(purchase.collectivePrice)}</p>
                        <span class="mt-1 block text-xs text-nexus-muted">Base: ${formatCurrency(purchase.basePrice)}</span>
                    </div>
                </td>
                <td class="px-6 py-5 text-sm text-nexus-muted">${purchase.goal} unidades</td>
                <td class="px-6 py-5">
                    <div class="flex min-w-36 items-center gap-3">
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-nexus-light">
                            <div class="h-full rounded-full bg-nexus-primary" style="width: ${purchase.progress > 100 ? 100 : purchase.progress}%"></div>
                        </div>
                        <span class="text-xs font-semibold text-nexus-primary">${purchase.progress}%</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <span class="rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(purchase.status)}">${purchase.status}</span>
                </td>
                <td class="px-6 py-5">
                    <button class="join-purchase rounded-xs border border-nexus-primary/30 px-4 py-1.5 text-xs font-semibold text-nexus-primary transition-all duration-300 cursor-pointer hover:bg-nexus-primary hover:text-white" data-id="${purchase.id}">
                        Participar
                    </button>
                </td>
            `;
            collectivePurchasesTable.appendChild(row);
        });

        document.querySelectorAll(".join-purchase").forEach((button) => {
            button.addEventListener("click", () => openJoinModal(Number(button.dataset.id)));
        });
    }

    // --- FILTROS E MODAIS ---

    function filterPurchases() {
        const searchValue = purchaseSearch ? purchaseSearch.value.toLowerCase().trim() : "";
        const categoryValue = categoryFilter ? categoryFilter.value : "Todos";
        const statusValue = statusFilter ? statusFilter.value : "Todos";

        const filteredPurchases = collectivePurchases.filter((p) => {
            const matchesSearch = p.product.toLowerCase().includes(searchValue) || 
                                  p.description.toLowerCase().includes(searchValue) || 
                                  p.supplier.toLowerCase().includes(searchValue);
            const matchesCategory = categoryValue === "Todos" || p.category === categoryValue;
            const matchesStatus = statusValue === "Todos" || p.status === statusValue;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        renderPurchases(filteredPurchases);
    }

    function clearAllFilters() {
        if (purchaseSearch) purchaseSearch.value = "";
        if (topbarSearch) topbarSearch.value = "";
        if (categoryFilter) categoryFilter.value = "Todos";
        if (statusFilter) statusFilter.value = "Todos";
        renderPurchases(collectivePurchases);
    }

    function openJoinModal(purchaseId) {
        selectedPurchase = collectivePurchases.find((p) => p.id === purchaseId);
        if (!selectedPurchase) return;

        modalProductName.textContent = selectedPurchase.product;
        modalSupplier.textContent = selectedPurchase.supplier;
        modalGoal.textContent = `${selectedPurchase.goal} unidades`;
        modalProgress.textContent = `${selectedPurchase.progress}%`;

        joinQuantity.value = "";
        joinError.classList.add("hidden");
        joinModalOverlay.classList.remove("hidden");
        joinModalOverlay.classList.add("flex");
    }

    function closeJoinModalBox() {
        joinModalOverlay.classList.add("hidden");
        joinModalOverlay.classList.remove("flex");
        selectedPurchase = null;
    }

    async function confirmJoinPurchase(event) {
        event.preventDefault();
        const quantity = Number(joinQuantity.value);

        if (!quantity || quantity <= 0) {
            joinError.classList.remove("hidden");
            return;
        }

        const token = localStorage.getItem('nexusToken');

        try {
            const response = await fetch('http://localhost:8080/api/participacao', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    produtoId: selectedPurchase.id,
                    quantidade: quantity
                })
            });

            if (response.ok) {
                closeJoinModalBox();
                showToast("Participação confirmada com sucesso!");
            } else {
                const err = await response.json();
                alert(err.erro || "Erro ao registar a participação.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Falha de comunicação com o servidor.");
        }
    }

    // --- EVENT LISTENERS ---
    if (purchaseSearch && topbarSearch) {
        purchaseSearch.addEventListener("input", () => { topbarSearch.value = purchaseSearch.value; filterPurchases(); });
        topbarSearch.addEventListener("input", () => { purchaseSearch.value = topbarSearch.value; filterPurchases(); });
    }
    if (categoryFilter) categoryFilter.addEventListener("change", filterPurchases);
    if (statusFilter) statusFilter.addEventListener("change", filterPurchases);
    if (clearFilters) clearFilters.addEventListener("click", clearAllFilters);
    if (closeJoinModal) closeJoinModal.addEventListener("click", closeJoinModalBox);
    if (cancelJoinModal) cancelJoinModal.addEventListener("click", closeJoinModalBox);
    if (joinPurchaseForm) joinPurchaseForm.addEventListener("submit", confirmJoinPurchase);
    if (joinModalOverlay) joinModalOverlay.addEventListener("click", (e) => { if (e.target === joinModalOverlay) closeJoinModalBox(); });
    
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeJoinModalBox(); });

    carregarCompras();
});