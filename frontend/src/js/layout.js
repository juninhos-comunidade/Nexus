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
    const fotosPreview = document.querySelectorAll("#fotoPreview");
    const btnSair = document.getElementById("btnSair");

    const openSidebar = document.getElementById("openSidebar");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function carregarDadosUsuario() {
        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome || usuario.nomeCompleto || "usuário";
        }

        if (usuario.fotoPerfil) {
            fotosPreview.forEach((img) => {
                img.src = usuario.fotoPerfil;
            });
        }
    }

    function sairDoSistema() {
        localStorage.removeItem("nexusToken");
        localStorage.removeItem("usuarioNexus");
        window.location.href = "./home.html";
    }

    function ativarMenuAtual() {
        const paginaAtual = window.location.pathname.split("/").pop();
        const menuItems = document.querySelectorAll(".menu-item");

        menuItems.forEach((item) => {
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

    function abrirSidebarMobile() {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.remove("-translate-x-full");
        sidebarOverlay.classList.remove("hidden");
    }

    function fecharSidebarMobile() {
        if (!sidebar || !sidebarOverlay) return;

        sidebar.classList.add("-translate-x-full");
        sidebarOverlay.classList.add("hidden");
    }

    if (btnSair) {
        btnSair.addEventListener("click", sairDoSistema);
    }

    if (openSidebar) {
        openSidebar.addEventListener("click", abrirSidebarMobile);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", fecharSidebarMobile);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharSidebarMobile();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
            fecharSidebarMobile();
        }
    });

    carregarDadosUsuario();
    ativarMenuAtual();
});