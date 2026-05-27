let currentTab = 'login';

function switchTab(tab) {
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');
    const loginFooter = document.getElementById('loginFooter');
    const cadastroFooter = document.getElementById('cadastroFooter');
    const messageContainer = document.getElementById('messageContainer');

    if (messageContainer) {
        messageContainer.classList.add('hidden');
        messageContainer.innerHTML = '';
    }

    formLogin.reset();
    formCadastro.reset();

    const camposFornecedor = document.getElementById('camposFornecedor');
    if (camposFornecedor) camposFornecedor.classList.add('hidden');

    if (tab === 'login') {
        currentTab = 'login';
        formCadastro.classList.add('opacity-0', 'hidden');
        formLogin.classList.remove('hidden', 'opacity-0');
        formLogin.classList.add('opacity-100');

        loginFooter.classList.remove('hidden');
        cadastroFooter.classList.add('hidden');

        if (tabLoginBtn && tabCadastroBtn) {
            tabLoginBtn.classList.remove('inactive-tab');
            tabLoginBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabLoginBtn.classList.remove('text-nexus-dark', 'hover:bg-white/60');

            tabCadastroBtn.classList.remove('active-tab');
            tabCadastroBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
            tabCadastroBtn.classList.remove('bg-nexus-primary', 'text-white', 'shadow-sm');
        }
    } else if (tab === 'cadastro') {
        currentTab = 'cadastro';
        formLogin.classList.add('opacity-0', 'hidden');
        formCadastro.classList.remove('hidden', 'opacity-0');
        formCadastro.classList.add('opacity-100');

        loginFooter.classList.add('hidden');
        cadastroFooter.classList.remove('hidden');

        if (tabCadastroBtn && tabLoginBtn) {
            tabCadastroBtn.classList.remove('inactive-tab');
            tabCadastroBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabCadastroBtn.classList.remove('text-nexus-dark', 'hover:bg-white/60');

            tabLoginBtn.classList.remove('active-tab');
            tabLoginBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
            tabLoginBtn.classList.remove('bg-nexus-primary', 'text-white', 'shadow-sm');
        }
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

document.addEventListener('DOMContentLoaded', function () {
    const confirmaSenhaInput = document.getElementById('cadastroConfirmaSenha');
    const senhaInput = document.getElementById('cadastroSenha');
    const selectPerfil = document.getElementById('cadastroPerfil');
    const camposFornecedor = document.getElementById('camposFornecedor');

    if (selectPerfil && camposFornecedor) {
        selectPerfil.addEventListener('change', function (e) {
            if (e.target.value.toUpperCase() === 'FORNECEDOR') {
                camposFornecedor.classList.remove('hidden');
            } else {
                camposFornecedor.classList.add('hidden');
            }
        });
    }

    if (confirmaSenhaInput && senhaInput) {
        confirmaSenhaInput.addEventListener('input', function () {
            if (confirmaSenhaInput.value && senhaInput.value) {
                if (confirmaSenhaInput.value === senhaInput.value) {
                    confirmaSenhaInput.classList.remove('border-red-500');
                    confirmaSenhaInput.classList.add('border-green-500');
                } else {
                    confirmaSenhaInput.classList.remove('border-green-500');
                    confirmaSenhaInput.classList.add('border-red-500');
                }
            }
        });
    }

    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = formCadastro.querySelector('button[type="submit"]');
            const nome = document.getElementById('cadastroNome').value.trim();
            const email = document.getElementById('cadastroEmail').value.trim();
            const senha = senhaInput.value;
            const confirmaSenha = confirmaSenhaInput.value;
            const nomeNegocio = document.getElementById('cadastroNomeNegocio').value.trim();
            const telefone = document.getElementById('cadastroTelefone').value.trim();
            const perfil = selectPerfil ? selectPerfil.value : '';

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
            if (senha.length < 8 || senha.length > 64) {
                showMessage('A senha deve ter entre 8 e 64 caracteres', 'error');
                return;
            }
            if (senha !== confirmaSenha) {
                showMessage('As senhas não coincidem. Verifique e tente novamente', 'error');
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

            const payload = {
                nome: nome,
                email: email,
                senha: senha,
                telefone: telefone.replace(/\D/g, ''),
                tipoUsuario: perfil.toUpperCase(),
                nomeNegocio: nomeNegocio,
                cnpj: perfil.toUpperCase() === 'FORNECEDOR' ? document.getElementById('cadastroCnpj').value.trim() : null,
                categoria: perfil.toUpperCase() === 'FORNECEDOR' ? document.getElementById('cadastroCategoria').value.trim() : null,
                descricao: perfil.toUpperCase() === 'FORNECEDOR' ? document.getElementById('cadastroDescricao').value.trim() : null
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Cadastrando...';
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const textResponse = await response.text();

                if (response.ok && textResponse.toLowerCase().includes('sucesso')) {
                    showMessage('Conta criada com sucesso! Faça login.', 'success');
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Criar conta';
                        }
                        switchTab('login');
                    }, 2000);
                } else {
                    showMessage(textResponse, 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Criar conta';
                    }
                }
            } catch (err) {
                console.error(err);
                showMessage('Erro de ligação ao servidor. Verifique se a API está a correr.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Criar conta';
                }
            }
        });
    }

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async function (e) {
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

            const payload = {
                email: email,
                senha: password
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Entrando...';
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const textResponse = await response.text();

                if (response.ok && textResponse.includes('Bearer')) {
                    const token = textResponse.replace('Bearer ', '').trim();
                    localStorage.setItem('nexusToken', token);
                    
                    showMessage('Login efetuado com sucesso!', 'success');
                    
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Entrar';
                        }
                        window.location.href = 'home.html';
                    }, 1000);
                } else {
                    showMessage('E-mail ou senha incorretos.', 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Entrar';
                    }
                }
            } catch (err) {
                console.error(err);
                showMessage('Erro de ligação ao servidor. Verifique se a API está a correr.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            }
        });
    }

    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
    if (tabCadastroBtn) tabCadastroBtn.addEventListener('click', () => switchTab('cadastro'));
});

window.addEventListener('load', function () {
    if (window.location.hash === '#formCadastro') {
        switchTab('cadastro');
    } else {
        switchTab('login');
    }
});