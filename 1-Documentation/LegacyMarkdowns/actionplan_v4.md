# Plano de Ação - V4: Gerenciamento de Itens (Ciclo de Vida)

**Data:** 27/05/2024

## 1. Objetivo Principal

A V4 abordará o núcleo do sistema: os **Itens de Mudança**. O objetivo é permitir a criação de novos itens (que nascem como "Pendentes") e o fluxo de associação desses itens a uma Versão específica. Isso cobre as **Etapas 7 e 8** do roadmap original.

## 2. Ações Detalhadas

### 2.1. Criação de Itens (Etapa 7)

-   **Ação 1**: Atualizar a função `renderPending()` em `app.js` para tornar o botão "Adicionar Item" funcional (redirecionar para rota `add-item`).
-   **Ação 2**: Criar a função `renderAddItemForm()`.
-   **Ação 3**: Implementar o formulário com os campos:
    -   Nome (Texto)
    -   Data (Date)
    -   URL (Texto)
    -   Migration (Checkbox)
    -   Cliente (Select/Dropdown - populado via `state.clients`)
-   **Ação 4**: Implementar lógica de salvamento (`onsubmit`) adicionando o item ao `state.items` com `versionId: null`.

### 2.2. Associação de Itens à Versão (Etapa 8)

-   **Ação 1**: Na tela de **Detalhes da Versão** (`renderVersionDetail`), implementar a ação do botão "Adicionar Item".
-   **Ação 2**: Criar uma interface (pode ser uma nova rota `link-item/:versionId` ou um modal simples) que liste todos os itens onde `versionId === null`.
-   **Ação 3**: Adicionar botões de ação ("Vincular") ao lado de cada item pendente nessa lista.
-   **Ação 4**: Ao clicar em vincular, atualizar o `versionId` do item para o ID da versão atual e retornar à tela de detalhes.

## 3. Critérios de Aceite para a V4

-   O usuário consegue cadastrar um novo item e escolher um cliente da lista.
-   O item recém-criado aparece imediatamente na tela "Itens Pendentes".
-   Ao entrar em uma Versão, o usuário consegue acessar uma lista de pendências.
-   O usuário consegue mover um item de "Pendente" para a Versão atual.
-   O item movido desaparece da lista de pendentes e aparece na lista da versão.