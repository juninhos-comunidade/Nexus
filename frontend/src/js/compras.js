document.addEventListener("DOMContentLoaded", () => {
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

    const nomeUsuario = document.getElementById("nomeUsuario");
    const fotoPreview = document.getElementById("fotoPreview");
    const btnSair = document.getElementById("btnSair");
    const tabelaCompras = document.getElementById("tabelaCompras");

    const cardsResumo = document.querySelectorAll("main section:first-of-type > div");

    const minhasCompras = [
        {
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

    function carregarUsuario() {
        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome || usuario.nomeCompleto || "usuário";
        }

        if (fotoPreview && usuario.fotoPerfil) {
            fotoPreview.src = usuario.fotoPerfil;
        }
    }

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

    function carregarResumo() {
        const totalParticipacoes = minhasCompras.length;
        const metasAtingidas = minhasCompras.filter((compra) => compra.status === "Meta atingida").length;
        const valorTotal = minhasCompras.reduce((total, compra) => total + compra.valor, 0);
        const economiaTotal = minhasCompras.reduce((total, compra) => total + compra.economia, 0);

        if (cardsResumo[0]) {
            cardsResumo[0].querySelector("span:last-child").textContent = totalParticipacoes;
        }

        if (cardsResumo[1]) {
            cardsResumo[1].querySelector("span:last-child").textContent = metasAtingidas;
        }

        if (cardsResumo[2]) {
            cardsResumo[2].querySelector("span:last-child").textContent = formatarMoeda(valorTotal);
        }

        if (cardsResumo[3]) {
            cardsResumo[3].querySelector("span:last-child").textContent = formatarMoeda(economiaTotal);
        }
    }

    function carregarTabela() {
        if (!tabelaCompras) return;

        tabelaCompras.innerHTML = "";

        minhasCompras.forEach((compra, index) => {
            const linha = document.createElement("tr");

            linha.className = "border-b border-nexus-border transition-all duration-300 hover:bg-nexus-background";

            if (index === minhasCompras.length - 1) {
                linha.className = "transition-all duration-300 hover:bg-nexus-background";
            }

            linha.innerHTML = `
                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">${compra.produto}</td>

                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.fornecedor}</td>

                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.quantidade}</td>

                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-24 rounded-full bg-nexus-light">
                            <div class="h-2 rounded-full bg-nexus-primary" style="width: ${compra.progresso}%"></div>
                        </div>
                        <span class="text-sm text-nexus-muted">${compra.progresso}%</span>
                    </div>
                </td>

                <td class="px-6 py-4 text-sm text-nexus-muted">${compra.prazo}</td>

                <td class="px-6 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-medium ${definirStatus(compra.status)}">
                        ${compra.status}
                    </span>
                </td>

                <td class="px-6 py-4 text-sm font-semibold text-nexus-text">${formatarMoeda(compra.valor)}</td>

                <td class="px-6 py-4">
                    <a href="#" class="text-sm font-semibold text-nexus-primary transition-colors hover:text-nexus-dark">
                        Ver detalhes
                    </a>
                </td>
            `;

            tabelaCompras.appendChild(linha);
        });
    }

    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("usuarioNexus");
            window.location.href = "./home.html";
        });
    }

    carregarUsuario();
    carregarResumo();
    carregarTabela();
});