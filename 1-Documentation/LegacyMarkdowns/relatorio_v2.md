# Relatório de Entrega - V2: Detalhes e Gerenciamento de Itens

**Data:** 26/05/2024

## 1. Objetivo

A V2 teve como foco aprofundar a navegação da aplicação, permitindo a visualização detalhada dos itens de uma versão e a listagem de itens pendentes de desenvolvimento. Também foi expandida a estrutura de dados para suportar essas novas visões.

## 2. Funcionalidades Entregues

### 2.1. Estrutura de Dados Expandida (Etapa Geral)

-   O estado da aplicação (`state`) no `app.js` foi atualizado para incluir arrays de `clients` e `items`.
-   Foi criada uma relação lógica onde itens possuem `versionId` (para itens alocados) ou `null` (para pendentes), além de `clientId`.

### 2.2. Tela de Detalhes da Versão (Etapa 3)

-   **Navegação**: Ao clicar em um cartão na lista de versões, o usuário é redirecionado para a tela de detalhes.
-   **Conteúdo**: A tela exibe o nome e data da versão, botões de ação (Voltar e Adicionar Item - placeholder) e uma tabela de itens.
-   **Tabela de Itens**: Lista o Nome, Data, Link (Jira/Git), Status de Migration e o Cliente associado (resolvido dinamicamente pelo ID).

### 2.3. Tela de Itens Pendentes (Etapa 4)

-   A rota "Itens Pendentes" agora exibe uma lista funcional.
-   O sistema filtra automaticamente do `state.items` apenas os itens que não possuem vínculo com versões (`versionId: null`).
-   A visualização segue o padrão de tabela para fácil leitura.

## 3. Alterações Técnicas

-   **Helpers**: Implementada a função `getClientName(clientId)` para traduzir IDs em nomes legíveis na interface.
-   **Roteamento Interno**: Melhoria na função de renderização para suportar a passagem de parâmetros (ID da versão) ao renderizar a view de detalhes.

## 4. Próximos Passos

Com a visualização de dados concluída ("Read"), o foco deve mudar para a criação e manipulação desses dados ("Create/Update"), começando pelas entidades base como Clientes e Versões.
```

### 2. Plano de Ação - V3

Este arquivo define o escopo da próxima etapa, focando no gerenciamento de cadastros básicos (Clientes e Novas Versões), saindo do modo apenas "leitura".

```diff
