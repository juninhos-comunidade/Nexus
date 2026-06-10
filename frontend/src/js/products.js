const products = [
  {
    id: 1,
    name: "Arroz 5kg",
    description: "Pacote fechado para revenda",
    category: "Alimentos",
    supplier: "Distribuidora Central",
    price: "R$ 24,50",
    minQuantity: "100 un",
    discount: "8%",
    progress: 75,
    status: "Em andamento"
  },
  {
    id: 2,
    name: "Café 500g",
    description: "Linha premium para mercados locais",
    category: "Alimentos",
    supplier: "Cafés Premium",
    price: "R$ 16,90",
    minQuantity: "80 un",
    discount: "10%",
    progress: 100,
    status: "Meta atingida"
  },
  {
    id: 3,
    name: "Leite em pó 400g",
    description: "Produto alimentício de alta saída",
    category: "Alimentos",
    supplier: "Laticínios Brasil",
    price: "R$ 19,90",
    minQuantity: "120 un",
    discount: "12%",
    progress: 65,
    status: "Em andamento"
  },
  {
    id: 4,
    name: "Feijão 1kg",
    description: "Grãos selecionados para revenda",
    category: "Alimentos",
    supplier: "Grãos do Vale",
    price: "R$ 7,20",
    minQuantity: "90 un",
    discount: "6%",
    progress: 90,
    status: "Meta próxima"
  },
  {
    id: 5,
    name: "Detergente 500ml",
    description: "Caixa com unidades para comércio local",
    category: "Limpeza",
    supplier: "Limpeza Forte",
    price: "R$ 2,80",
    minQuantity: "200 un",
    discount: "15%",
    progress: 55,
    status: "Em andamento"
  },
  {
    id: 6,
    name: "Copo descartável 200ml",
    description: "Pacote para bares e pequenos comércios",
    category: "Embalagens",
    supplier: "EmbalaMax",
    price: "R$ 5,40",
    minQuantity: "150 un",
    discount: "9%",
    progress: 88,
    status: "Meta próxima"
  },
  {
    id: 7,
    name: "Água mineral 500ml",
    description: "Fardo para revenda em comércios locais",
    category: "Bebidas",
    supplier: "Fonte Clara",
    price: "R$ 1,35",
    minQuantity: "300 un",
    discount: "7%",
    progress: 42,
    status: "Em andamento"
  },
  {
    id: 8,
    name: "Sabonete 85g",
    description: "Produto de higiene para giro rápido",
    category: "Higiene",
    supplier: "Higiene Popular",
    price: "R$ 2,10",
    minQuantity: "180 un",
    discount: "11%",
    progress: 82,
    status: "Meta próxima"
  },
  {
    id: 9,
    name: "Fone Bluetooth",
    description: "Acessório eletrônico para revenda",
    category: "Eletrônicos",
    supplier: "Tech Distribuidora",
    price: "R$ 38,90",
    minQuantity: "50 un",
    discount: "13%",
    progress: 70,
    status: "Em andamento"
  }
];

const sidebar = document.getElementById("sidebar");
const openSidebar = document.getElementById("openSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const tableBody = document.getElementById("productsTable");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

const productSearch = document.getElementById("productSearch");
const topbarSearch = document.getElementById("topbarSearch");
const categoryFilter = document.getElementById("categoryFilter");
const supplierFilter = document.getElementById("supplierFilter");
const statusFilter = document.getElementById("statusFilter");
const clearFilters = document.getElementById("clearFilters");

const modalOverlay = document.getElementById("modalOverlay");
const modalProductName = document.getElementById("modalProductName");
const modalSupplier = document.getElementById("modalSupplier");
const modalMinQuantity = document.getElementById("modalMinQuantity");
const modalProgress = document.getElementById("modalProgress");
const quantityInput = document.getElementById("quantityInput");
const modalError = document.getElementById("modalError");
const cancelModal = document.getElementById("cancelModal");
const closeModalBtn = document.getElementById("closeModal");
const confirmParticipation = document.getElementById("confirmParticipation");

const createInterestBtn = document.getElementById("createInterestBtn");
const interestModalOverlay = document.getElementById("interestModalOverlay");
const closeInterestModal = document.getElementById("closeInterestModal");
const cancelInterestModal = document.getElementById("cancelInterestModal");
const interestForm = document.getElementById("interestForm");
const interestProductName = document.getElementById("interestProductName");
const interestCategory = document.getElementById("interestCategory");
const interestQuantity = document.getElementById("interestQuantity");
const interestObservation = document.getElementById("interestObservation");
const interestError = document.getElementById("interestError");

const successToast = document.getElementById("successToast");

const nomeUsuario = document.getElementById("nomeUsuario");
const fotoPreview = document.getElementById("fotoPreview");
const btnSair = document.getElementById("btnSair");

function carregarDadosUsuario() {
  const usuarioSalvo = localStorage.getItem("usuarioNexus");

  if (!usuarioSalvo) {
    window.location.href = "./auth.html#formLogin";
    return;
  }

  let usuario;

  try {
    usuario = JSON.parse(usuarioSalvo);
  } catch (error) {
    console.error("Erro ao ler usuário:", error);
    localStorage.removeItem("usuarioNexus");
    window.location.href = "./auth.html#formLogin";
    return;
  }

  if (nomeUsuario) {
    nomeUsuario.textContent = usuario.nome || usuario.nomeCompleto || "usuário";
  }

  if (fotoPreview && usuario.fotoPerfil) {
    fotoPreview.src = usuario.fotoPerfil;
  }
}

if (btnSair) {
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuarioNexus");
    window.location.href = "./home.html";
  });
}

