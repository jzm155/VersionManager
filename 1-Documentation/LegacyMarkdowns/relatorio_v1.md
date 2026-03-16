# Relatório de Entrega - V1: Estrutura Base e Listagem

**Data:** 26/05/2024

## 1. Objetivo

O objetivo desta primeira versão (V1) foi estabelecer a fundação da aplicação "Version Reporter", criando o layout principal e a primeira funcionalidade essencial: a visualização das versões existentes.

## 2. Funcionalidades Entregues

### 2.1. Estrutura Base da Aplicação (Etapa 1)

-   **Layout Responsivo**: Foi implementado um layout principal com `flexbox`, dividido em uma barra de navegação lateral (`Sidebar`) e uma área de conteúdo principal (`Main Content`).
-   **Sidebar Funcional**: A barra lateral contém o título da aplicação e os links de navegação principais: "Versões", "Itens Pendentes" e "Clientes".
-   **Header e Área de Conteúdo**: A área principal possui um cabeçalho fixo e um espaço dinâmico onde o conteúdo de cada página é renderizado.

### 2.2. Navegação SPA (Single Page Application)

-   Foi implementado um sistema de roteamento simples em JavaScript puro (`app.js`).
-   A navegação entre as seções ocorre sem a necessidade de recarregar a página, proporcionando uma experiência de usuário mais fluida. O link ativo na `Sidebar` é devidamente destacado.

### 2.3. Tela de Listagem de Versões (Etapa 2)

-   Ao acessar a rota "Versões" (padrão na inicialização), o sistema exibe uma grade de cartões.
-   Cada cartão representa uma versão e exibe seu **nome** e **data de lançamento**.
-   A tela possui um botão "Adicionar Versão", que atualmente é um placeholder para uma funcionalidade futura (Etapa 6).

## 3. Tecnologias Utilizadas

-   **HTML5**: Estruturação semântica do conteúdo.
-   **CSS3**: Estilização do layout, componentes e responsividade.
-   **JavaScript (Vanilla)**: Manipulação do DOM, controle de estado (mock), e lógica de roteamento da SPA.

## 4. Observações

-   Os dados exibidos são estáticos (`mock data`) e estão definidos no arquivo `app.js`. A integração com um backend ou armazenamento persistente será abordada em versões futuras.
-   As telas "Itens Pendentes" e "Clientes" atualmente exibem conteúdo provisório (placeholder).