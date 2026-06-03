document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("open-modal");
    const close_modal = document.getElementById("close");
    

    btn.addEventListener("click", () => {
        modal.classList.add("flex");
        modal.classList.remove("hidden");
    })

    close_modal.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    })


    window.addEventListener("click", (e) => {
        if(e.target == modal){
            modal.classList.add("hidden");
        }
    })


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

    function carregarUsuario() {
        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.nome || usuario.nomeCompleto || "usuário";
        }

        if (fotoPreview && usuario.fotoPerfil) {
            fotoPreview.src = usuario.fotoPerfil;
        }
    }


    carregarUsuario();

    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("usuarioNexus");
            window.location.href = "./home.html";
        });
    }
})