let selectedProduct = null;

function getStatusClass(status) {
  if (status === "Em andamento") {
    return "bg-[#DBEAFE] text-[#1E3A8A]";
  }

  if (status === "Meta próxima") {
    return "bg-[#FEF3C7] text-[#92400E]";
  }

  return "bg-[#DCFCE7] text-[#166534]";
}

function openMobileSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.remove("-translate-x-full");
  sidebarOverlay.classList.remove("hidden");
}

function closeMobileSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
}

function ativarMenuAtual() {
  const paginaAtual = window.location.pathname.split("/").pop();
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach(item => {
    const paginaDoItem = item.getAttribute("href");

    item.classList.remove(
      "bg-nexus-primary/10",
      "text-nexus-primary",
      "border",
      "border-nexus-primary/20",
      "font-semibold"
    );

    item.classList.add("text-nexus-muted", "font-medium");

    if (paginaDoItem === paginaAtual) {
      item.classList.add(
        "bg-nexus-primary/10",
        "text-nexus-primary",
        "border",
        "border-nexus-primary/20",
        "font-semibold"
      );

      item.classList.remove("text-nexus-muted", "font-medium");
    }
  });
}

function renderSuppliers() {
  if (!supplierFilter) return;

  const suppliers = [...new Set(products.map(product => product.supplier))];

  suppliers.forEach(supplier => {
    const optionExists = [...supplierFilter.options].some(option => {
      return option.value === supplier;
    });

    if (!optionExists) {
      const option = document.createElement("option");

      option.value = supplier;
      option.textContent = supplier;

      supplierFilter.appendChild(option);
    }
  });
}

