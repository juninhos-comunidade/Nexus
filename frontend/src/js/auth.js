let currentTab = 'login';

function getElement(id) {
    return document.getElementById(id);
}

function resetMessage() {
    const messageContainer = getElement('messageContainer');

    if (messageContainer) {
        messageContainer.classList.add('hidden');
        messageContainer.innerHTML = '';
    }
}

function switchTab(tab) {
    const formLogin = getElement('formLogin');
    const formCadastro = getElement('formCadastro');
    const tabLoginBtn = getElement('tabLogin');
    const tabCadastroBtn = getElement('tabCadastro');
    const loginFooter = getElement('loginFooter');
    const cadastroFooter = getElement('cadastroFooter');
    const camposFornecedor = getElement('camposFornecedor');

    resetMessage();

    if (formLogin) formLogin.reset();
    if (formCadastro) formCadastro.reset();
    if (camposFornecedor) camposFornecedor.classList.add('hidden');

    if (tab === 'login') {
        currentTab = 'login';

        formCadastro.classList.add('opacity-0', 'hidden');
        formLogin.classList.remove('hidden', 'opacity-0');
        formLogin.classList.add('opacity-100');

        loginFooter.classList.remove('hidden');
        cadastroFooter.classList.add('hidden');

        tabLoginBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
        tabLoginBtn.classList.remove('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');

        tabCadastroBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        tabCadastroBtn.classList.remove('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
    }

    if (tab === 'cadastro') {
        currentTab = 'cadastro';

        formLogin.classList.add('opacity-0', 'hidden');
        formCadastro.classList.remove('hidden', 'opacity-0');
        formCadastro.classList.add('opacity-100');

        loginFooter.classList.add('hidden');
        cadastroFooter.classList.remove('hidden');

        tabCadastroBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
        tabCadastroBtn.classList.remove('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');

        tabLoginBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        tabLoginBtn.classList.remove('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
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
    const box = getElement('messageContainer');
    if (!box) return;

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
        box.classList.remove('opacity-0', 'translate-x-8', 'scale-95', 'blur-sm', 'hidden');
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

function setButtonLoading(button, isLoading, loadingText, defaultText) {
    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : defaultText;
}

function handlePerfilFornecedor() {
    const selectPerfil = getElement('cadastroPerfil');
    const camposFornecedor = getElement('camposFornecedor');

    if (!selectPerfil || !camposFornecedor) return;

    selectPerfil.addEventListener('change', function () {
        const perfil = selectPerfil.value.toUpperCase();

        if (perfil === 'FORNECEDOR') {
            camposFornecedor.classList.remove('hidden');
        } else {
            camposFornecedor.classList.add('hidden');
        }
    });
}

function handleConfirmacaoSenha() {
    const senhaInput = getElement('cadastroSenha');
    const confirmaSenhaInput = getElement('cadastroConfirmaSenha');

    if (!senhaInput || !confirmaSenhaInput) return;

    confirmaSenhaInput.addEventListener('input', function () {
        if (!confirmaSenhaInput.value || !senhaInput.value) return;

        if (confirmaSenhaInput.value === senhaInput.value) {
            confirmaSenhaInput.classList.remove('border-red-500');
            confirmaSenhaInput.classList.add('border-green-500');
        } else {
            confirmaSenhaInput.classList.remove('border-green-500');
            confirmaSenhaInput.classList.add('border-red-500');
        }
    });
}

function getCadastroPayload() {
    const perfil = getElement('cadastroPerfil').value;
    const tipoUsuario = perfil.toUpperCase();

    return {
        nome: getElement('cadastroNome').value.trim(),
        email: getElement('cadastroEmail').value.trim(),
        senha: getElement('cadastroSenha').value,
        confirmaSenha: getElement('cadastroConfirmaSenha').value,
        telefone: getElement('cadastroTelefone').value.trim(),
        tipoUsuario: tipoUsuario,
        nomeNegocio: getElement('cadastroNomeNegocio').value.trim(),
        cnpj: tipoUsuario === 'FORNECEDOR' ? getElement('cadastroCnpj').value.trim() : null,
        categoria: tipoUsuario === 'FORNECEDOR' ? getElement('cadastroCategoria').value.trim() : null,
        descricao: tipoUsuario === 'FORNECEDOR' ? getElement('cadastroDescricao').value.trim() : null
    };
}

function validarCadastro(dados) {
    if (
        !dados.nome ||
        !dados.email ||
        !dados.senha ||
        !dados.confirmaSenha ||
        !dados.nomeNegocio ||
        !dados.telefone ||
        !dados.tipoUsuario
    ) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return false;
    }

    if (dados.nome.length < 3) {
        showMessage('Nome deve ter no mínimo 3 caracteres', 'error');
        return false;
    }

    if (!isValidEmail(dados.email)) {
        showMessage('E-mail inválido. Verifique e tente novamente', 'error');
        return false;
    }

    if (dados.senha.length < 8 || dados.senha.length > 64) {
        showMessage('A senha deve ter entre 8 e 64 caracteres', 'error');
        return false;
    }

    if (dados.senha !== dados.confirmaSenha) {
        showMessage('As senhas não coincidem. Verifique e tente novamente', 'error');
        return false;
    }

    if (dados.nomeNegocio.length < 3) {
        showMessage('Nome do negócio deve ter no mínimo 3 caracteres', 'error');
        return false;
    }

    if (!isValidPhone(dados.telefone)) {
        showMessage('Telefone inválido. Use o formato (11) 99999-9999', 'error');
        return false;
    }

    return true;
}

async function cadastrarUsuario(e) {
    e.preventDefault();

    const formCadastro = getElement('formCadastro');
    const submitBtn = formCadastro.querySelector('button[type="submit"]');

    const dados = getCadastroPayload();

    if (!validarCadastro(dados)) return;

    const payload = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        telefone: dados.telefone.replace(/\D/g, ''),
        tipoUsuario: dados.tipoUsuario,
        nomeNegocio: dados.nomeNegocio,
        cnpj: dados.cnpj,
        categoria: dados.categoria,
        descricao: dados.descricao
    };

    setButtonLoading(submitBtn, true, 'Cadastrando...', 'Criar conta');

    try {
        const response = await fetch('http://localhost:8080/api/auth/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.mensagem || 'Conta criada com sucesso! Faça login.', 'success');

            setTimeout(() => {
                setButtonLoading(submitBtn, false, 'Cadastrando...', 'Criar conta');
                switchTab('login');
            }, 2000);

            return;
        }

        showMessage(data.erro || 'Erro ao realizar cadastro.', 'error');
        setButtonLoading(submitBtn, false, 'Cadastrando...', 'Criar conta');
    } catch (err) {
        console.error(err);
        showMessage('Erro de ligação ao servidor. Verifique se a API está correta.', 'error');
        setButtonLoading(submitBtn, false, 'Cadastrando...', 'Criar conta');
    }
}

async function fazerLogin(e) {
    e.preventDefault();

    const formLogin = getElement('formLogin');
    const submitBtn = formLogin.querySelector('button[type="submit"]');

    const email = getElement('loginEmail').value.trim();
    const senha = getElement('loginPassword').value.trim();

    if (!email || !senha) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('E-mail inválido. Verifique e tente novamente', 'error');
        return;
    }

    const payload = {
        email: email,
        senha: senha
    };

    setButtonLoading(submitBtn, true, 'Entrando...', 'Entrar');

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.token) {
            const token = data.token.replace('Bearer ', '').trim();

            localStorage.setItem('nexusToken', token);
            localStorage.setItem('usuarioNexus', JSON.stringify(data.usuario));

            showMessage('Login efetuado com sucesso!', 'success');

            setTimeout(() => {
                setButtonLoading(submitBtn, false, 'Entrando...', 'Entrar');
                window.location.href = 'user.html';
            }, 1000);

            return;
        }

        showMessage(data.erro || 'E-mail ou senha incorretos.', 'error');
        setButtonLoading(submitBtn, false, 'Entrando...', 'Entrar');
    } catch (err) {
        console.error(err);
        showMessage('Erro de ligação ao servidor. Verifique se a API está a correr.', 'error');
        setButtonLoading(submitBtn, false, 'Entrando...', 'Entrar');
    }
}

