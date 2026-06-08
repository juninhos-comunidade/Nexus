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

    const inputNome = document.getElementById("cadastroNome");
    const inputEmail = document.getElementById("cadastroEmail");
    const inputNomeNegocio = document.getElementById("cadastroNomeNegocio");
    const inputTelefone = document.getElementById("cadastroTelefone");
    const inputPerfil = document.getElementById("cadastroPerfil");

    const formularioPerfil = document.getElementById("formularioPerfil");
    const btnSair = document.getElementById("btnSair");

    const fotoInput = document.getElementById("fotoInput");
    const fotosPreview = document.querySelectorAll("#fotoPreview");

    function atualizarNomeNaTela(nome) {
        if (nomeUsuario) {
            nomeUsuario.textContent = nome || "usuário";
        }
    }

    function preencherFormulario() {
        if (inputNome) inputNome.value = usuario.nomeCompleto || usuario.nome || "";
        if (inputEmail) inputEmail.value = usuario.email || "";
        if (inputNomeNegocio) inputNomeNegocio.value = usuario.nomeNegocio || "";
        if (inputTelefone) inputTelefone.value = usuario.telefone || "";
        if (inputPerfil) inputPerfil.value = usuario.perfil || "";

        if (usuario.fotoPerfil) {
            fotosPreview.forEach((img) => {
                img.src = usuario.fotoPerfil;
            });
        }

        atualizarNomeNaTela(usuario.nome);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\(\)]{10,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ""));
    }

    function showMessage(message, type = "error") {
        const mensagem = document.getElementById("messageContainer");

        if (!mensagem) {
            alert(message);
            return;
        }

        clearTimeout(mensagem.hideTimer);
        clearTimeout(mensagem.removeTimer);

        const baseClasses = [
            "mb-3",
            "rounded-lg",
            "px-4",
            "py-3",
            "text-lg",
            "font-medium",
            "border",
            "transition-all",
            "duration-500",
            "ease-in-out"
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

        mensagem.className = "";
        mensagem.textContent = message;

        mensagem.classList.add(...baseClasses);

        if (type === "success") {
            mensagem.classList.add(...successClasses);
        } else {
            mensagem.classList.add(...errorClasses);
        }

        mensagem.classList.add("opacity-0", "-translate-y-2");
        mensagem.classList.remove("hidden");

        setTimeout(() => {
            mensagem.classList.remove("opacity-0", "-translate-y-2");
            mensagem.classList.add("opacity-100", "translate-y-0");
        }, 50);

        mensagem.hideTimer = setTimeout(() => {
            mensagem.classList.remove("opacity-100", "translate-y-0");
            mensagem.classList.add("opacity-0", "-translate-y-2");

            mensagem.removeTimer = setTimeout(() => {
                mensagem.classList.add("hidden");
            }, 500);
        }, 4000);
    }

    if (formularioPerfil) {
        formularioPerfil.addEventListener("submit", (e) => {
            e.preventDefault();

            const nomeCompleto = inputNome.value.trim();
            const email = inputEmail.value.trim();
            const nomeNegocio = inputNomeNegocio.value.trim();
            const telefone = inputTelefone.value.trim();
            const perfil = inputPerfil.value;

            if (!nomeCompleto || !email || !nomeNegocio || !telefone || !perfil) {
                showMessage("Por favor, preencha todos os campos.", "error");
                return;
            }

            if (nomeCompleto.length < 3) {
                showMessage("Nome deve ter no mínimo 3 caracteres.", "error");
                return;
            }

            if (!isValidEmail(email)) {
                showMessage("E-mail inválido. Verifique e tente novamente.", "error");
                return;
            }

            if (nomeNegocio.length < 3) {
                showMessage("Nome do negócio deve ter no mínimo 3 caracteres.", "error");
                return;
            }

            if (!isValidPhone(telefone)) {
                showMessage("Telefone inválido. Use o formato (11) 99999-9999.", "error");
                return;
            }

            if (perfil !== "revendedor" && perfil !== "fornecedor") {
                showMessage("Selecione um perfil válido.", "error");
                return;
            }

            const dadosAtualizados = {
                ...usuario,
                nome: nomeCompleto.split(/\s+/)[0],
                nomeCompleto,
                email,
                nomeNegocio,
                telefone,
                perfil
            };

            localStorage.setItem("usuarioNexus", JSON.stringify(dadosAtualizados));

            usuario = dadosAtualizados;

            atualizarNomeNaTela(usuario.nome);

            showMessage("Informações salvas com sucesso.", "success");
        });
    }

    if (fotoInput) {
        fotoInput.addEventListener("change", () => {
            const file = fotoInput.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showMessage("Escolha um arquivo de imagem válido.", "error");
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                const fotoBase64 = reader.result;

                fotosPreview.forEach((img) => {
                    img.src = fotoBase64;
                });

                usuario.fotoPerfil = fotoBase64;
                localStorage.setItem("usuarioNexus", JSON.stringify(usuario));

                showMessage("Foto atualizada com sucesso.", "success");
            };

            reader.readAsDataURL(file);
        });
    }

    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("nexusToken");
            localStorage.removeItem("usuarioNexus");
            window.location.href = "./home.html";
        });
    }

    preencherFormulario();
    ativarMenuAtual();
});