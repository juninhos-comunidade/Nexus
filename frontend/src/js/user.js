document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("nexusToken");
    if (!token) return;

    let usuario = {};
    let fotoPerfilCache = localStorage.getItem("usuarioNexus") ? JSON.parse(localStorage.getItem("usuarioNexus")).fotoPerfil : null;

    async function carregarPerfil() {
        try {
            const response = await fetch('http://localhost:8080/api/usuario/perfil', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                usuario = await response.json();
                usuario.fotoPerfil = fotoPerfilCache;
                localStorage.setItem("usuarioNexus", JSON.stringify(usuario));
                preencherFormulario();
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        }
    }

    const nomeUsuario = document.getElementById("nomeUsuario");

    const inputNome = document.getElementById("cadastroNome");
    const inputEmail = document.getElementById("cadastroEmail");
    const inputNomeNegocio = document.getElementById("cadastroNomeNegocio");
    const inputTelefone = document.getElementById("cadastroTelefone");
    const inputPerfil = document.getElementById("cadastroPerfil");

    const formularioPerfil = document.getElementById("formularioPerfil");

    const fotoInput = document.getElementById("fotoInput");
    const fotosPreview = document.querySelectorAll("#fotoPreview");

    function atualizarNomeNaTela(nome) {
        if (nomeUsuario) {
            nomeUsuario.textContent = nome || "usuário";
        }
    }

    function atualizarFotosNaTela(foto) {
        if (!foto) return;

        fotosPreview.forEach((img) => {
            img.src = foto;
        });
    }

    function preencherFormulario() {
        if (inputNome) inputNome.value = usuario.nomeCompleto || usuario.nome || "";
        if (inputEmail) inputEmail.value = usuario.email || "";
        if (inputNomeNegocio) inputNomeNegocio.value = usuario.nomeNegocio || "";
        if (inputTelefone) inputTelefone.value = usuario.telefone || "";
        if (inputPerfil) inputPerfil.value = usuario.perfil || "";

        atualizarNomeNaTela(usuario.nome);
        atualizarFotosNaTela(usuario.fotoPerfil);
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

    function notificarPerfilAtualizado() {
        if (typeof createNotification === "function") {
            createNotification({
                title: "Perfil atualizado",
                message: "Seus dados do perfil foram alterados com sucesso.",
                type: "profile"
            });
        }
    }

    function notificarFotoAtualizada() {
        if (typeof createNotification === "function") {
            createNotification({
                title: "Foto atualizada",
                message: "Sua foto de perfil foi alterada com sucesso.",
                type: "profile"
            });
        }
    }

    if (formularioPerfil) {
        formularioPerfil.addEventListener("submit", async (e) => {
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

            const nomeAtual = usuario.nomeCompleto || usuario.nome || "";
            const nomeNegocioAtual = usuario.nomeNegocio || "";
            const telefoneAtual = usuario.telefone || "";

            const dadosForamAlterados =
                nomeCompleto !== nomeAtual ||
                nomeNegocio !== nomeNegocioAtual ||
                telefone !== telefoneAtual;

            if (!dadosForamAlterados) {
                showMessage("Nenhuma alteração foi feita.", "error");
                return;
            }

            const payload = {
                nome: nomeCompleto.split(/\s+/)[0],
                nomeNegocio: nomeNegocio,
                telefone: telefone.replace(/\D/g, '')
            };

            try {
                const response = await fetch('http://localhost:8080/api/usuario/perfil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    usuario = { ...usuario, ...payload, nomeCompleto };
                    localStorage.setItem("usuarioNexus", JSON.stringify(usuario));

                    atualizarNomeNaTela(usuario.nome);
                    showMessage("Informações salvas com sucesso.", "success");
                    notificarPerfilAtualizado();
                } else {
                    showMessage("Erro ao salvar informações.", "error");
                }
            } catch (err) {
                console.error(err);
                showMessage("Erro de ligação ao servidor.", "error");
            }
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

                if (fotoBase64 === usuario.fotoPerfil) {
                    showMessage("Nenhuma alteração foi feita.", "error");
                    return;
                }

                usuario.fotoPerfil = fotoBase64;
                localStorage.setItem("usuarioNexus", JSON.stringify(usuario));

                atualizarFotosNaTela(fotoBase64);

                showMessage("Foto atualizada com sucesso.", "success");
                notificarFotoAtualizada();
            };

            reader.readAsDataURL(file);
        });
    }

    carregarPerfil();
});