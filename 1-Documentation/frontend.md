# 📘 Documentação do Front-End — Version Reporter

## 🧠 Visão Geral

O front-end do **Version Reporter** é uma aplicação SPA (Single Page Application) construída com:

* HTML
* CSS
* JavaScript puro (Vanilla JS)

Ele não utiliza frameworks (React, Vue, etc.), sendo totalmente baseado em manipulação direta do DOM.

O objetivo principal do front é:

> Gerenciar versões, itens e clientes, além de gerar relatórios (changelog) de forma dinâmica.

---

## 🏗️ Estrutura da Aplicação

### 📁 Arquivos principais

* `index.html` → estrutura base da aplicação
* `style.css` → estilos (não incluído aqui)
* `app.js` → toda lógica da aplicação

---

## 🧩 Arquitetura

A aplicação segue um padrão simples baseado em:

### 1. Estado Global

```js
const state = {
    versions: [],
    clients: [],
    items: [],
    isAuthenticated: false,
    currentUser: null
};
```

Esse objeto centraliza todos os dados da aplicação no front.

---

### 2. Renderização por Rotas

A navegação é controlada por uma função:

```js
function navigateTo(route, param = null)
```

Ela decide qual tela renderizar:

* `versions`
* `pending`
* `clients`
* `client-form`
* `version-form`
* `item-form`

---

### 3. Renderização Dinâmica

Toda a UI é gerada via JavaScript usando:

```js
document.createElement()
innerHTML
appendChild()
```

O conteúdo é injetado dentro de:

```html
<main id="content-area"></main>
```

---

## 🔐 Autenticação

O sistema possui autenticação simples:

* Login via formulário
* Dados salvos no `localStorage`

```js
localStorage.setItem('version_reporter_user', JSON.stringify(user));
```

### Persistência de sessão

```js
function checkSession()
```

Verifica se o usuário já está logado ao iniciar a aplicação.

---

## 🔌 Integração com Supabase

### Inicialização

```js
supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
```

### Funções principais:

* `refreshClientsState()`
* `refreshVersionsState()`

Essas funções:

* Buscam dados do banco
* Atualizam o `state`

---

## 📊 Telas da Aplicação

### 🟦 1. Versões

Função:

```js
renderVersions()
```

Responsável por:

* Listar versões
* Mostrar status e data
* Permitir criação de nova versão

---

### 🟨 2. Detalhes da Versão

Função:

```js
renderVersionDetail(versionId)
```

Permite:

* Visualizar itens da versão
* Criar novos itens
* Vincular itens existentes
* Editar versão
* Alterar status
* Gerar relato

---

### 🟧 3. Itens Pendentes

Função:

```js
renderPending()
```

Mostra:

* Itens sem versão associada
* Permite edição e exclusão

---

### 🟩 4. Clientes

Função:

```js
renderClients()
```

Permite:

* Listar clientes
* Criar, editar e excluir

---

### 🔐 5. Login

Função:

```js
renderLogin()
```

* Exibe tela de autenticação
* Valida usuário no banco
* Salva sessão local

---

## 🧾 Funcionalidade de Relatório

Função:

```js
renderReportView(versionId)
```

Gera automaticamente um texto em Markdown:

* Agrupa itens por cliente
* Marca itens com migration
* Formata para fácil compartilhamento

Exemplo de saída:

```
**v1.2.0** Versao - Lancamento 2026-03-29

**Cliente A**
- Feature X
- Bug Y (migrations)
```

---

## 🧰 Componentes Reutilizáveis

### 🔹 Modal

Função:

```js
showModal(title, message, onConfirm, type)
```

Substitui:

* `alert`
* `confirm`

---

### 🔹 Loading

Função:

```js
toggleLoading(show)
```

Mostra overlay de carregamento.

---

### 🔹 Helpers

* `getClientName()`
* `getStatusInfo()`
* `formatDateToBR()`

---

## 📱 Responsividade

Função:

```js
setupMobileResponsiveness()
```

Inclui:

* Menu hambúrguer
* Overlay para sidebar
* Comportamento adaptativo mobile/desktop

---

## 🔄 Fluxo da Aplicação

1. Inicialização:

```js
initializeApp()
```

2. Carrega Supabase

3. Verifica sessão:

* Logado → entra na app
* Não logado → mostra login

4. Usuário navega entre telas

5. Ações atualizam:

* Banco (Supabase)
* Estado local (`state`)
* Interface (re-render)

---

## 🧠 Padrões Utilizados

* SPA (Single Page Application)
* Estado global simples
* Renderização imperativa
* Separação por funções de tela
* Uso de async/await para dados

---

## ⚠️ Observações

* Não utiliza framework moderno
* Toda lógica está em um único arquivo
* Não há gerenciamento avançado de estado
* Renderizações recriam o DOM

---

## 🚀 Possíveis Evoluções

* Separar em módulos (MVC ou similar)
* Migrar para React/Vue
* Criar camada de serviços (API)
* Melhorar gerenciamento de estado
* Componentizar UI

---

## 🧾 Resumo

O front-end do Version Reporter é:

> Uma SPA em JavaScript puro que gerencia versões, itens e clientes, integrada ao Supabase, com geração automática de relatórios em Markdown.

---
