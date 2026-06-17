document.addEventListener("DOMContentLoaded", () => {
    carregarDashboard();
});

async function carregarDashboard() {
    const token = localStorage.getItem('nexusToken');

    try {
        // Busca os dados matemáticos reais do Spring Boot
        const response = await fetch('http://localhost:8080/api/dashboard/resumo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const dados = await response.json();

            // 1. Injetar os KPIs exatos que você desenhou no HTML
            const statProducts = document.getElementById('statProducts');
            const statActivePurchases = document.getElementById('statActivePurchases');
            const statSavings = document.getElementById('statSavings');
            const statGoalRate = document.getElementById('statGoalRate');

            // Total de Produtos
            if (statProducts) statProducts.textContent = dados.totalProdutos;
            
            // Compras Ativas (Conta quantas compras retornaram do banco)
            if (statActivePurchases) statActivePurchases.textContent = dados.comprasRecentes ? dados.comprasRecentes.length : 0;
            
            // Economia formatada para Moeda (R$)
            if (statSavings) {
                statSavings.textContent = new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', currency: 'BRL' 
                }).format(dados.economiaGerada);
            }

            // A sua "Meta média": Calculamos a média do progresso de todas as compras ativas
            if (statGoalRate && dados.comprasRecentes) {
                let totalProgresso = 0;
                dados.comprasRecentes.forEach(c => {
                    let progresso = c.quantidadeMinima > 0 ? (c.quantidadeAtual / c.quantidadeMinima) * 100 : 0;
                    if(progresso > 100) progresso = 100;
                    totalProgresso += progresso;
                });
                const media = dados.comprasRecentes.length > 0 ? (totalProgresso / dados.comprasRecentes.length) : 0;
                statGoalRate.textContent = `${Math.floor(media)}%`;
            }

            // 2. Preencher a sua lista de "Compras Ativas" com o seu design
            renderizarComprasAtivas(dados.comprasRecentes);
            
            // 3. Preencher a sua lista de "Atividades Recentes"
            renderizarAtividades(dados.comprasRecentes);

        } else {
            console.error("Erro ao carregar o dashboard. Status:", response.status);
        }
    } catch (error) {
        console.error("Falha de conexão ao carregar o Dashboard:", error);
    }
}

// Injeta os cartões (divs) com a sua exata formatação do Tailwind
function renderizarComprasAtivas(compras) {
    const lista = document.getElementById('activePurchasesList');
    if (!lista || !compras) return;
    lista.innerHTML = '';

    compras.slice(0, 4).forEach(c => {
        let progress = c.quantidadeMinima > 0 ? Math.floor((c.quantidadeAtual / c.quantidadeMinima) * 100) : 0;
        if (progress > 100) progress = 100;

        lista.innerHTML += `
            <div class="flex items-center justify-between rounded-lg border border-nexus-border p-3 transition-all hover:bg-nexus-background">
                <div>
                    <p class="text-sm font-semibold text-nexus-dark">${c.produto.nome}</p>
                    <p class="text-xs text-nexus-muted">Meta: ${c.quantidadeMinima} unidades</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-nexus-primary">${progress}%</p>
                    <p class="text-[10px] text-nexus-muted">Progresso</p>
                </div>
            </div>
        `;
    });
}

// Injeta as movimentações recentes
function renderizarAtividades(compras) {
    const lista = document.getElementById('activitiesList');
    if (!lista || !compras) return;
    lista.innerHTML = '';

    compras.slice(0, 5).forEach(c => {
        lista.innerHTML += `
            <div class="flex items-start gap-3 rounded-lg p-2 hover:bg-nexus-background">
                <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-nexus-primary/10 text-nexus-primary">
                    <i class="ti ti-shopping-cart text-lg"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-nexus-dark">Atualização: ${c.produto.nome}</p>
                    <p class="text-xs text-nexus-muted">Chegamos a ${c.quantidadeAtual} unidades reservadas.</p>
                </div>
            </div>
        `;
    });
}