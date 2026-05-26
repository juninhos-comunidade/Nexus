let currentTab = 'login';

function switchTab(tab) {
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');
    const loginFooter = document.getElementById('loginFooter');
    const cadastroFooter = document.getElementById('cadastroFooter');

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

        if(tabLoginBtn && tabCadastroBtn) {
            tabLoginBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabLoginBtn.classList.remove('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
            tabCadastroBtn.classList.remove('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabCadastroBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        }
    } else if (tab === 'cadastro') {
        currentTab = 'cadastro';

        formLogin.classList.add('opacity-0', 'hidden');
        formCadastro.classList.remove('hidden', 'opacity-0');
        formCadastro.classList.add('opacity-100');

        loginFooter.classList.add('hidden');
        cadastroFooter.classList.remove('hidden');

        if(tabLoginBtn && tabCadastroBtn) {
            tabCadastroBtn.classList.add('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabCadastroBtn.classList.remove('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
            tabLoginBtn.classList.remove('active-tab', 'bg-nexus-primary', 'text-white', 'shadow-sm');
            tabLoginBtn.classList.add('inactive-tab', 'text-nexus-dark', 'hover:bg-white/60');
        }
    }
}

function showMessage(mensagem, tipo = 'error') {
    alert((tipo === 'success' ? '✅ Sucesso: ' : '❌ Erro: ') + mensagem);
}

document.addEventListener('DOMContentLoaded', function () {

    const selectPerfil = document.getElementById('cadastroPerfil');
    const camposFornecedor = document.getElementById('camposFornecedor');

    if (selectPerfil) {
        selectPerfil.addEventListener('change', function (e) {
            if (e.target.value.toUpperCase() === 'FORNECEDOR') {
                camposFornecedor.classList.remove('hidden');
            } else {
                camposFornecedor.classList.add('hidden');
            }
        });
    }

    const tabLoginBtn = document.getElementById('tabLogin');
    const tabCadastroBtn = document.getElementById('tabCadastro');

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
    if (tabCadastroBtn) tabCadastroBtn.addEventListener('click', () => switchTab('cadastro'));

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

    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = formCadastro.querySelector('button[type="submit"]');
            
            const perfilSelecionado = selectPerfil ? selectPerfil.value.toUpperCase() : 'USUARIO';

            const payload = {
                nome: document.getElementById('cadastroNome') ? document.getElementById('cadastroNome').value : '',
                email: document.getElementById('cadastroEmail') ? document.getElementById('cadastroEmail').value : '',
                senha: document.getElementById('cadastroSenha') ? document.getElementById('cadastroSenha').value : '',
                telefone: document.getElementById('cadastroTelefone') ? document.getElementById('cadastroTelefone').value.replace(/\D/g, '') : '',
                tipoUsuario: perfilSelecionado,
                nomeNegocio: document.getElementById('cadastroNomeNegocio') ? document.getElementById('cadastroNomeNegocio').value : '',

                cnpj: perfilSelecionado === 'FORNECEDOR' && document.getElementById('cadastroCnpj') ? document.getElementById('cadastroCnpj').value : null,
                categoria: perfilSelecionado === 'FORNECEDOR' && document.getElementById('cadastroCategoria') ? document.getElementById('cadastroCategoria').value : null,
                descricao: perfilSelecionado === 'FORNECEDOR' && document.getElementById('cadastroDescricao') ? document.getElementById('cadastroDescricao').value : null
            };

            const confirmaSenha = document.getElementById('cadastroConfirmaSenha');
            if (confirmaSenha && confirmaSenha.value !== payload.senha) {
                showMessage('As senhas não coincidem!', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Aguarde...';

            try {
                const response = await fetch('http://localhost:8080/api/auth/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const textResponse = await response.text();

                if (response.ok && textResponse.toLowerCase().includes('sucesso')) {
                    showMessage('Conta criada com sucesso! Faça login.', 'success');
                    setTimeout(() => switchTab('login'), 1500);
                } else {
                    showMessage(textResponse, 'error');
                }
            } catch (error) {
                console.error(error);
                showMessage('Erro de ligação ao servidor. Verifique se a API está a correr.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Criar conta';
            }
        });
    }

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = formLogin.querySelector('button[type="submit"]');
            
            const payload = {
                email: document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : '',
                senha: document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : ''
            };

            submitBtn.disabled = true;
            submitBtn.textContent = 'A entrar...';

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

                } else {
                    showMessage('E-mail ou palavra-passe incorretos.', 'error');
                }
            } catch (error) {
                console.error(error);
                showMessage('Erro de ligação ao servidor. Verifique se a API está a correr.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar';
            }
        });
    }
});