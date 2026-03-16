# Relatório de Entrega - V3: Cadastros Básicos

**Data:** 26/05/2024

## 1. Objetivo

A V3 teve como objetivo principal implementar as funcionalidades de **entrada de dados** na aplicação, permitindo que o usuário crie novas entidades (Clientes e Versões) diretamente pela interface. Isso marca a transição de uma aplicação de "leitura" para uma ferramenta interativa de "leitura e escrita".

## 2. Funcionalidades Entregues

### 2.1. Gerenciamento de Clientes (Etapa 5)

-   **Listagem Funcional**: A tela de "Clientes" agora exibe uma tabela com todos os clientes cadastrados no estado da aplicação, mostrando `ID`, `Nome` e `Status`.
-   **Fluxo de Cadastro**: O botão "Adicionar Cliente" redireciona o usuário para um formulário de cadastro dedicado.
-   **Criação de Cliente**: No formulário, o usuário pode inserir o nome de um novo cliente. Ao salvar, o cliente é adicionado ao estado global e o usuário é redirecionado de volta para a lista atualizada.

### 2.2. Criação de Versões (Etapa 6)

-   **Botão Funcional**: O botão "Adicionar Versão" na tela principal agora está funcional.
-   **Formulário de Cadastro**: Ao clicar no botão, o usuário é levado a um formulário para inserir o `Nome da Versão` e a `Data de Lançamento`.
-   **Criação de Versão**: Após o salvamento, a nova versão é adicionada ao estado e exibida no topo da grade de versões na tela inicial.

## 3. Alterações Técnicas

-   **Roteamento Expandido**: O sistema de navegação foi atualizado para incluir as rotas dos novos formulários (`add-client`, `add-version`).
-   **Manipulação de Estado**: Foram implementadas as lógicas para adicionar dinamicamente novos objetos aos arrays `state.clients` e `state.versions`.
-   **Componentes de Formulário**: Foram criadas funções de renderização para os formulários de cadastro, com tratamento de eventos `onsubmit` para capturar e salvar os dados.
-   **Geração de ID**: Uma lógica simples para gerar novos IDs (`Math.max(...) + 1`) foi implementada para garantir a unicidade dos registros mockados.

## 4. Próximos Passos

Com os cadastros de base implementados, o próximo foco será o gerenciamento da entidade principal: os **Itens**. A V4 implementará a criação de novos itens (Etapa 7) e a associação de itens pendentes a uma versão (Etapa 8).