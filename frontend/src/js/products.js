let products = [];
let selectedProduct = null;

const tableBody = document.getElementById("productsTable");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

const productSearch = document.getElementById("productSearch");
const topbarSearch = document.getElementById("topbarSearch");
const categoryFilter = document.getElementById("categoryFilter");
const supplierFilter = document.getElementById("supplierFilter");
const statusFilter = document.getElementById("statusFilter");
const clearFilters = document.getElementById("clearFilters");
const kpiProdutos = document.getElementById("kpiProdutos");
const kpiFornecedores = document.getElementById("kpiFornecedores");
const kpiMetas = document.getElementById("kpiMetas");

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

const detailsModalOverlay = document.getElementById("detailsModalOverlay");
const closeDetailsModal = document.getElementById("closeDetailsModal");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const detNome = document.getElementById("detNome");
const detCategoria = document.getElementById("detCategoria");
const detFornecedor = document.getElementById("detFornecedor");
const detPreco = document.getElementById("detPreco");
const detDescricao = document.getElementById("detDescricao");

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

async function carregarProdutos() {
  const token = localStorage.getItem('nexusToken');
  const usuario = JSON.parse(localStorage.getItem('usuarioNexus') || '{}');

  try {
    const response = await fetch(`${API_BASE_URL}/api/produtos/disponiveis`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const dadosDoBanco = await response.json();
      const listaProdutos = dadosDoBanco.content || [];

      products = listaProdutos.map(p => ({
        id: p.id,
        name: p.nome,
        description: p.descricao || "Sem descrição",
        category: p.categoria || "Geral",
        supplier: (p.fornecedor && p.fornecedor.nome) ? p.fornecedor.nome : "Fornecedor Parceiro", 
        price: `R$ ${p.precoUnitario.toFixed(2).replace('.', ',')}`,
        minQuantity: "50 un", 
        discount: "Ativo",
        progress: 0, 
        status: p.status === "DISPONIVEL" ? "Em andamento" : p.status,
        fornecedorId: p.fornecedor ? p.fornecedor.id : null
      }));

      renderSuppliers();
      renderProducts(products);
      atualizarKPIs(listaProdutos);

      if (usuario.perfil === 'FORNECEDOR') {
        document.querySelectorAll('.participate-btn').forEach(btn => btn.classList.add('hidden'));
        if (createInterestBtn) createInterestBtn.classList.add('hidden');
      }

    } else if (response.status === 403) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem('nexusToken');
      window.location.href = 'auth.html';
    }
  } catch (error) {
    console.error("Erro na ligação à API:", error);
  }
}

function atualizarKPIs(listaProdutos) {
  if (kpiProdutos) {
    kpiProdutos.textContent = listaProdutos.length;
  }

  if (kpiFornecedores) {
    const fornecedoresUnicos = new Set();
    listaProdutos.forEach(p => {
      if (p.fornecedor && p.fornecedor.id) fornecedoresUnicos.add(p.fornecedor.id);
    });
    kpiFornecedores.textContent = fornecedoresUnicos.size;
  }

  if (kpiMetas) {
    const metasProximasCount = products.filter(p => p.progress >= 75).length;
    kpiMetas.textContent = metasProximasCount;
  }
}

async function confirmUserParticipation() {
  const quantity = Number(quantityInput.value);

  if (!quantity || quantity <= 0) {
    modalError.classList.remove("hidden");
    return;
  }

  const token = localStorage.getItem('nexusToken');

  try {
    const response = await fetch(`${API_BASE_URL}/api/participacao`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        produtoId: selectedProduct.id,
        quantidade: quantity
      })
    });

    if (response.ok) {
      modalError.classList.add("hidden");
      closeParticipationModal();
      showToast("Participação confirmada com sucesso!");
    } else {
      const err = await response.json();
      alert(err.erro || "Não foi possível registar a participação.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de comunicação com o servidor.");
  }
}

function getStatusClass(status) {
  if (status === "Em andamento") return "bg-[#DBEAFE] text-[#1E3A8A]";
  if (status === "Meta próxima") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#DCFCE7] text-[#166534]";
}

function renderSuppliers() {
  if (!supplierFilter) return;
  const suppliers = [...new Set(products.map(product => product.supplier))];
  
  supplierFilter.innerHTML = '<option value="Todos">Todos os fornecedores</option>';
  suppliers.forEach(supplier => {
    const option = document.createElement("option");
    option.value = supplier;
    option.textContent = supplier;
    supplierFilter.appendChild(option);
  });
}

function renderProducts(productList) {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (resultCount) resultCount.textContent = `${productList.length} produtos`;

  if (productList.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

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
      <td class="px-6 py-5 text-sm text-nexus-muted">${product.category}</td>
      <td class="px-6 py-5">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-nexus-text">${product.supplier}</span>
          <span class="mt-1 text-xs text-nexus-primary">Fornecedor verificado</span>
        </div>
      </td>
      <td class="px-6 py-5 text-sm font-semibold text-nexus-dark">${product.price}</td>
      <td class="px-6 py-5 text-sm text-nexus-muted">${product.minQuantity}</td>
      <td class="px-6 py-5">
        <span class="rounded-full bg-nexus-primary/10 px-3 py-1 text-xs font-semibold text-nexus-primary">${product.discount}</span>
      </td>
      <td class="px-6 py-5">
        <div class="flex min-w-36 items-center gap-3">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-[#D1FAE5]">
            <div class="h-full rounded-full bg-[#19C37D]" style="width: ${product.progress}%"></div>
          </div>
          <span class="text-xs font-semibold text-nexus-primary">${product.progress}%</span>
        </div>
      </td>
      <td class="px-6 py-5">
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(product.status)}">${product.status}</span>
      </td>
      <td class="px-6 py-5">
        <button class="participate-btn mb-1 w-full rounded-xs border border-nexus-primary/30 px-4 py-1.5 text-xs font-semibold text-nexus-primary transition-all duration-300 hover:bg-nexus-primary hover:text-white" data-id="${product.id}">
          Participar
        </button>
        <button class="details-btn w-full rounded-xs border border-nexus-primary/30 px-4 py-1.5 text-xs font-semibold text-nexus-primary transition-all duration-300 hover:bg-nexus-primary hover:text-white" data-id="${product.id}">
          Detalhes
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".participate-btn").forEach(button => {
    button.addEventListener("click", () => openParticipationModal(Number(button.dataset.id)));
  });
  document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => openDetailsModal(Number(button.dataset.id)));
  });
}

