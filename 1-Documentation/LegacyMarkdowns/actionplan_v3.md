# Plano de Ação - V3: Cadastros Básicos (Clientes e Versões)

**Data:** 26/05/2024

## 1. Objetivo Principal

A V3 focará na implementação de funcionalidades de **entrada de dados**. O objetivo é permitir que o usuário cadastre novos clientes e crie novas versões através da interface, substituindo os dados puramente estáticos/hardcoded por uma interação dinâmica com o estado da aplicação. Isso cobre as **Etapas 5 e 6** do roadmap original.

## 2. Ações Detalhadas

### 2.1. Implementar Gerenciamento de Clientes (Etapa 5)

-   **Ação 1**: Atualizar a função `renderClients()` em `app.js`.
-   **Ação 2**: Exibir uma tabela listando os clientes existentes (`id`, `name`, `active`).
-   **Ação 3**: Adicionar um formulário simples (ou modal) no topo da tela de Clientes para cadastrar um novo cliente.
-   **Ação 4**: Implementar a lógica para adicionar o novo objeto ao array `state.clients` e re-renderizar a tabela.

### 2.2. Implementar Criação de Versões (Etapa 6)

-   **Ação 1**: Tornar funcional o botão "Adicionar Versão" na tela inicial (`renderVersions`).
-   **Ação 2**: Criar uma interface (modal ou formulário inline) que solicite:
    -   Nome da Versão (ex: v2.2.0)
    -   Data de Lançamento (input type="date")
-   **Ação 3**: Implementar a lógica de salvamento que adiciona a nova versão ao array `state.versions` e atualiza a grade de visualização.

### 2.3. Melhorias de Interface (UI/UX)

-   **Ação 1**: Padronizar os estilos dos botões de ação ("Salvar", "Cancelar").
-   **Ação 2**: Adicionar validação básica (ex: não permitir criar versão sem nome).

## 3. Critérios de Aceite para a V3

-   O usuário consegue visualizar a lista de clientes.
-   O usuário consegue adicionar um novo cliente e vê-lo aparecer na lista imediatamente.
-   O usuário consegue criar uma nova versão na tela inicial e ela aparece na grade de versões.