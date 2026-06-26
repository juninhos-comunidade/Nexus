# 🖥️ Pendências de Integração no Frontend

> Este documento consolida as alterações necessárias no frontend para se adequar às mudanças de validações, regras de negócio e segurança que acabaram de ser implementadas no backend.

---

## 1. Tratamento de Erros e Validações (Bean Validation)

**Arquivo Impactado:** `auth.js`
- **O que mudou no backend:** O backend agora valida os campos obrigatórios e formatos (ex: e-mail válido, tamanho de senha) no momento de Cadastro e Login. Se falhar, retorna HTTP `400 Bad Request`.
- **O que fazer no frontend:**
  - O JSON de erro retornado terá uma propriedade `erros` que é uma **lista de strings**. Cada item terá o formato `"campo: mensagem"` (ex: `"email: não deve estar em branco"`).
  - Atualize o código que captura os erros do `fetch` para exibir essa lista ao usuário de forma amigável, possivelmente iterando sobre o array `erros` caso exista.

---

## 2. Compras Coletivas: Expiradas e Status Completos

**Arquivo Impactado:** `comprasColetivas.js`
- **O que mudou no backend:**
  - O banco de dados agora tem 6 status: `ABERTA`, `EM_ANDAMENTO`, `META_ATINGIDA`, `FINALIZADA`, `EXPIRADA` e `CANCELADA`.
  - O backend bloqueia a participação em compras coletivas onde a `dataLimite` já passou, ou onde o status não é `ABERTA` nem `EM_ANDAMENTO`.
- **O que fazer no frontend:**
  - **Função `getStatusClass()`:** Atualize essa função para retornar cores/classes adequadas para os 6 novos status (ex: `EM_ANDAMENTO` -> azul, `EXPIRADA` -> cinza, `FINALIZADA` -> verde escuro, `CANCELADA` -> vermelho).
  - **Botão Participar:** Desabilite visualmente o botão "Participar" ou oculte-o quando a compra listada estiver em qualquer status que não seja `ABERTA` ou `EM_ANDAMENTO`.
  - **Erros de API:** Se a participação falhar por expiração, o backend retornará um HTTP 400 com a mensagem na propriedade `erro`. Assegure-se de exibir essa mensagem caso ela retorne.

---

## 3. Segurança: Tratamento de Token JWT Inválido (HTTP 401)

**Arquivos Impactados:** Todos os arquivos JS que fazem `fetch` na API (ex: `dashboard.js`, `comprasColetivas.js`, `products.js`, etc.)
- **O que mudou no backend:** Se o token JWT do usuário estiver expirado ou for adulterado, a API agora retorna graciosamente um `HTTP 401 Unauthorized` com um JSON contendo `{"erro": "Token inválido ou expirado."}`.
- **O que fazer no frontend:**
  - Sempre que um `fetch` retornar `response.status === 401`, o frontend deve interceptar, limpar o `localStorage` (removendo `nexusToken` e `usuarioNexus`) e redirecionar o usuário obrigatoriamente de volta para a tela de login (`auth.html`).

---

## 4. Endpoint de Logout

**Arquivo Impactado:** Provavelmente `layout.js` (ou onde o botão de "Sair" é gerenciado)
- **O que mudou no backend:** Foi criado formalmente o endpoint `POST /api/auth/logout`.
- **O que fazer no frontend:**
  - Antes de apenas limpar o `localStorage` e redirecionar para `auth.html`, você deve fazer uma requisição do tipo `POST` para `/api/auth/logout`, enviando o cabeçalho `Authorization: Bearer <token>`.
  - Após o sucesso ou mesmo falha desse endpoint, aí sim execute o `localStorage.removeItem(...)` e faça o redirecionamento.

---

> **Nota:** A alteração de segurança em que a senha (`hash`) deixou de ser devolvida no JSON da entidade `Usuario` não gera impacto nenhum no frontend, pois ele já não usava esse campo.