function renderProducts(productList) {
  tableBody.innerHTML = "";

  if (resultCount) {
    resultCount.textContent = `${productList.length} produtos`;
  }

  if (productList.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  productList.forEach(product => {
    const row = document.createElement("tr");

    row.className = "transition-all duration-300 hover:bg-[#F8FFFB]";

    row.innerHTML = `
      <td class="px-6 py-5">
        <div class="flex flex-col">
          <strong class="text-sm font-semibold text-nexus-dark">${product.name}</strong>
          <span class="mt-1 text-xs text-nexus-muted">${product.description}</span>
        </div>
      </td>

      <td class="px-6 py-5 text-sm text-nexus-muted">
        ${product.category}
      </td>

      <td class="px-6 py-5">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-nexus-text">${product.supplier}</span>
          <span class="mt-1 text-xs text-nexus-primary">Fornecedor verificado</span>
        </div>
      </td>

      <td class="px-6 py-5 text-sm font-semibold text-nexus-dark">
        ${product.price}
      </td>

      <td class="px-6 py-5 text-sm text-nexus-muted">
        ${product.minQuantity}
      </td>

      <td class="px-6 py-5">
        <span class="rounded-full bg-nexus-primary/10 px-3 py-1 text-xs font-semibold text-nexus-primary">
          ${product.discount}
        </span>
      </td>

      <td class="px-6 py-5">
        <div class="flex min-w-36 items-center gap-3">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-[#D1FAE5]">
            <div class="h-full rounded-full bg-[#19C37D]" style="width: ${product.progress}%"></div>
          </div>

          <span class="text-xs font-semibold text-nexus-primary">
            ${product.progress}%
          </span>
        </div>
      </td>

      <td class="px-6 py-5">
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(product.status)}">
          ${product.status}
        </span>
      </td>

      <td class="px-6 py-5">
        <button 
          class="participate-btn rounded-xs border border-nexus-primary/30 px-4 py-1.5 text-xs font-semibold text-nexus-primary transition-all duration-300 ease-in-out cursor-pointer hover:bg-nexus-primary hover:text-white"
          data-id="${product.id}"
        >
          Participar
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  const buttons = document.querySelectorAll(".participate-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      openParticipationModal(productId);
    });
  });
}

function filterProducts() {
  const searchValue = productSearch.value.toLowerCase().trim();
  const categoryValue = categoryFilter.value;
  const supplierValue = supplierFilter.value;
  const statusValue = statusFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "Todos" || product.category === categoryValue;

    const matchesSupplier =
      supplierValue === "Todos" || product.supplier === supplierValue;

    const matchesStatus =
      statusValue === "Todos" || product.status === statusValue;

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  renderProducts(filteredProducts);
}

function clearAllFilters() {
  productSearch.value = "";
  topbarSearch.value = "";
  categoryFilter.value = "Todos";
  supplierFilter.value = "Todos";
  statusFilter.value = "Todos";

  renderProducts(products);
}

function openParticipationModal(productId) {
  selectedProduct = products.find(product => product.id === productId);

  if (!selectedProduct) return;

  modalProductName.textContent = selectedProduct.name;
  modalSupplier.textContent = selectedProduct.supplier;
  modalMinQuantity.textContent = selectedProduct.minQuantity;
  modalProgress.textContent = `${selectedProduct.progress}%`;

  quantityInput.value = "";
  modalError.classList.add("hidden");

  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("flex");
}

function closeParticipationModal() {
  modalOverlay.classList.add("hidden");
  modalOverlay.classList.remove("flex");
  selectedProduct = null;
}

function confirmUserParticipation() {
  const quantity = Number(quantityInput.value);

  if (!quantity || quantity <= 0) {
    modalError.classList.remove("hidden");
    return;
  }

  const productName = selectedProduct.name;

  modalError.classList.add("hidden");
  closeParticipationModal();
  showToast("Participação confirmada com sucesso.");

  if (typeof createNotification === "function") {
    createNotification({
      title: "Participação confirmada",
      message: `Você entrou na compra coletiva de ${productName} com ${quantity} unidade(s).`,
      type: "success"
    });
  }
}

function openInterestModal() {
  interestProductName.value = "";
  interestCategory.value = "";
  interestQuantity.value = "";
  interestObservation.value = "";
  interestError.classList.add("hidden");

  interestModalOverlay.classList.remove("hidden");
  interestModalOverlay.classList.add("flex");
}

function closeInterestModalBox() {
  interestModalOverlay.classList.add("hidden");
  interestModalOverlay.classList.remove("flex");
}

function saveInterest(event) {
  event.preventDefault();

  const productName = interestProductName.value.trim();
  const category = interestCategory.value;
  const quantity = Number(interestQuantity.value);

  if (!productName || !category || !quantity || quantity <= 0) {
    interestError.classList.remove("hidden");
    return;
  }

  interestError.classList.add("hidden");
  closeInterestModalBox();
  showToast("Interesse criado com sucesso.");

  createNotification({
    title: "Interesse criado",
    message: `Seu interesse por ${productName} foi registrado na categoria ${category}.`,
    type: "success"
  });
}

function showToast(message) {
  successToast.textContent = message;
  successToast.classList.remove("hidden");

  setTimeout(() => {
    successToast.classList.add("hidden");
  }, 2500);
}

productSearch.addEventListener("input", () => {
  topbarSearch.value = productSearch.value;
  filterProducts();
});

topbarSearch.addEventListener("input", () => {
  productSearch.value = topbarSearch.value;
  filterProducts();
});

categoryFilter.addEventListener("change", filterProducts);
supplierFilter.addEventListener("change", filterProducts);
statusFilter.addEventListener("change", filterProducts);
clearFilters.addEventListener("click", clearAllFilters);

if (openSidebar) {
  openSidebar.addEventListener("click", openMobileSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeMobileSidebar);
}

cancelModal.addEventListener("click", closeParticipationModal);
closeModalBtn.addEventListener("click", closeParticipationModal);
confirmParticipation.addEventListener("click", confirmUserParticipation);

modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) {
    closeParticipationModal();
  }
});

if (createInterestBtn) {
  createInterestBtn.addEventListener("click", openInterestModal);
}

if (closeInterestModal) {
  closeInterestModal.addEventListener("click", closeInterestModalBox);
}

if (cancelInterestModal) {
  cancelInterestModal.addEventListener("click", closeInterestModalBox);
}

if (interestForm) {
  interestForm.addEventListener("submit", saveInterest);
}

if (interestModalOverlay) {
  interestModalOverlay.addEventListener("click", event => {
    if (event.target === interestModalOverlay) {
      closeInterestModalBox();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeParticipationModal();
    closeInterestModalBox();
    closeMobileSidebar();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    closeMobileSidebar();
  }
});

carregarDadosUsuario();
ativarMenuAtual();
renderSuppliers();
renderProducts(products);