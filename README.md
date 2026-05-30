<h1 align="center">🚀 Nexus</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Comunidade-Juninhos-7B2CBF?style=for-the-badge&logo=discord&logoColor=white" alt="Juninhos Community" />
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge" alt="Status" />
</p>

---

## 📝 Sobre o Projeto

O **Nexus** é uma plataforma de compras coletivas inovadora desenvolvida para conectar revendedores locais, permitindo a união de demandas para a negociação estratégica de descontos por volume diretamente com grandes fornecedores. A aplicação visa fortalecer o comércio local, proporcionando maior poder de barganha, redução de custos logísticos e otimização da cadeia de suprimentos para pequenos e médios empreendedores.

Este projeto está sendo construído de forma 100% colaborativa dentro do ecossistema da **Comunidade Juninhos**. Nosso foco primordial é aplicar conceitos modernos de engenharia de software para entregar uma solução robusta, de alta performance e com excelente usabilidade.

> 💡 **Nota do Squad:** Este README serve como um documento vivo. Ele será atualizado continuamente conforme novas funcionalidades forem integradas nas sprints de 30 dias.

---

## 🛠️ Stack Tecnológica

O projeto foi estruturado seguindo os conceitos de **modularização**, alta coesão e baixo acoplamento:

* **Frontend:** Html, Tailwind, Js
* **Backend:** Java com Spring Boot
* **Banco de Dados:** PostgreSQL
* **Infraestrutura:** Neon

---

## 📌 Funcionalidades Principais

Aqui está o mapeamento de recursos que estão sendo construídos ou planejados para a plataforma Nexus:

- [x] 🔐 **Sistema de Autenticação:** Login e Cadastro unificados via abas dinâmicas (Tabs sem recarregamento) com distinção entre perfis de Revendedor e Fornecedor.
- [ ] 🤝 **Agrupamento de Pedidos (Compras Coletivas):** Mecanismo para unir ordens de compra de diferentes revendedores locais até atingir a meta de volume estipulada.
- [ ] 🏢 **Catálogo de Fornecedores e Produtos:** Painel de listagem de produtos com faixas de preço regressivas baseadas na quantidade total encomendada.
- [ ] 📊 **Dashboard de Negociação:** Gráficos e indicadores visuais que mostram o progresso do volume de pedidos em tempo real antes do fechamento do lote.
- [ ] 🏅 **Ecossistema de Badges:** Gamificação integrada para recompensar o progresso técnico e o engajamento do squad na comunidade.

---

## ⚙️ Como Executar o Projeto Localmente

### 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* **Node.js**
* **Java JDK**
* **Git**
* **Gerenciador de pacotes:** npm
* **Banco de Dados:** PostgreSQL

### 🚀 Passos para Instalação

1. Clone o repositório oficial dentro da organização Juninhos:
   ```bash
   git clone https://github.com/juninhos-comunidade/nexus.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd nexus
   ```

3. Instale todas as dependências necessárias:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:
   * Crie um arquivo `.env` na raiz do projeto seguindo o modelo do `.env.example`.

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🌿 Diretrizes do Git Flow (Guia de Sobrevivência)

Para manter o código limpo e organizado para todo o time, seguimos rigorosamente estas regras de contribuição:

### 1. Nomenclatura de Branches
Sempre crie uma ramificação específica para a sua tarefa a partir da branch principal:
* `feature/nome-da-funcionalidade`
* `fix/correcao-de-bug`
* `docs/atualizacao-readme`

```bash
git checkout -b feature/minha-tarefa
```

### 2. Padrão de Commits
Os commits devem ser claros, em português e indicar a intenção da alteração:
* `feat: adiciona calculo de desconto progressivo por volume`
* `fix: corrige renderizacao da barra de progresso do lote`
* `style: estiliza os cards de fornecedores locais`

### 3. Revisão de Código (Pull Requests)
* Nunca faça o merge direto na branch principal.
* Abra um **Pull Request (PR)** e solicite a revisão de pelo menos um outro membro do squad antes de aplicar as alterações.

---

## 👥 Nosso Squad

Um projeto completo só ganha vida com uma equipe sintonizada. Conheça as mentes por trás do desenvolvimento da plataforma:

| Avatar | Membro | Função / Especialidade | GitHub |
| :---: | :--- | :--- | :--- |
| <img src="https://github.com/mateusbaldu.png" width="40" style="border-radius:50%"/> | **Mateus Baldu** | Banco de Dados | https://github.com/mateusbaldu |
| <img src="https://github.com/Nicollaspc.png" width="40" style="border-radius:50%"/> | **Nicollas Nascimento** | Frontend / UI | https://github.com/Nicollaspc |
| <img src="https://github.com/phwalves.png" width="40" style="border-radius:50%"/> | **Pedro Henrique Walcacer** | Backend w/Java | https://github.com/phwalves |
| <img src="https://github.com/Alicephr-dev.png" width="40" style="border-radius:50%"/> | **Alice Gomes** | Backend w/Java | https://github.com/Alicephr-dev |

---

## ⚖️ Licença

Este projeto é de uso exclusivo e educacional dos membros vinculados à **Juninhos Community**.

---

## 🤝 Apoio e Organização

Este projeto é desenvolvido e mantido pelos membros da **Juninhos Community**.
Se precisar de suporte técnico, mentoria de deploy ou dúvidas sobre infraestrutura, use os canais oficiais no Discord.
```