function iniciarEventos() {
    const formLogin = getElement('formLogin');
    const formCadastro = getElement('formCadastro');
    const tabLoginBtn = getElement('tabLogin');
    const tabCadastroBtn = getElement('tabCadastro');

    if (formLogin) formLogin.addEventListener('submit', fazerLogin);
    if (formCadastro) formCadastro.addEventListener('submit', cadastrarUsuario);

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
    if (tabCadastroBtn) tabCadastroBtn.addEventListener('click', () => switchTab('cadastro'));

    handlePerfilFornecedor();
    handleConfirmacaoSenha();
}

function alternarVisibilidadeSenha(inputId, buttonId, iconId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = document.getElementById(iconId);

    if (!input || !button || !icon) return;

    button.addEventListener('click', function () {
        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';

        icon.classList.toggle('ti-eye', !isPassword);
        icon.classList.toggle('ti-eye-off', isPassword);
    });
}

function mostrarSenhaLogin() {
    alternarVisibilidadeSenha('loginPassword', 'toggleLoginPassword', 'eyeIcon');
}

function mostrarSenhaCadastro() {
    alternarVisibilidadeSenha('cadastroSenha', 'toggleCadastroPassword', 'eyeIconCadastro');
}

function mostrarConfirmarSenha() {
    alternarVisibilidadeSenha('cadastroConfirmaSenha', 'toggleConfirmarPassword', 'eyeIconConfirmar');
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarEventos();
    mostrarSenhaLogin();
    mostrarSenhaCadastro();
    mostrarConfirmarSenha();

    if (window.location.hash === '#formCadastro') {
        switchTab('cadastro');
    } else {
        switchTab('login');
    }
});