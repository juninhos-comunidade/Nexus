document.addEventListener("DOMContentLoaded", () => {
    const estadoDashboard = {
        produtos: buscarArrayNoLocalStorage(["nexus_produtos", "produtos", "products"]) || criarProdutosExemplo(),
        fornecedores: buscarArrayNoLocalStorage(["nexus_fornecedores", "fornecedores", "suppliers"]) || criarFornecedoresExemplo(),
        comprasColetivas: buscarArrayNoLocalStorage([
            "nexus_compras_coletivas",
            "comprasColetivas",
            "collectivePurchases"
        ]) || criarComprasColetivasExemplo(),
        atividades: buscarArrayNoLocalStorage(["nexus_atividades", "atividades", "activities"]) || criarAtividadesExemplo(),
        notificacoes: buscarArrayNoLocalStorage(["nexus_notificacoes", "notificacoes", "notifications"]) || criarNotificacoesExemplo(),
        graficos: {}
    };

    iniciarUsuario();
    iniciarMenuLateral();
    iniciarNotificacoes();
    iniciarBusca();
    iniciarBotoesDePeriodo();

    renderizarDashboard();
    renderizarGraficos("30");
    atualizarTextoUltimaAtualizacao();

    function renderizarDashboard(termoBusca = "") {
        const buscaNormalizada = normalizarTexto(termoBusca);

        const comprasAtivas = estadoDashboard.comprasColetivas.filter((compra) => {
            const compraEstaAtiva = compra.status === "ativa" || compra.status === "em_andamento";

            const compraCombinaComBusca = normalizarTexto(
                `${compra.produto} ${compra.fornecedor} ${compra.categoria}`
            ).includes(buscaNormalizada);

            return compraEstaAtiva && compraCombinaComBusca;
        });

        const produtosVisiveis = estadoDashboard.produtos.filter((produto) => {
            return normalizarTexto(
                `${produto.nome} ${produto.categoria} ${produto.fornecedor}`
            ).includes(buscaNormalizada);
        });

        const fornecedoresVisiveis = estadoDashboard.fornecedores.filter((fornecedor) => {
            return normalizarTexto(
                `${fornecedor.nome} ${fornecedor.categoria}`
            ).includes(buscaNormalizada);
        });

        const economiaTotal = comprasAtivas.reduce((total, compra) => {
            return total + Number(compra.economiaEstimada || 0);
        }, 0);

        const mediaDasMetas = calcularMediaDasMetas(estadoDashboard.comprasColetivas);

        alterarTexto("statActivePurchases", comprasAtivas.length);
        alterarTexto("statProducts", produtosVisiveis.length);
        alterarTexto("statSavings", formatarMoeda(economiaTotal));
        alterarTexto("statGoalRate", `${mediaDasMetas}%`);

        alterarTexto("heroSavings", formatarMoeda(economiaTotal));
        alterarTexto("heroGoalPercent", `${mediaDasMetas}%`);
        alterarTexto("heroActivePurchases", comprasAtivas.length);
        alterarTexto("heroSuppliers", fornecedoresVisiveis.length);

        const barraMetaPrincipal = document.querySelector("#heroGoalBar");

        if (barraMetaPrincipal) {
            barraMetaPrincipal.style.width = `${Math.min(mediaDasMetas, 100)}%`;
        }

        renderizarComprasAtivas(comprasAtivas);
        renderizarOportunidades(produtosVisiveis);
        renderizarFornecedoresConfiaveis(fornecedoresVisiveis);
        renderizarAtividades(estadoDashboard.atividades, buscaNormalizada);
    }

    function renderizarComprasAtivas(compras) {
        const container = document.querySelector("#activePurchasesList");

        if (!container) return;

        if (!compras.length) {
            container.innerHTML = criarEstadoVazio(
                "Nenhuma compra ativa encontrada",
                "Quando houver compras coletivas em andamento, elas aparecerão aqui."
            );

            return;
        }

        const comprasOrdenadas = [...compras]
            .sort((compraA, compraB) => new Date(compraA.prazo) - new Date(compraB.prazo))
            .slice(0, 4);

        container.innerHTML = comprasOrdenadas.map((compra) => {
            const progresso = calcularProgresso(compra.quantidadeAtual, compra.meta);
            const quantidadeFaltante = Math.max(Number(compra.meta) - Number(compra.quantidadeAtual), 0);

            return `
                <article class="rounded-2xl border border-nexus-border bg-white p-4 transition-all hover:border-nexus-primary/50 hover:bg-nexus-background/50">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="font-semibold text-nexus-dark">${compra.produto}</h3>
                                ${criarBadgeStatus(progresso, compra.status)}
                            </div>

                            <p class="mt-1 text-sm text-nexus-muted">
                                ${compra.fornecedor} • ${compra.categoria}
                            </p>
                        </div>

                        <div class="text-left sm:text-right">
                            <p class="text-xs text-nexus-muted">Economia estimada</p>
                            <strong class="text-sm text-nexus-primary">${formatarMoeda(compra.economiaEstimada)}</strong>
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="mb-2 flex items-center justify-between text-xs">
                            <span class="font-medium text-nexus-muted">
                                ${compra.quantidadeAtual} de ${compra.meta} unidades
                            </span>

                            <span class="font-bold text-nexus-dark">${progresso}%</span>
                        </div>

                        <div class="h-3 overflow-hidden rounded-full bg-nexus-background">
                            <div 
                                class="h-full rounded-full bg-nexus-primary transition-all duration-700" 
                                style="width: ${Math.min(progresso, 100)}%;"
                            ></div>
                        </div>
                    </div>

                    <div class="mt-4 grid gap-3 text-xs text-nexus-muted sm:grid-cols-3">
                        <div class="flex items-center gap-2">
                            <i class="ti ti-calendar text-nexus-primary"></i>
                            <span>Prazo: ${formatarData(compra.prazo)}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <i class="ti ti-users text-nexus-primary"></i>
                            <span>${compra.participantes} participantes</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <i class="ti ti-target text-nexus-primary"></i>
                            <span>Faltam ${quantidadeFaltante} un.</span>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderizarOportunidades(produtos) {
        const container = document.querySelector("#opportunitiesList");

        if (!container) return;

        const oportunidades = [...produtos]
            .sort((produtoA, produtoB) => Number(produtoB.desconto || 0) - Number(produtoA.desconto || 0))
            .slice(0, 4);

        if (!oportunidades.length) {
            container.innerHTML = criarEstadoVazio(
                "Nenhuma oportunidade encontrada",
                "Cadastre produtos para visualizar oportunidades de economia."
            );

            return;
        }

        container.innerHTML = oportunidades.map((produto) => {
            return `
                <article class="rounded-2xl border border-nexus-border p-4 transition-all hover:-translate-y-1 hover:border-nexus-primary/50 hover:shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nexus-background text-nexus-primary">
                            <i class="ti ti-box text-2xl"></i>
                        </div>

                        <span class="rounded-full bg-nexus-light px-3 py-1 text-xs font-bold text-nexus-secondary">
                            -${produto.desconto}%
                        </span>
                    </div>

                    <h3 class="mt-4 font-semibold text-nexus-dark">${produto.nome}</h3>
                    <p class="mt-1 text-sm text-nexus-muted">${produto.fornecedor}</p>

                    <div class="mt-4 flex items-end justify-between gap-3">
                        <div>
                            <p class="text-xs text-nexus-muted">Preço estimado</p>
                            <strong class="text-lg text-nexus-dark">${formatarMoeda(produto.preco)}</strong>
                        </div>

                        <a href="products.html" class="rounded-xl bg-nexus-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-nexus-secondary">
                            Ver produto
                        </a>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderizarFornecedoresConfiaveis(fornecedores) {
        const container = document.querySelector("#reliableSuppliersList");

        if (!container) return;

        const fornecedoresConfiaveis = [...fornecedores]
            .sort((fornecedorA, fornecedorB) => Number(fornecedorB.avaliacao || 0) - Number(fornecedorA.avaliacao || 0))
            .slice(0, 5);

        if (!fornecedoresConfiaveis.length) {
            container.innerHTML = criarEstadoVazio(
                "Nenhum fornecedor encontrado",
                "Fornecedores cadastrados aparecerão nesta área."
            );

            return;
        }

        container.innerHTML = fornecedoresConfiaveis.map((fornecedor) => {
            return `
                <article class="flex items-center justify-between gap-4 rounded-2xl border border-nexus-border p-4 transition-all hover:bg-nexus-background/60">
                    <div class="flex min-w-0 items-center gap-3">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-nexus-background text-nexus-primary">
                            <i class="ti ti-building-warehouse text-xl"></i>
                        </div>

                        <div class="min-w-0">
                            <h3 class="truncate text-sm font-semibold text-nexus-dark">${fornecedor.nome}</h3>
                            <p class="truncate text-xs text-nexus-muted">${fornecedor.categoria}</p>
                        </div>
                    </div>

                    <div class="text-right">
                        <div class="flex items-center justify-end gap-1 text-sm font-bold text-nexus-dark">
                            <i class="ti ti-star-filled text-yellow-500"></i>
                            ${Number(fornecedor.avaliacao).toFixed(1)}
                        </div>

                        <p class="text-xs text-nexus-muted">${fornecedor.status}</p>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderizarAtividades(atividades, termoBusca = "") {
        const container = document.querySelector("#activitiesList");

        if (!container) return;

        const atividadesVisiveis = atividades.filter((atividade) => {
            return normalizarTexto(
                `${atividade.titulo} ${atividade.descricao} ${atividade.tipo}`
            ).includes(termoBusca);
        }).slice(0, 6);

        if (!atividadesVisiveis.length) {
            container.innerHTML = criarEstadoVazio(
                "Nenhuma atividade encontrada",
                "As movimentações recentes da plataforma aparecerão aqui."
            );

            return;
        }

        container.innerHTML = atividadesVisiveis.map((atividade) => {
            return `
                <article class="flex flex-col gap-3 rounded-2xl border border-nexus-border p-4 transition-all hover:bg-nexus-background/60 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-start gap-3">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-nexus-background text-nexus-primary">
                            <i class="${buscarIconeDaAtividade(atividade.tipo)} text-xl"></i>
                        </div>

                        <div>
                            <h3 class="text-sm font-semibold text-nexus-dark">${atividade.titulo}</h3>
                            <p class="mt-1 text-sm text-nexus-muted">${atividade.descricao}</p>
                        </div>
                    </div>

                    <span class="shrink-0 text-xs font-medium text-nexus-muted">${atividade.tempo}</span>
                </article>
            `;
        }).join("");
    }

    function renderizarGraficos(periodo = "30") {
        if (typeof Chart === "undefined") {
            console.warn("Chart.js não foi carregado.");
            return;
        }

        renderizarGraficoEconomia(periodo);
        renderizarGraficoCategorias();
        renderizarGraficoMetas();
    }

    function renderizarGraficoEconomia(periodo) {
        const canvas = document.querySelector("#savingsChart");

        if (!canvas) return;

        const dadosDoGrafico = buscarDadosDeEconomiaPorPeriodo(periodo);

        destruirGrafico("economia");

        estadoDashboard.graficos.economia = new Chart(canvas, {
            type: "line",
            data: {
                labels: dadosDoGrafico.rotulos,
                datasets: [
                    {
                        label: "Economia estimada",
                        data: dadosDoGrafico.valores,
                        borderColor: "#10B981",
                        backgroundColor: "rgba(16, 185, 129, 0.12)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (contexto) => `Economia: ${formatarMoeda(contexto.raw)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#4B5563"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(167, 243, 208, 0.6)"
                        },
                        ticks: {
                            color: "#4B5563",
                            callback: (valor) => formatarMoedaCompacta(valor)
                        }
                    }
                }
            }
        });
    }

    function renderizarGraficoCategorias() {
        const canvas = document.querySelector("#categoriesChart");

        if (!canvas) return;

        const categorias = estadoDashboard.produtos.reduce((acumulador, produto) => {
            const categoria = produto.categoria || "Outros";

            acumulador[categoria] = (acumulador[categoria] || 0) + 1;

            return acumulador;
        }, {});

        destruirGrafico("categorias");

        estadoDashboard.graficos.categorias = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: Object.keys(categorias),
                datasets: [
                    {
                        data: Object.values(categorias),
                        backgroundColor: [
                            "#10B981",
                            "#047857",
                            "#00B7A6",
                            "#A7F3D0",
                            "#D1FAE5"
                        ],
                        borderColor: "#FFFFFF",
                        borderWidth: 4,
                        hoverOffset: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "68%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#4B5563",
                            boxWidth: 12,
                            padding: 18
                        }
                    }
                }
            }
        });
    }

    function renderizarGraficoMetas() {
        const canvas = document.querySelector("#goalsChart");

        if (!canvas) return;

        const compras = estadoDashboard.comprasColetivas.slice(0, 6);

        destruirGrafico("metas");

        estadoDashboard.graficos.metas = new Chart(canvas, {
            type: "bar",
            data: {
                labels: compras.map((compra) => compra.produto),
                datasets: [
                    {
                        label: "Quantidade atual",
                        data: compras.map((compra) => compra.quantidadeAtual),
                        backgroundColor: "#10B981",
                        borderRadius: 10
                    },
                    {
                        label: "Meta",
                        data: compras.map((compra) => compra.meta),
                        backgroundColor: "rgba(167, 243, 208, 0.9)",
                        borderRadius: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#4B5563"
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (contexto) => `${contexto.dataset.label}: ${contexto.raw} unidades`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: "#4B5563"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(167, 243, 208, 0.6)"
                        },
                        ticks: {
                            color: "#4B5563"
                        }
                    }
                }
            }
        });
    }

    function iniciarUsuario() {
        const usuario = buscarObjetoNoLocalStorage([
            "usuarioLogado",
            "nexus_usuario_logado",
            "currentUser",
            "loggedUser",
            "user"
        ]);

        const elementoNomeUsuario = document.querySelector("#nomeUsuario");
        const elementoFotoUsuario = document.querySelector("#fotoPreview");

        if (usuario && elementoNomeUsuario) {
            const nomeUsuario = usuario.nome || usuario.name || usuario.nomeCompleto || usuario.email || "usuário";

            elementoNomeUsuario.textContent = String(nomeUsuario).split(" ")[0];
        }

        if (usuario && elementoFotoUsuario) {
            const fotoUsuario = usuario.foto || usuario.photo || usuario.avatar || usuario.imagem || usuario.fotoPerfil;

            if (fotoUsuario) {
                elementoFotoUsuario.src = fotoUsuario;
            }
        }
    }

    function iniciarMenuLateral() {
        const menuLateral = document.querySelector("#sidebar");
        const fundoEscuro = document.querySelector("#sidebarOverlay");
        const botaoAbrirMenu = document.querySelector("#openSidebarButton");
        const botaoFecharMenu = document.querySelector("#closeSidebarButton");

        if (!menuLateral || !fundoEscuro || !botaoAbrirMenu || !botaoFecharMenu) return;

        botaoAbrirMenu.addEventListener("click", () => {
            menuLateral.classList.remove("-translate-x-full");
            fundoEscuro.classList.remove("hidden");
        });

        botaoFecharMenu.addEventListener("click", fecharMenuLateral);
        fundoEscuro.addEventListener("click", fecharMenuLateral);

        function fecharMenuLateral() {
            menuLateral.classList.add("-translate-x-full");
            fundoEscuro.classList.add("hidden");
        }
    }

    function iniciarBusca() {
    const campoBuscaDesktop = document.querySelector("#dashboardSearch");
    const campoBuscaMobile = document.querySelector("#dashboardSearchMobile");
    const botaoLimparBusca = document.querySelector("#clearSearchButton");

    function executarBusca(valor) {
        const valorBusca = valor.trim();

            if (botaoLimparBusca) {
                botaoLimparBusca.classList.toggle("hidden", valorBusca.length === 0);
            }

            if (campoBuscaDesktop && campoBuscaDesktop.value !== valorBusca) {
                campoBuscaDesktop.value = valorBusca;
            }

            if (campoBuscaMobile && campoBuscaMobile.value !== valorBusca) {
                campoBuscaMobile.value = valorBusca;
            }

            renderizarDashboard(valorBusca);
        }

        if (campoBuscaDesktop) {
            campoBuscaDesktop.addEventListener("input", () => {
                executarBusca(campoBuscaDesktop.value);
            });
        }

        if (campoBuscaMobile) {
            campoBuscaMobile.addEventListener("input", () => {
                executarBusca(campoBuscaMobile.value);
            });
        }

        if (botaoLimparBusca) {
            botaoLimparBusca.addEventListener("click", () => {
                executarBusca("");

                if (campoBuscaDesktop) {
                    campoBuscaDesktop.focus();
                }
            });
        }
    }

    function iniciarBotoesDePeriodo() {
        const botoesPeriodo = document.querySelectorAll(".period-button");

        botoesPeriodo.forEach((botao) => {
            botao.addEventListener("click", () => {
                botoesPeriodo.forEach((item) => {
                    item.classList.remove("bg-white", "text-nexus-dark", "shadow-sm");
                    item.classList.add("text-nexus-muted");
                });

                botao.classList.add("bg-white", "text-nexus-dark", "shadow-sm");
                botao.classList.remove("text-nexus-muted");

                renderizarGraficoEconomia(botao.dataset.period || "30");
            });
        });
    }

    function iniciarNotificacoes() {
        const botaoNotificacoes = document.querySelector("#notificationButton");
        const painelNotificacoes = document.querySelector("#notificationPanel");
        const badgeNotificacoes = document.querySelector("#notificationBadge");
        const listaNotificacoes = document.querySelector("#notificationList");
        const subtituloNotificacoes = document.querySelector("#notificationSubtitle");
        const botaoMarcarTodasComoLidas = document.querySelector("#markAllReadButton");
        const botaoLimparNotificacoes = document.querySelector("#clearNotificationsButton");

        if (
            !botaoNotificacoes ||
            !painelNotificacoes ||
            !badgeNotificacoes ||
            !listaNotificacoes ||
            !subtituloNotificacoes
        ) {
            return;
        }

        renderizarNotificacoes();

        botaoNotificacoes.addEventListener("click", (evento) => {
            evento.stopPropagation();
            painelNotificacoes.classList.toggle("hidden");
        });

        document.addEventListener("click", (evento) => {
            const clicouDentroDoPainel = painelNotificacoes.contains(evento.target);
            const clicouNoBotao = botaoNotificacoes.contains(evento.target);

            if (!clicouDentroDoPainel && !clicouNoBotao) {
                painelNotificacoes.classList.add("hidden");
            }
        });

        if (botaoMarcarTodasComoLidas) {
            botaoMarcarTodasComoLidas.addEventListener("click", () => {
                estadoDashboard.notificacoes = estadoDashboard.notificacoes.map((notificacao) => ({
                    ...notificacao,
                    lida: true
                }));

                salvarNotificacoes();
                renderizarNotificacoes();
            });
        }

        if (botaoLimparNotificacoes) {
            botaoLimparNotificacoes.addEventListener("click", () => {
                estadoDashboard.notificacoes = [];

                salvarNotificacoes();
                renderizarNotificacoes();
            });
        }

        function renderizarNotificacoes() {
            const notificacoesNaoLidas = estadoDashboard.notificacoes.filter((notificacao) => !notificacao.lida);

            badgeNotificacoes.textContent = notificacoesNaoLidas.length;
            badgeNotificacoes.classList.toggle("hidden", notificacoesNaoLidas.length === 0);

            subtituloNotificacoes.textContent = notificacoesNaoLidas.length > 0
                ? `${notificacoesNaoLidas.length} nova(s) notificação(ões)`
                : "Nenhuma nova notificação";

            if (!estadoDashboard.notificacoes.length) {
                listaNotificacoes.innerHTML = `
                    <div class="p-6 text-center">
                        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-nexus-background text-nexus-primary">
                            <i class="ti ti-bell-off text-2xl"></i>
                        </div>

                        <p class="mt-3 text-sm font-medium text-nexus-dark">Sem notificações</p>
                        <p class="mt-1 text-xs text-nexus-muted">Novos alertas aparecerão aqui.</p>
                    </div>
                `;

                return;
            }

            listaNotificacoes.innerHTML = estadoDashboard.notificacoes.map((notificacao) => {
                return `
                    <div class="border-b border-nexus-border px-4 py-3 last:border-b-0 ${notificacao.lida ? "bg-white" : "bg-nexus-background/60"}">
                        <div class="flex gap-3">
                            <div class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-nexus-primary">
                                <i class="${buscarIconeDaAtividade(notificacao.tipo)}"></i>
                            </div>

                            <div>
                                <h4 class="text-sm font-semibold text-nexus-dark">${notificacao.titulo}</h4>
                                <p class="mt-1 text-xs leading-relaxed text-nexus-muted">${notificacao.descricao}</p>
                                <span class="mt-2 block text-[11px] font-medium text-nexus-muted">${notificacao.tempo}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        }

        function salvarNotificacoes() {
            localStorage.setItem("nexus_notificacoes", JSON.stringify(estadoDashboard.notificacoes));
        }
    }

    function atualizarTextoUltimaAtualizacao() {
        const elemento = document.querySelector("#lastUpdateLabel");

        if (!elemento) return;

        const dataAtual = new Date();

        elemento.textContent = `Atualizado em ${dataAtual.toLocaleDateString("pt-BR")} às ${dataAtual.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
    }

    function destruirGrafico(nomeGrafico) {
        if (estadoDashboard.graficos[nomeGrafico]) {
            estadoDashboard.graficos[nomeGrafico].destroy();
        }
    }

    function calcularProgresso(quantidadeAtual, meta) {
        const valorAtual = Number(quantidadeAtual || 0);
        const valorMeta = Number(meta || 0);

        if (valorMeta <= 0) return 0;

        return Math.round((valorAtual / valorMeta) * 100);
    }

    function calcularMediaDasMetas(compras) {
        if (!compras.length) return 0;

        const somaDosProgressos = compras.reduce((total, compra) => {
            return total + calcularProgresso(compra.quantidadeAtual, compra.meta);
        }, 0);

        return Math.round(somaDosProgressos / compras.length);
    }

    function criarBadgeStatus(progresso, status) {
        if (progresso >= 100 || status === "meta_atingida") {
            return `
                <span class="rounded-full bg-nexus-light px-3 py-1 text-xs font-bold text-nexus-secondary">
                    Meta atingida
                </span>
            `;
        }

        return `
            <span class="rounded-full bg-nexus-background px-3 py-1 text-xs font-bold text-nexus-primary">
                Em andamento
            </span>
        `;
    }

    function criarEstadoVazio(titulo, descricao) {
        return `
            <div class="rounded-2xl border border-dashed border-nexus-border bg-nexus-background/50 p-8 text-center">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-nexus-primary">
                    <i class="ti ti-info-circle text-2xl"></i>
                </div>

                <h3 class="mt-4 text-sm font-semibold text-nexus-dark">${titulo}</h3>
                <p class="mt-1 text-sm text-nexus-muted">${descricao}</p>
            </div>
        `;
    }

    function buscarIconeDaAtividade(tipo) {
        const icones = {
            compra: "ti ti-package",
            produto: "ti ti-box",
            fornecedor: "ti ti-building-warehouse",
            economia: "ti ti-pig-money",
            meta: "ti ti-target-arrow",
            alerta: "ti ti-alert-circle",
            usuario: "ti ti-user"
        };

        return icones[tipo] || "ti ti-info-circle";
    }

    function buscarDadosDeEconomiaPorPeriodo(periodo) {
        const dados = {
            "7": {
                rotulos: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                valores: [320, 480, 610, 720, 880, 1040, 1280]
            },
            "30": {
                rotulos: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
                valores: [1850, 3120, 4870, 6420]
            },
            "90": {
                rotulos: ["Abril", "Maio", "Junho"],
                valores: [8200, 12450, 17890]
            }
        };

        return dados[periodo] || dados["30"];
    }

    function buscarArrayNoLocalStorage(chaves) {
        for (const chave of chaves) {
            const valor = localStorage.getItem(chave);

            if (!valor) continue;

            try {
                const valorConvertido = JSON.parse(valor);

                if (Array.isArray(valorConvertido)) {
                    return valorConvertido;
                }
            } catch (erro) {
                console.warn(`Erro ao ler ${chave}:`, erro);
            }
        }

        return null;
    }

    function buscarObjetoNoLocalStorage(chaves) {
        for (const chave of chaves) {
            const valor = localStorage.getItem(chave);

            if (!valor) continue;

            try {
                const valorConvertido = JSON.parse(valor);

                if (valorConvertido && typeof valorConvertido === "object") {
                    return valorConvertido;
                }
            } catch (erro) {
                console.warn(`Erro ao ler ${chave}:`, erro);
            }
        }

        return null;
    }

    function alterarTexto(id, valor) {
        const elemento = document.querySelector(`#${id}`);

        if (elemento) {
            elemento.textContent = valor;
        }
    }

    function normalizarTexto(valor) {
        return String(valor || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function formatarMoedaCompacta(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            notation: "compact",
            maximumFractionDigits: 1
        });
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function criarProdutosExemplo() {
        return [
            {
                id: 1,
                nome: "Arroz Tipo 1 - Fardo 30kg",
                categoria: "Alimentos",
                fornecedor: "Distribuidora VerdeVale",
                preco: 129.9,
                desconto: 18
            },
            {
                id: 2,
                nome: "Óleo de Soja - Caixa 20un",
                categoria: "Alimentos",
                fornecedor: "Atacado Bom Preço",
                preco: 139.5,
                desconto: 14
            },
            {
                id: 3,
                nome: "Detergente Neutro - Caixa 24un",
                categoria: "Limpeza",
                fornecedor: "Higimax Distribuição",
                preco: 62.9,
                desconto: 22
            },
            {
                id: 4,
                nome: "Papel Higiênico - Fardo 64un",
                categoria: "Higiene",
                fornecedor: "Sul Clean",
                preco: 84.9,
                desconto: 16
            },
            {
                id: 5,
                nome: "Café Tradicional - Caixa 20un",
                categoria: "Bebidas",
                fornecedor: "Café Serra Forte",
                preco: 198.0,
                desconto: 12
            },
            {
                id: 6,
                nome: "Açúcar Cristal - Fardo 30kg",
                categoria: "Alimentos",
                fornecedor: "Distribuidora VerdeVale",
                preco: 114.9,
                desconto: 10
            }
        ];
    }

    function criarFornecedoresExemplo() {
        return [
            {
                id: 1,
                nome: "Distribuidora VerdeVale",
                categoria: "Alimentos básicos",
                avaliacao: 4.9,
                status: "Confiável"
            },
            {
                id: 2,
                nome: "Higimax Distribuição",
                categoria: "Produtos de limpeza",
                avaliacao: 4.8,
                status: "Confiável"
            },
            {
                id: 3,
                nome: "Atacado Bom Preço",
                categoria: "Mercearia",
                avaliacao: 4.7,
                status: "Verificado"
            },
            {
                id: 4,
                nome: "Sul Clean",
                categoria: "Higiene",
                avaliacao: 4.6,
                status: "Verificado"
            },
            {
                id: 5,
                nome: "Café Serra Forte",
                categoria: "Bebidas",
                avaliacao: 4.5,
                status: "Verificado"
            }
        ];
    }

    function criarComprasColetivasExemplo() {
        return [
            {
                id: 1,
                produto: "Arroz Tipo 1 - Fardo 30kg",
                fornecedor: "Distribuidora VerdeVale",
                categoria: "Alimentos",
                quantidadeAtual: 760,
                meta: 1000,
                participantes: 34,
                prazo: "2026-07-05",
                economiaEstimada: 4280,
                status: "ativa"
            },
            {
                id: 2,
                produto: "Detergente Neutro - Caixa 24un",
                fornecedor: "Higimax Distribuição",
                categoria: "Limpeza",
                quantidadeAtual: 480,
                meta: 600,
                participantes: 21,
                prazo: "2026-06-28",
                economiaEstimada: 2370,
                status: "ativa"
            },
            {
                id: 3,
                produto: "Óleo de Soja - Caixa 20un",
                fornecedor: "Atacado Bom Preço",
                categoria: "Alimentos",
                quantidadeAtual: 920,
                meta: 900,
                participantes: 42,
                prazo: "2026-06-22",
                economiaEstimada: 5140,
                status: "meta_atingida"
            },
            {
                id: 4,
                produto: "Papel Higiênico - Fardo 64un",
                fornecedor: "Sul Clean",
                categoria: "Higiene",
                quantidadeAtual: 310,
                meta: 500,
                participantes: 18,
                prazo: "2026-07-12",
                economiaEstimada: 1690,
                status: "ativa"
            },
            {
                id: 5,
                produto: "Café Tradicional - Caixa 20un",
                fornecedor: "Café Serra Forte",
                categoria: "Bebidas",
                quantidadeAtual: 240,
                meta: 400,
                participantes: 15,
                prazo: "2026-07-18",
                economiaEstimada: 1420,
                status: "ativa"
            }
        ];
    }

    function criarAtividadesExemplo() {
        return [
            {
                tipo: "meta",
                titulo: "Meta atingida em Óleo de Soja",
                descricao: "A compra coletiva ultrapassou a meta definida pelo fornecedor.",
                tempo: "Há 12 min"
            },
            {
                tipo: "compra",
                titulo: "Nova participação registrada",
                descricao: "Um revendedor entrou na compra coletiva de Arroz Tipo 1.",
                tempo: "Há 28 min"
            },
            {
                tipo: "produto",
                titulo: "Novo produto disponível",
                descricao: "Detergente Neutro entrou no catálogo com desconto progressivo.",
                tempo: "Há 1h"
            },
            {
                tipo: "fornecedor",
                titulo: "Fornecedor verificado",
                descricao: "Higimax Distribuição recebeu status de fornecedor confiável.",
                tempo: "Há 3h"
            },
            {
                tipo: "economia",
                titulo: "Economia atualizada",
                descricao: "A economia estimada das compras ativas foi recalculada.",
                tempo: "Hoje"
            }
        ];
    }

    function criarNotificacoesExemplo() {
        return [
            {
                tipo: "meta",
                titulo: "Meta próxima de ser atingida",
                descricao: "A compra de Arroz Tipo 1 já passou de 75% da meta.",
                tempo: "Agora",
                lida: false
            },
            {
                tipo: "alerta",
                titulo: "Prazo se aproximando",
                descricao: "A compra de Detergente Neutro encerra em breve.",
                tempo: "Há 20 min",
                lida: false
            },
            {
                tipo: "produto",
                titulo: "Nova oportunidade cadastrada",
                descricao: "Um novo produto com desconto por volume foi adicionado.",
                tempo: "Hoje",
                lida: true
            }
        ];
    }
});