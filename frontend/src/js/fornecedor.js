document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "nexusSupplierProducts";

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

    const defaultProducts = [
        {
            id: 1,
            name: "Notebook Dell Inspiron 15",
            category: "Eletrônicos",
            price: "R$ 3.200,00",
            minQuantity: 50,
            status: "Ativa",
            discount: 10,
            description: "Notebook para revenda em compras coletivas."
        },
        {
            id: 2,
            name: "Mouse Logitech MX Master 3",
            category: "Periféricos",
            price: "R$ 520,00",
            minQuantity: 100,
            status: "Ativa",
            discount: 15,
            description: "Mouse premium para produtividade."
        },
        {
            id: 3,
            name: "Teclado Mecânico Keychron K2",
            category: "Periféricos",
            price: "R$ 680,00",
            minQuantity: 75,
            status: "Pendente",
            discount: 8,
            description: "Teclado mecânico compacto para revenda."
        },
        {
            id: 4,
            name: "Monitor LG UltraWide 29",
            category: "Monitores",
            price: "R$ 1.450,00",
            minQuantity: 30,
            status: "Ativa",
            discount: 12,
            description: "Monitor ultrawide para setups profissionais."
        }
    ];

    function getStoredProducts() {
        const products = localStorage.getItem(STORAGE_KEY);

        if (!products) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
            return defaultProducts;
        }

        try {
            return JSON.parse(products);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
            return defaultProducts;
        }
    }

    function saveProducts(products) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }

    function showMessage(message, type = "success") {
        if (!messageContainer) return;

        clearTimeout(messageContainer.hideTimer);

        messageContainer.textContent = message;
        messageContainer.className = "";

        const baseClasses = [
            "mb-3",
            "rounded-lg",
            "px-4",
            "py-3",
            "text-sm",
            "font-medium",
            "border",
            "transition-all",
            "duration-300"
        ];

        const successClasses = [
            "bg-green-100",
            "text-green-800",
            "border-green-300"
        ];

        const errorClasses = [
            "bg-red-100",
            "text-red-800",
            "border-red-300"
        ];

        messageContainer.classList.add(...baseClasses);

        if (type === "success") {
            messageContainer.classList.add(...successClasses);
        } else {
            messageContainer.classList.add(...errorClasses);
        }

        messageContainer.classList.remove("hidden");

        messageContainer.hideTimer = setTimeout(() => {
            messageContainer.classList.add("hidden");
        }, 3000);
    }

    function showNotification(title, message, type = "success") {
        if (typeof createNotification === "function") {
            createNotification({
                title,
                message,
                type
            });
        }
    }

    function getStatusClass(status) {
        if (status === "Ativa") {
            return "bg-emerald-50 text-emerald-700";
        }

        if (status === "Pendente") {
            return "bg-slate-100 text-slate-600";
        }

        return "bg-amber-100 text-amber-700";
    }

    function getProductById(productId) {
        const products = getStoredProducts();

        return products.find((product) => {
            return product.id === productId;
        });
    }

    function renderProducts() {
        const products = getStoredProducts();

        if (!productsTable) return;

        productsTable.innerHTML = "";

        if (products.length === 0) {
            productsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-12 text-center">
                        <div class="mx-auto flex max-w-sm flex-col items-center">
                            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-nexus-background text-nexus-muted">
                                <i class="ti ti-package-off text-xl"></i>
                            </div>

                            <h3 class="text-sm font-semibold text-nexus-dark">
                                Nenhum produto cadastrado
                            </h3>

                            <p class="mt-1 text-sm text-nexus-muted">
                                Cadastre seu primeiro produto para começar.
                            </p>
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
                        <p class="text-sm font-semibold text-nexus-text">${product.name}</p>
                        <p class="mt-1 text-xs text-nexus-muted">${product.category}</p>
                    </div>
                </td>

                <td class="px-6 py-5">
                    <span class="text-sm font-medium text-nexus-text">${product.price}</span>
                </td>

                <td class="px-6 py-5">
                    <span class="text-sm text-nexus-muted">${product.minQuantity} unidades</span>
                </td>

                <td class="px-6 py-5">
                    <span class="inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(product.status)}">
                        ${product.status}
                    </span>
                </td>

                <td class="px-6 py-5">
                    <span class="rounded-lg bg-nexus-light px-3 py-1 text-sm font-semibold text-nexus-primary">
                        ${product.discount}%
                    </span>
                </td>

                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <button 
                            class="view-product text-sm font-medium text-nexus-muted transition hover:text-nexus-primary" 
                            data-id="${product.id}"
                        >
                            Ver
                        </button>

                        <span class="h-4 w-px bg-nexus-border"></span>

                        <button 
                            class="edit-product text-sm font-medium text-nexus-primary transition hover:text-nexus-dark" 
                            data-id="${product.id}"
                        >
                            Editar
                        </button>

                        <span class="h-4 w-px bg-nexus-border"></span>

                        <button 
                            class="delete-product text-sm font-medium text-nexus-muted transition hover:text-red-500" 
                            data-id="${product.id}"
                        >
                            Excluir
                        </button>
                    </div>
                </td>
            `;

            productsTable.appendChild(row);
        });

        addTableEvents();
    }

    function setFieldsDisabled(disabled) {
        productNameInput.disabled = disabled;
        productCategoryInput.disabled = disabled;
        productPriceInput.disabled = disabled;
        productMinQuantityInput.disabled = disabled;
        productStatusInput.disabled = disabled;
        productDiscountInput.disabled = disabled;
        productDescriptionInput.disabled = disabled;
    }

    function clearForm() {
        productIdInput.value = "";
        productNameInput.value = "";
        productCategoryInput.value = "";
        productPriceInput.value = "";
        productMinQuantityInput.value = "";
        productStatusInput.value = "Ativa";
        productDiscountInput.value = "";
        productDescriptionInput.value = "";

        if (modalError) {
            modalError.textContent = "Preencha todos os campos obrigatórios corretamente.";
            modalError.classList.add("hidden");
        }
    }

    function fillForm(product) {
        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productCategoryInput.value = product.category;
        productPriceInput.value = product.price;
        productMinQuantityInput.value = product.minQuantity;
        productStatusInput.value = product.status;
        productDiscountInput.value = product.discount;
        productDescriptionInput.value = product.description || "";
    }

    function openModal(mode, product = null) {
        if (!modal) return;

        modalMode = mode;
        clearForm();

        if (mode === "create") {
            modalTitle.textContent = "Cadastrar Novo Produto";
            modalSubtitle.textContent = "Adicione um novo produto para compras coletivas.";
            modalSubmitButton.textContent = "Cadastrar produto";
            modalSubmitButton.classList.remove("hidden");
            setFieldsDisabled(false);
        }

        if (mode === "view") {
            modalTitle.textContent = "Detalhes do Produto";
            modalSubtitle.textContent = "Veja as informações cadastradas deste produto.";
            modalSubmitButton.classList.add("hidden");
            setFieldsDisabled(true);
            fillForm(product);
        }

        if (mode === "edit") {
            modalTitle.textContent = "Editar Produto";
            modalSubtitle.textContent = "Atualize as informações do produto cadastrado.";
            modalSubmitButton.textContent = "Salvar alterações";
            modalSubmitButton.classList.remove("hidden");
            setFieldsDisabled(false);
            fillForm(product);
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    function closeModal() {
        if (!modal) return;

        modal.classList.add("hidden");
        modal.classList.remove("flex");

        setFieldsDisabled(false);
        clearForm();
    }

    function productWasChanged(originalProduct, updatedProduct) {
        return (
            originalProduct.name !== updatedProduct.name ||
            originalProduct.category !== updatedProduct.category ||
            originalProduct.price !== updatedProduct.price ||
            Number(originalProduct.minQuantity) !== Number(updatedProduct.minQuantity) ||
            originalProduct.status !== updatedProduct.status ||
            Number(originalProduct.discount) !== Number(updatedProduct.discount) ||
            (originalProduct.description || "") !== (updatedProduct.description || "")
        );
    }

    function saveProduct(event) {
        event.preventDefault();

        const productName = productNameInput.value.trim();
        const productCategory = productCategoryInput.value;
        const productPrice = productPriceInput.value.trim();
        const productMinQuantity = Number(productMinQuantityInput.value);
        const productStatus = productStatusInput.value;
        const productDiscount = Number(productDiscountInput.value);
        const productDescription = productDescriptionInput.value.trim();

        const discountIsInvalid = Number.isNaN(productDiscount) || productDiscount < 0 || productDiscount > 100;

        if (
            !productName ||
            !productCategory ||
            !productPrice ||
            !productMinQuantity ||
            productMinQuantity <= 0 ||
            !productStatus ||
            discountIsInvalid
        ) {
            modalError.textContent = "Preencha todos os campos obrigatórios corretamente.";
            modalError.classList.remove("hidden");
            return;
        }

        const products = getStoredProducts();

        const productData = {
            name: productName,
            category: productCategory,
            price: productPrice,
            minQuantity: productMinQuantity,
            status: productStatus,
            discount: productDiscount,
            description: productDescription
        };

        if (modalMode === "create") {
            const newProduct = {
                id: Date.now(),
                ...productData
            };

            products.unshift(newProduct);
            saveProducts(products);

            closeModal();
            renderProducts();

            showMessage("Produto cadastrado com sucesso.", "success");
            showNotification(
                "Produto cadastrado",
                `${productName} foi adicionado ao painel do fornecedor.`,
                "success"
            );

            return;
        }

        if (modalMode === "edit") {
            const productId = Number(productIdInput.value);
            const originalProduct = getProductById(productId);

            if (!originalProduct) return;

            const updatedProduct = {
                ...originalProduct,
                ...productData
            };

            if (!productWasChanged(originalProduct, updatedProduct)) {
                modalError.textContent = "Nenhuma alteração foi feita.";
                modalError.classList.remove("hidden");
                return;
            }

            const updatedProducts = products.map((product) => {
                if (product.id === productId) {
                    return updatedProduct;
                }

                return product;
            });

            saveProducts(updatedProducts);

            closeModal();
            renderProducts();

            showMessage("Produto atualizado com sucesso.", "success");
            showNotification(
                "Produto atualizado",
                `${productName} teve suas informações atualizadas.`,
                "success"
            );
        }
    }

    function openDeleteModal(productId) {
        if (!deleteModal || !deleteProductName) return;

        const product = getProductById(productId);

        if (!product) return;

        productIdToDelete = productId;
        deleteProductName.textContent = `"${product.name}"`;

        deleteModal.classList.remove("hidden");
        deleteModal.classList.add("flex");
    }

    function closeDeleteModal() {
        if (!deleteModal) return;

        deleteModal.classList.add("hidden");
        deleteModal.classList.remove("flex");

        productIdToDelete = null;

        if (deleteProductName) {
            deleteProductName.textContent = "";
        }
    }

    function confirmDeleteProduct() {
        if (!productIdToDelete) return;

        const product = getProductById(productIdToDelete);

        if (!product) return;

        const products = getStoredProducts();

        const updatedProducts = products.filter((productItem) => {
            return productItem.id !== productIdToDelete;
        });

        saveProducts(updatedProducts);
        renderProducts();
        closeDeleteModal();

        showMessage("Produto excluído com sucesso.", "success");

        showNotification(
            "Produto excluído",
            `${product.name} foi removido do painel do fornecedor.`,
            "warning"
        );
    }

    function addTableEvents() {
        const viewButtons = document.querySelectorAll(".view-product");
        const editButtons = document.querySelectorAll(".edit-product");
        const deleteButtons = document.querySelectorAll(".delete-product");

        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const productId = Number(button.dataset.id);
                const product = getProductById(productId);

                if (product) {
                    openModal("view", product);
                }
            });
        });

        editButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const productId = Number(button.dataset.id);
                const product = getProductById(productId);

                if (product) {
                    openModal("edit", product);
                }
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const productId = Number(button.dataset.id);
                openDeleteModal(productId);
            });
        });
    }

    if (openModalButton) {
        openModalButton.addEventListener("click", () => {
            openModal("create");
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    if (cancelModalButton) {
        cancelModalButton.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (productForm) {
        productForm.addEventListener("submit", saveProduct);
    }

    if (closeDeleteModalButton) {
        closeDeleteModalButton.addEventListener("click", closeDeleteModal);
    }

    if (cancelDeleteProductButton) {
        cancelDeleteProductButton.addEventListener("click", closeDeleteModal);
    }

    if (confirmDeleteProductButton) {
        confirmDeleteProductButton.addEventListener("click", confirmDeleteProduct);
    }

    if (deleteModal) {
        deleteModal.addEventListener("click", (event) => {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
            closeDeleteModal();
        }
    });

    renderProducts();
});