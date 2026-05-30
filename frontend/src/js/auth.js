let currentTab = 'login';

function switchTab(tab) {
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');
    const loginFooter = document.getElementById('loginFooter');
    const cadastroFooter = document.getElementById('cadastroFooter');
    const messageContainer = document.getElementById('messageContainer');

    messageContainer.classList.add('hidden');
    messageContainer.innerHTML = '';

    formLogin.reset();
    formCadastro.reset();

    if (tab === 'login') {
        currentTab = 'login';

        formCadastro.classList.add('opacity-0');

        formCadastro.classList.add('hidden');

        formLogin.classList.remove('hidden');
        formLogin.classList.remove('opacity-0');
        formLogin.classList.add('opacity-100');

        loginFooter.classList.remove('hidden');
        cadastroFooter.classList.add('hidden');

        tabLoginBtn.classList.remove('inactive-tab');
        tabLoginBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
        tabLoginBtn.classList.remove('text-nexus-dark', 'hover:bg-white/60');

        tabCadastroBtn.classList.remove('active-tab');
        tabCadastroBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        tabCadastroBtn.classList.remove('bg-nexus-primary', 'text-white', 'shadow-sm');

    } else if (tab === 'cadastro') {
        currentTab = 'cadastro';

        formLogin.classList.add('opacity-0');

        formLogin.classList.add('hidden');

        formCadastro.classList.remove('hidden');
        formCadastro.classList.remove('opacity-0');
        formCadastro.classList.add('opacity-100');


        loginFooter.classList.add('hidden');
        cadastroFooter.classList.remove('hidden');

        tabCadastroBtn.classList.remove('inactive-tab');
        tabCadastroBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
        tabCadastroBtn.classList.remove('text-nexus-dark', 'hover:bg-white/60');

        tabLoginBtn.classList.remove('active-tab');
        tabLoginBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        tabLoginBtn.classList.remove('bg-nexus-primary', 'text-white', 'shadow-sm');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showMessage(message, type = 'error') {
    const box = document.getElementById('messageContainer');

    clearTimeout(box.showTimer);
    clearTimeout(box.hideTimer);

    const baseClasses = `
        fixed top-5 right-5 z-50
        px-5 py-3 rounded-xl border shadow-lg
        transition-all ease-out
        opacity-0 translate-x-8 scale-95 blur-sm
        duration-300
    `;

    const typeClasses = {
        error: 'bg-red-100 text-red-800 border-red-300',
        success: 'bg-green-100 text-green-800 border-green-300'
    };

    box.innerHTML = message;
    box.className = `${baseClasses} ${typeClasses[type] || typeClasses.error}`;

    box.showTimer = setTimeout(() => {
        box.classList.remove('opacity-0', 'translate-x-8', 'scale-95', 'blur-sm');
        box.classList.add('opacity-100', 'translate-x-0', 'scale-100', 'blur-0');
    }, 200);

    box.hideTimer = setTimeout(() => {
        box.classList.remove('opacity-100', 'translate-x-0', 'scale-100', 'blur-0', 'duration-300');
        box.classList.add('opacity-0', 'translate-x-8', 'scale-95', 'blur-sm', 'duration-[400ms]', 'ease-in');

        setTimeout(() => {
            box.classList.add('hidden');
        }, 400);
    }, 3000);
}

function hideMessage() {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer.showTimer) clearTimeout(messageContainer.showTimer);
    if (messageContainer.hideTimer) clearTimeout(messageContainer.hideTimer);
    messageContainer.classList.add('hidden');
    messageContainer.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const confirmaSenhaInput = document.getElementById('cadastroConfirmaSenha');
    const senhaInput = document.getElementById('cadastroSenha');

    if (confirmaSenhaInput && senhaInput) {
        confirmaSenhaInput.addEventListener('input', function () {
            if (confirmaSenhaInput.value && senhaInput.value) {
                if (confirmaSenhaInput.value === senhaInput.value) {
                    confirmaSenhaInput.classList.remove('border-nexus-border', 'border-red-500');
                    confirmaSenhaInput.classList.add('border-green-500');
                } else {
                    confirmaSenhaInput.classList.remove('border-nexus-border', 'border-green-500');
                    confirmaSenhaInput.classList.add('border-red-500');
                }
            }
        });
    }

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = formLogin.querySelector('button[type="submit"]');
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                showMessage('Por favor, preencha todos os campos', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('E-mail inválido. Verifique e tente novamente', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('A senha deve ter no mínimo 6 caracteres', 'error');
                return;
            }

            let usuarioSalvo = null;
            try {
                const dados = localStorage.getItem('usuarioNexus');
                usuarioSalvo = dados ? JSON.parse(dados) : null;
            } catch (err) {
                showMessage('Erro ao acessar dados. Tente novamente.', 'error');
                console.error('Erro ao fazer parse do usuário:', err);
                return;
            }

            if (!usuarioSalvo) {
                showMessage('Nenhum usuário cadastrado. Crie uma conta primeiro.', 'error');
                return;
            }

            if (email !== usuarioSalvo.email) {
                showMessage('E-mail não cadastrado. Verifique ou crie uma nova conta.', 'error');
                return;
            }


            if (password !== usuarioSalvo.senha) {
                showMessage('A senha está incorreta', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Entrando...';
            }

            console.log('Login realizado:', usuarioSalvo);

            setTimeout(() => {
                showMessage(`Seja bem vindo ao Nexus, ${usuarioSalvo.nome}`, 'success');

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }

                window.location.href = './user.html';
            }, 800);
        });
    }

    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = formCadastro.querySelector('button[type="submit"]');
            const nome = document.getElementById('cadastroNome').value.trim();
            const email = document.getElementById('cadastroEmail').value.trim();
            const senha = document.getElementById('cadastroSenha').value;
            const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;
            const nomeNegocio = document.getElementById('cadastroNomeNegocio').value.trim();
            const telefone = document.getElementById('cadastroTelefone').value.trim();
            const perfil = document.getElementById('cadastroPerfil').value;

            if (!nome || !email || !senha || !confirmaSenha || !nomeNegocio || !telefone || !perfil) {
                showMessage('Por favor, preencha todos os campos', 'error');
                return;
            }

            if (nome.length < 3) {
                showMessage('Nome deve ter no mínimo 3 caracteres', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('E-mail inválido. Verifique e tente novamente', 'error');
                return;
            }

            if (senha.length < 8) {
                showMessage('A senha deve ter no mínimo 8 caracteres', 'error');
                return;
            } else if (senha.length > 64) {
                showMessage('A senha deve ter no máximo 64 caracteres', 'error');
                return;
            }

            if (senha !== confirmaSenha) {
                showMessage('As senhas não coincidem. Verifique e tente novamente', 'error');
                document.getElementById('cadastroConfirmaSenha').classList.remove('border-green-500');
                document.getElementById('cadastroConfirmaSenha').classList.add('border-red-500');
                return;
            }

            if (nomeNegocio.length < 3) {
                showMessage('Nome do negócio deve ter no mínimo 3 caracteres', 'error');
                return;
            }

            if (!isValidPhone(telefone)) {
                showMessage('Telefone inválido. Use o formato (11) 99999-9999', 'error');
                return;
            }

            if (perfil !== 'revendedor' && perfil !== 'fornecedor') {
                showMessage('Por favor, selecione um perfil válido', 'error');
                return;
            }

            const dados = {
                nome: nome.trim().split(/\s+/)[0],
                email,
                senha,
                nomeNegocio,
                telefone,
                perfil
            };

            try {
                localStorage.setItem('usuarioNexus', JSON.stringify(dados));
            } catch (err) {
                showMessage('Erro ao salvar dados. Tente novamente.', 'error');
                console.error('Erro ao salvar no localStorage:', err);
                return;
            }

            console.log('Cadastro salvo:', dados);


            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Cadastrando...';
            }

            showMessage('Conta criada. Boas-vindas ao Nexus.', 'success');

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Cadastrar';
                }
                switchTab('login');
            }, 2000);
        });
    }

    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');

    if (tabLoginBtn) {
        tabLoginBtn.addEventListener('click', () => switchTab('login'));
    }

    if (tabCadastroBtn) {
        tabCadastroBtn.addEventListener('click', () => switchTab('cadastro'));
    }


    const telefonInput = document.getElementById('cadastroTelefone');
    if (telefonInput) {
        telefonInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                }
            }

            e.target.value = value;
        });
    }
});


window.addEventListener('load', function () {
    switchTab('login');
});
