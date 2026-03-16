# Plano de Ação - V2: Detalhes e Gerenciamento de Itens

**Data:** 26/05/2024

## 1. Objetivo Principal

A V2 focará em dar profundidade à aplicação, permitindo que o usuário visualize os detalhes de uma versão específica e gerencie uma lista centralizada de itens de desenvolvimento. Esta versão implementará as **Etapas 3 e 4** do plano de ação geral.

## 2. Ações Detalhadas

### 2.1. Implementar Tela de Detalhe da Versão (Etapa 3)

-   **Ação 1**: Modificar o evento de clique nos cartões da tela de versões. Em vez de um `alert`, o clique deverá navegar o usuário para a tela de detalhes da versão selecionada.
-   **Ação 2**: Criar a função `renderVersionDetail(versionId)` em `app.js`.
-   **Ação 3**: A nova tela deverá exibir:
    -   Um botão "Voltar" para retornar à lista de versões.
    -   O nome e a data da versão.
    -   Um botão "Adicionar Item" (placeholder para a Etapa 8).
    -   Uma tabela listando os itens associados a essa versão. A tabela deve conter as colunas: `Nome`, `Data`, `URL`, `Migration`, `Cliente`.

### 2.2. Implementar Tela de Itens Pendentes (Etapa 4)

-   **Ação 1**: Substituir o conteúdo placeholder da função `renderPending()` em `app.js`.
-   **Ação 2**: A nova tela deverá listar todos os itens que ainda não foram associados a nenhuma versão.
-   **Ação 3**: A lista/grade de itens pendentes deve exibir os campos principais de cada item (ex: Nome, Data, Cliente).
-   **Ação 4**: Incluir um botão "Adicionar Item" no topo da página (placeholder para a Etapa 7).

### 2.3. Evoluir a Estrutura de Dados (Mock State)

-   **Ação 1**: Expandir o objeto `state` em `app.js` para incluir novos arrays: `clients` e `items`.
-   **Ação 2**: Definir a estrutura dos objetos `item` e `client`, conforme especificado no plano geral.
    -   `item`: { id, name, date, url, migration, clientId, versionId? }
    -   `client`: { id, name, active }
-   **Ação 3**: Associar itens a versões, possivelmente adicionando uma propriedade `items: [itemId1, itemId2]` a cada objeto de versão.

## 3. Critérios de Aceite para a V2

-   O usuário consegue clicar em uma versão na tela principal e ver uma página de detalhes com uma tabela (mesmo que vazia inicialmente).
-   O usuário consegue navegar para a seção "Itens Pendentes" e ver uma lista de itens (com base nos novos dados mock).
-   A estrutura de dados em `app.js` foi expandida para suportar clientes e itens de forma separada.