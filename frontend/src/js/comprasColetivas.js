document.addEventListener("DOMContentLoaded", () => {
    const collectivePurchasesTable = document.getElementById("collectivePurchasesTable");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");

    const availablePurchasesCount = document.getElementById("availablePurchasesCount");
    const nearGoalCount = document.getElementById("nearGoalCount");
    const goalReachedCount = document.getElementById("goalReachedCount");
    const potentialSavings = document.getElementById("potentialSavings");

    const topbarSearch = document.getElementById("topbarSearch");
    const purchaseSearch = document.getElementById("purchaseSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const clearFilters = document.getElementById("clearFilters");

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

    let selectedPurchase = null;

    const collectivePurchases = [
        {
            id: 1,
            product: "Arroz 5kg",
            description: "Pacote fechado para revenda",
            category: "Alimentos",
            supplier: "Distribuidora Central",
            collectivePrice: 24.50,
            basePrice: 27.00,
            goal: 100,
            progress: 75,
            status: "Em andamento"
        },
        {
            id: 2,
            product: "Café 500g",
            description: "Linha premium para mercados locais",
            category: "Alimentos",
            supplier: "Cafés Premium",
            collectivePrice: 16.90,
            basePrice: 19.00,
            goal: 80,
            progress: 100,
            status: "Meta atingida"
        },
        {
            id: 3,
            product: "Feijão 1kg",
            description: "Grãos selecionados para revenda",
            category: "Alimentos",
            supplier: "Grãos do Vale",
            collectivePrice: 7.20,
            basePrice: 8.00,
            goal: 90,
            progress: 90,
            status: "Meta próxima"
        },
        {
            id: 4,
            product: "Detergente 500ml",
            description: "Caixa com unidades para comércio local",
            category: "Limpeza",
            supplier: "Limpeza Forte",
            collectivePrice: 2.80,
            basePrice: 3.30,
            goal: 200,
            progress: 55,
            status: "Em andamento"
        },
        {
            id: 5,
            product: "Copo descartável 200ml",
            description: "Pacote para bares e pequenos comércios",
            category: "Embalagens",
            supplier: "EmbalaMax",
            collectivePrice: 5.40,
            basePrice: 6.10,
            goal: 150,
            progress: 88,
            status: "Meta próxima"
        },
        {
            id: 6,
            product: "Sabonete 85g",
            description: "Produto de higiene para giro rápido",
            category: "Higiene",
            supplier: "Higiene Popular",
            collectivePrice: 2.10,
            basePrice: 2.45,
            goal: 180,
            progress: 70,
            status: "Em andamento"
        }
    ];

    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function getStatusClass(status) {
        if (status === "Meta atingida") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Meta próxima") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-blue-100 text-blue-700";
    }

    function updateSummary() {
        const available = collectivePurchases.length;
        const nearGoals = collectivePurchases.filter((purchase) => purchase.status === "Meta próxima").length;
        const reachedGoals = collectivePurchases.filter((purchase) => purchase.status === "Meta atingida").length;

        const savings = collectivePurchases.reduce((total, purchase) => {
            return total + (purchase.basePrice - purchase.collectivePrice) * purchase.goal;
        }, 0);

        availablePurchasesCount.textContent = available;
        nearGoalCount.textContent = nearGoals;
        goalReachedCount.textContent = reachedGoals;
        potentialSavings.textContent = formatCurrency(savings);
    }

    function renderPurchases(purchases) {
        collectivePurchasesTable.innerHTML = "";

        if (resultCount) {
            resultCount.textContent = `${purchases.length} compras`;
        }

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

                <td class="px-6 py-5 text-sm text-nexus-muted">
                    ${purchase.category}
                </td>

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

                <td class="px-6 py-5 text-sm text-nexus-muted">
                    ${purchase.goal} unidades
                </td>

                <td class="px-6 py-5">
                    <div class="flex min-w-36 items-center gap-3">
                        <div class="h-2 w-24 overflow-hidden rounded-full bg-nexus-light">
                            <div class="h-full rounded-full bg-nexus-primary" style="width: ${purchase.progress}%"></div>
                        </div>

                        <span class="text-xs font-semibold text-nexus-primary">
                            ${purchase.progress}%
                        </span>
                    </div>
                </td>

                <td class="px-6 py-5">
                    <span class="rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(purchase.status)}">
                        ${purchase.status}
                    </span>
                </td>

                <td class="px-6 py-5">
                    <button
                        class="join-purchase rounded-xs border border-nexus-primary/30 px-4 py-1.5 text-xs font-semibold text-nexus-primary transition-all duration-300 cursor-pointer hover:bg-nexus-primary hover:text-white"
                        data-id="${purchase.id}"
                    >
                        Participar
                    </button>
                </td>
            `;

            collectivePurchasesTable.appendChild(row);
        });

        document.querySelectorAll(".join-purchase").forEach((button) => {
            button.addEventListener("click", () => {
                const purchaseId = Number(button.dataset.id);
                openJoinModal(purchaseId);
            });
        });
    }

    function filterPurchases() {
        const searchValue = purchaseSearch.value.toLowerCase().trim();
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;

        const filteredPurchases = collectivePurchases.filter((purchase) => {
            const matchesSearch =
                purchase.product.toLowerCase().includes(searchValue) ||
                purchase.description.toLowerCase().includes(searchValue) ||
                purchase.supplier.toLowerCase().includes(searchValue);

            const matchesCategory =
                categoryValue === "Todos" || purchase.category === categoryValue;

            const matchesStatus =
                statusValue === "Todos" || purchase.status === statusValue;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        renderPurchases(filteredPurchases);
    }

    function clearAllFilters() {
        purchaseSearch.value = "";
        topbarSearch.value = "";
        categoryFilter.value = "Todos";
        statusFilter.value = "Todos";

        renderPurchases(collectivePurchases);
    }

    function openJoinModal(purchaseId) {
        selectedPurchase = collectivePurchases.find((purchase) => purchase.id === purchaseId);

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

    function showToast(message) {
        successToast.textContent = message;
        successToast.classList.remove("hidden");

        setTimeout(() => {
            successToast.classList.add("hidden");
        }, 2500);
    }

    function confirmJoinPurchase(event) {
        event.preventDefault();

        const quantity = Number(joinQuantity.value);

        if (!quantity || quantity <= 0) {
            joinError.classList.remove("hidden");
            return;
        }

        const productName = selectedPurchase.product;

        closeJoinModalBox();
        showToast("Participação confirmada com sucesso.");

        if (typeof createNotification === "function") {
            createNotification({
                title: "Participação confirmada",
                message: `Você entrou na compra coletiva de ${productName} com ${quantity} unidade(s).`,
                type: "purchase"
            });
        }
    }

    purchaseSearch.addEventListener("input", () => {
        topbarSearch.value = purchaseSearch.value;
        filterPurchases();
    });

    topbarSearch.addEventListener("input", () => {
        purchaseSearch.value = topbarSearch.value;
        filterPurchases();
    });

    categoryFilter.addEventListener("change", filterPurchases);
    statusFilter.addEventListener("change", filterPurchases);
    clearFilters.addEventListener("click", clearAllFilters);

    closeJoinModal.addEventListener("click", closeJoinModalBox);
    cancelJoinModal.addEventListener("click", closeJoinModalBox);
    joinPurchaseForm.addEventListener("submit", confirmJoinPurchase);

    joinModalOverlay.addEventListener("click", (event) => {
        if (event.target === joinModalOverlay) {
            closeJoinModalBox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeJoinModalBox();
        }
    });

    updateSummary();
    renderPurchases(collectivePurchases);
});