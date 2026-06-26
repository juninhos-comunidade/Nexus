document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DO DOM ---
    const modal = document.getElementById("modal");
    const openModalButton = document.getElementById("open-modal");
    const closeModalButton = document.getElementById("close");
    const cancelModalButton = document.getElementById("cancelModal");
    const productForm = document.getElementById("productForm");

    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalSubmitButton = document.getElementById("modalSubmitButton");
    const modalError = document.getElementById("modalError");

    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const productCategoryInput = document.getElementById("productCategory");
    const productPriceInput = document.getElementById("productPrice");
    const productMinQuantityInput = document.getElementById("productMinQuantity");
    const productStatusInput = document.getElementById("productStatus");
    const productDiscountInput = document.getElementById("productDiscount");
    const productDescriptionInput = document.getElementById("productDescription");

    const productsTable = document.getElementById("productsTable");
    const messageContainer = document.getElementById("messageContainer");

    const deleteModal = document.getElementById("deleteModal");
    const deleteProductName = document.getElementById("deleteProductName");
    const closeDeleteModalButton = document.getElementById("closeDeleteModal");
    const cancelDeleteProductButton = document.getElementById("cancelDeleteProduct");
    const confirmDeleteProductButton = document.getElementById("confirmDeleteProduct");

    let modalMode = "create";
    let productIdToDelete = null;
    let productsList = [];

    // --- FUNÇÕES DE LIGAÇÃO À API (SPRING BOOT) ---

    async function carregarProdutosFornecedor() {
        const token = localStorage.getItem('nexusToken');
        const usuario = JSON.parse(localStorage.getItem('usuarioNexus') || '{}');
        const fornecedorId = usuario.fornecedorId || usuario.id || 1;

        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos/fornecedor/${fornecedorId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const dados = await response.json();
                productsList = dados.content || [];
                renderProducts(productsList);
                atualizarKPIs(productsList);
            }
        } catch (error) {
            console.error("Falha de conexão:", error);
        }
    }

    async function saveProduct(event) {
        event.preventDefault();

        const productName = productNameInput.value.trim();
        const productCategory = productCategoryInput.value;
        const productStatus = productStatusInput.value;
        const productDescription = productDescriptionInput.value.trim();
        
        let priceStr = productPriceInput.value.replace(/[^\d,-]/g, '').replace(',', '.');
        let priceFloat = parseFloat(priceStr);

        if (!productName || !productCategory || isNaN(priceFloat)) {
            modalError.textContent = "Preencha todos os campos obrigatórios corretamente.";
            modalError.classList.remove("hidden");
            return;
        }

        const payload = {
            nome: productName,
            categoria: productCategory,
            precoUnitario: priceFloat,
            status: productStatus === "Ativa" ? "DISPONIVEL" : (productStatus === "Pausada" ? "PAUSADO" : "PENDENTE"),
            descricao: productDescription
        };

        const token = localStorage.getItem('nexusToken');
        
        try {
            let url, method;
            if (modalMode === "create") {
                const usuario = JSON.parse(localStorage.getItem('usuarioNexus') || '{}');
                const fornecedorId = usuario.fornecedorId || usuario.id || 1;
                url = `${API_BASE_URL}/api/produtos?fornecedorId=${fornecedorId}`;
                method = 'POST';
            } else {
                url = `${API_BASE_URL}/api/produtos/${productIdInput.value}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                closeModal();
                showMessage(modalMode === "create" ? "Produto cadastrado com sucesso!" : "Produto atualizado com sucesso!", "success");
                carregarProdutosFornecedor(); 
            } else {
                modalError.textContent = "Erro do servidor ao processar o produto.";
                modalError.classList.remove("hidden");
            }
        } catch (error) {
            modalError.textContent = "Falha ao comunicar com a base de dados.";
            modalError.classList.remove("hidden");
        }
    }

    async function confirmDeleteProduct() {
        if (!productIdToDelete) return;
        
        const token = localStorage.getItem('nexusToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos/${productIdToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                closeDeleteModal();
                showMessage("Produto excluído com sucesso!", "success");
                carregarProdutosFornecedor();
            } else {
                alert("Não foi possível excluir. O produto pode ter compras associadas.");
                closeDeleteModal();
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro de ligação com o servidor.");
        }
    }

    // --- RENDERIZAÇÃO E MODAIS ---

   function atualizarKPIs(produtos) {
        const statTotalProducts = document.getElementById('statTotalProducts');
        const statActivePurchases = document.getElementById('statActivePurchases');
        const statGoalsReached = document.getElementById('statGoalsReached');
        const statEstimatedRevenue = document.getElementById('statEstimatedRevenue');

        if (statTotalProducts) statTotalProducts.textContent = produtos.length;
        
        // Valores fixos por enquanto, até criarmos a rota que calcula o resumo do Fornecedor
        if (statActivePurchases) statActivePurchases.textContent = "-"; 
        if (statGoalsReached) statGoalsReached.textContent = "-";
        if (statEstimatedRevenue) statEstimatedRevenue.textContent = "R$ 0,00"; 
    }

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    function getStatusClass(status) {
        if (status === "DISPONIVEL" || status === "Ativa") return "bg-emerald-50 text-emerald-700";
        if (status === "PENDENTE") return "bg-slate-100 text-slate-600";
        return "bg-amber-100 text-amber-700";
    }

    function renderProducts(products) {
        if (!productsTable) return;
        productsTable.innerHTML = "";

        if (products.length === 0) {
            productsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center">
                        <div class="mx-auto flex max-w-sm flex-col items-center">
                            <i class="ti ti-package-off text-3xl text-nexus-muted mb-2"></i>
                            <h3 class="text-sm font-semibold text-nexus-dark">Nenhum produto cadastrado</h3>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        products.forEach((product) => {
            const row = document.createElement("tr");
            row.className = "bg-white transition-colors duration-200 hover:bg-nexus-background/70";

            row.innerHTML = `
                <td class="px-6 py-5">
                    <div class="max-w-xs">
                        <p class="text-sm font-semibold text-nexus-text">${product.nome}</p>
                        <p class="mt-1 text-xs text-nexus-muted">${product.categoria}</p>
                    </div>
                </td>
                <td class="px-6 py-5"><span class="text-sm font-medium text-nexus-text">${formatCurrency(product.precoUnitario)}</span></td>
                <td class="px-6 py-5"><span class="text-sm text-nexus-muted">Automático</span></td>
                <td class="px-6 py-5">
                    <span class="inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(product.status)}">
                        ${product.status === "DISPONIVEL" ? "Ativa" : product.status}
                    </span>
                </td>
                <td class="px-6 py-5"><span class="rounded-lg bg-nexus-light px-3 py-1 text-sm font-semibold text-nexus-primary">10%</span></td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <button class="edit-btn text-sm font-medium text-nexus-primary transition hover:text-nexus-dark" data-id="${product.id}">Editar</button>
                        <span class="h-4 w-px bg-nexus-border"></span>
                        <button class="delete-btn text-sm font-medium text-red-500 transition hover:text-red-700" data-id="${product.id}">Excluir</button>
                    </div>
                </td>
            `;
            productsTable.appendChild(row);
        });

        // Adiciona Eventos aos botões Editar e Excluir
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = productsList.find(prod => prod.id == btn.dataset.id);
                if(p) openModal("edit", p);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = productsList.find(prod => prod.id == btn.dataset.id);
                if(p) openDeleteModal(p.id, p.nome);
            });
        });
    }

    function clearForm() {
        productIdInput.value = "";
        productNameInput.value = "";
        productCategoryInput.value = "";
        productPriceInput.value = "";
        productMinQuantityInput.value = "50"; 
        productStatusInput.value = "Ativa";
        productDiscountInput.value = "10";
        productDescriptionInput.value = "";
        if (modalError) modalError.classList.add("hidden");
    }

    function openModal(mode, product = null) {
        if (!modal) return;
        modalMode = mode;
        clearForm();

        if (mode === "create") {
            modalTitle.textContent = "Cadastrar Novo Produto";
            modalSubmitButton.textContent = "Cadastrar produto";
        } else if (mode === "edit" && product) {
            modalTitle.textContent = "Editar Produto";
            modalSubmitButton.textContent = "Salvar alterações";
            
            productIdInput.value = product.id;
            productNameInput.value = product.nome;
            productCategoryInput.value = product.categoria;
            productPriceInput.value = product.precoUnitario;
            productStatusInput.value = product.status === "DISPONIVEL" ? "Ativa" : "Pausada";
            productDescriptionInput.value = product.descricao || "";
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }

    function openDeleteModal(id, nome) {
        productIdToDelete = id;
        deleteProductName.textContent = nome;
        deleteModal.classList.remove("hidden");
        deleteModal.classList.add("flex");
    }

    function closeDeleteModal() {
        productIdToDelete = null;
        deleteModal.classList.add("hidden");
        deleteModal.classList.remove("flex");
    }

    function showMessage(message, type = "success") {
        if (!messageContainer) return;
        clearTimeout(messageContainer.hideTimer);
        messageContainer.textContent = message;
        messageContainer.className = `mb-3 rounded-lg px-4 py-3 text-sm font-medium border transition-all duration-300 ${type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`;
        
        messageContainer.hideTimer = setTimeout(() => {
            messageContainer.classList.add("hidden");
        }, 3000);
    }

    // --- EVENT LISTENERS GERAIS ---
    if (openModalButton) openModalButton.addEventListener("click", () => openModal("create"));
    if (closeModalButton) closeModalButton.addEventListener("click", closeModal);
    if (cancelModalButton) cancelModalButton.addEventListener("click", closeModal);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    if (productForm) productForm.addEventListener("submit", saveProduct);

    if (closeDeleteModalButton) closeDeleteModalButton.addEventListener("click", closeDeleteModal);
    if (cancelDeleteProductButton) cancelDeleteProductButton.addEventListener("click", closeDeleteModal);
    if (confirmDeleteProductButton) confirmDeleteProductButton.addEventListener("click", confirmDeleteProduct);
    if (deleteModal) deleteModal.addEventListener("click", (e) => { if (e.target === deleteModal) closeDeleteModal(); });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") { closeModal(); closeDeleteModal(); }
    });

    carregarProdutosFornecedor();
});