function filterProducts() {
  const searchValue = productSearch ? productSearch.value.toLowerCase().trim() : "";
  const categoryValue = categoryFilter ? categoryFilter.value : "Todos";
  const supplierValue = supplierFilter ? supplierFilter.value : "Todos";
  const statusValue = statusFilter ? statusFilter.value : "Todos";

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue) || product.description.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "Todos" || product.category === categoryValue;
    const matchesSupplier = supplierValue === "Todos" || product.supplier === supplierValue;
    const matchesStatus = statusValue === "Todos" || product.status === statusValue;
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  renderProducts(filteredProducts);
}

function clearAllFilters() {
  if (productSearch) productSearch.value = "";
  if (topbarSearch) topbarSearch.value = "";
  if (categoryFilter) categoryFilter.value = "Todos";
  if (supplierFilter) supplierFilter.value = "Todos";
  if (statusFilter) statusFilter.value = "Todos";
  renderProducts(products);
}

function openParticipationModal(productId) {
  selectedProduct = products.find(p => p.id === productId);
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
  if (modalOverlay) {
    modalOverlay.classList.add("hidden");
    modalOverlay.classList.remove("flex");
  }
  selectedProduct = null;
}

async function openDetailsModal(productId) {
  const token = localStorage.getItem('nexusToken');
  try {
    const response = await fetch(`${API_BASE_URL}/api/produtos/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const p = await response.json();
      detNome.textContent = p.nome;
      detCategoria.textContent = p.categoria || 'Geral';
      detFornecedor.textContent = (p.fornecedor && p.fornecedor.nome) ? p.fornecedor.nome : 'Fornecedor Parceiro';
      detPreco.textContent = `R$ ${p.precoUnitario.toFixed(2).replace('.', ',')}`;
      detDescricao.textContent = p.descricao || 'Nenhuma descrição fornecida.';

      detailsModalOverlay.classList.remove("hidden");
      detailsModalOverlay.classList.add("flex");
    } else {
      alert("Erro ao buscar detalhes do produto.");
    }
  } catch (error) {
    console.error("Erro na ligação à API:", error);
    alert("Erro de comunicação com o servidor.");
  }
}

function closeDetailsModalBox() {
  if (detailsModalOverlay) {
    detailsModalOverlay.classList.add("hidden");
    detailsModalOverlay.classList.remove("flex");
  }
}

function openInterestModal() {
  if (!interestModalOverlay) return;
  interestProductName.value = "";
  interestCategory.value = "";
  interestQuantity.value = "";
  interestObservation.value = "";
  interestError.classList.add("hidden");
  interestModalOverlay.classList.remove("hidden");
  interestModalOverlay.classList.add("flex");
}

function closeInterestModalBox() {
  if (interestModalOverlay) {
    interestModalOverlay.classList.add("hidden");
    interestModalOverlay.classList.remove("flex");
  }
}

function showToast(message) {
  if (!successToast) return;
  successToast.textContent = message;
  successToast.classList.remove("hidden");
  setTimeout(() => successToast.classList.add("hidden"), 2500);
}

if (productSearch && topbarSearch) {
  productSearch.addEventListener("input", () => { topbarSearch.value = productSearch.value; filterProducts(); });
  topbarSearch.addEventListener("input", () => { productSearch.value = topbarSearch.value; filterProducts(); });
}

if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
if (supplierFilter) supplierFilter.addEventListener("change", filterProducts);
if (statusFilter) statusFilter.addEventListener("change", filterProducts);
if (clearFilters) clearFilters.addEventListener("click", clearAllFilters);
if (cancelModal) cancelModal.addEventListener("click", closeParticipationModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeParticipationModal);
if (confirmParticipation) confirmParticipation.addEventListener("click", confirmUserParticipation);
if (modalOverlay) modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeParticipationModal(); });
if (createInterestBtn) createInterestBtn.addEventListener("click", openInterestModal);
if (closeInterestModal) closeInterestModal.addEventListener("click", closeInterestModalBox);
if (cancelInterestModal) cancelInterestModal.addEventListener("click", closeInterestModalBox);
if (interestModalOverlay) interestModalOverlay.addEventListener("click", e => { if (e.target === interestModalOverlay) closeInterestModalBox(); });

if (closeDetailsModal) closeDetailsModal.addEventListener("click", closeDetailsModalBox);
if (closeDetailsBtn) closeDetailsBtn.addEventListener("click", closeDetailsModalBox);
if (detailsModalOverlay) detailsModalOverlay.addEventListener("click", e => { if (e.target === detailsModalOverlay) closeDetailsModalBox(); });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeParticipationModal();
    closeInterestModalBox();
    closeDetailsModalBox();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
});