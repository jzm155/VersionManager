# Relatório Executivo do Projeto: Version Reporter

**Data:** 27/05/2024
**Status:** Funcional / Integrado com Banco de Dados

## 1. Visão Geral

O **Version Reporter** é uma aplicação web do tipo SPA (Single Page Application) desenvolvida para gerenciar o ciclo de vida de versões de software, changelogs e tarefas pendentes. O sistema atua como um hub centralizado para organizar o que foi desenvolvido, para qual cliente e em qual versão do software aquelas alterações serão entregues.

A aplicação está atualmente integrada a um backend **Supabase** para persistência de dados, contando com autenticação de usuários e gestão completa de entidades.

## 2. Arquitetura Técnica

-   **Frontend:** JavaScript Puro (Vanilla JS), HTML5 e CSS3. Não há dependência de frameworks pesados (React/Vue/Angular), garantindo leveza e carregamento rápido.
-   **Backend/Database:** Supabase (PostgreSQL).
-   **Design:** Responsivo (Desktop e Mobile), com sistema de navegação lateral e feedback visual (Loaders, Modais).
-   **Segurança:** Autenticação via tabela de usuários no banco e persistência de sessão via `localStorage`.

## 3. Módulos e Funcionalidades

### 3.1. Controle de Acesso (Autenticação)

-   **Tela de Login:** Interface dedicada para entrada de credenciais.
-   **Validação:** Verificação de usuário e senha diretamente contra a tabela `Usuario` no banco de dados.
-   **Sessão Persistente:** O sistema mantém o usuário logado mesmo após atualizar a página.
-   **Logout:** Funcionalidade para encerrar a sessão segura.

### 3.2. Gestão de Versões (Core)

O módulo principal do sistema, onde as releases são planejadas e finalizadas.

-   **Dashboard de Versões:** Visualização em cards de todas as versões cadastradas, com indicadores visuais de status (Pendente, Finalizado, Cancelado).
-   **Ciclo de Vida:**
    -   **Criação:** Cadastro de novas versões (ex: v2.3.0) com data de lançamento prevista.
    -   **Edição:** Alteração de dados cadastrais (Data/Nome).
    -   **Finalização:** Validação de regras de negócio (ex: exige itens vinculados e data definida) antes de marcar como "Finalizado".
    -   **Cancelamento:** Possibilidade de cancelar uma versão.
-   **Detalhamento:** Tela exclusiva para visualizar o conteúdo de uma versão, listar os itens vinculados e executar ações de gestão.

### 3.3. Gestão de Itens e Tarefas (Change Items)

Gerenciamento granular das tarefas, bugs ou melhorias desenvolvidas.

-   **Campos de Dados:**
    -   Ticket (Número/ID externo).
    -   Descrição.
    -   Data.
    -   URL (Link para Jira/Git).
    -   Cliente (Vinculado ao cadastro de clientes).
    -   **Flag de Migration:** Indicador crítico se a tarefa exige atualização de banco de dados.
-   **Backlog (Itens Pendentes):** Listagem de todos os itens criados que ainda não foram associados a nenhuma versão específica.
-   **Vínculo Flexível:**
    -   Itens podem ser criados diretamente dentro de uma versão.
    -   Itens podem ser "puxados" da lista de pendentes para uma versão existente.

### 3.4. Gestão de Clientes

Cadastro auxiliar para identificar para quem as funcionalidades foram desenvolvidas.

-   **CRUD Completo:** Listar, Criar, Editar e Excluir clientes.
-   **Integração:** Os clientes ativos aparecem automaticamente nos formulários de criação de itens.

### 3.5. Gerador de Relatórios (Release Notes)

Ferramenta de produtividade para comunicação com a equipe ou clientes.

-   **Geração Automática:** Transforma os dados da versão e seus itens em um texto formatado.
-   **Formato Markdown:** O texto gerado é otimizado para Discord ou ferramentas que suportam Markdown (ex: `**v2.3.0** Versao - Lancamento...`).
-   **Destaque de Migrations:** O relatório sinaliza automaticamente quais itens possuem alterações de banco de dados.
-   **Cópia Rápida:** Botão para copiar o texto gerado para a área de transferência.

## 4. Usabilidade e Interface (UX/UI)

-   **Feedback de Carregamento:** "Spinners" de carregamento durante todas as requisições ao banco de dados.
-   **Modais Customizados:** Substituição dos `alerts` nativos do navegador por janelas modais integradas ao design para confirmações e avisos de erro.
-   **Responsividade Mobile:**
    -   Menu "Hambúrguer" para dispositivos móveis.
    -   Tabelas com rolagem horizontal (`table-responsive`) para evitar quebra de layout em telas pequenas.
    -   Overlay escuro para foco no menu lateral.

## 5. Resiliência de Dados

-   **Tratamento de Erros:** O sistema captura falhas de conexão com o Supabase e exibe mensagens amigáveis.
-   **Case Insensitivity:** Lógica implementada para lidar com variações de nomes de colunas no PostgreSQL (`Id` vs `id`), garantindo que a aplicação funcione mesmo com pequenas alterações na estrutura do banco.

## 6. Próximos Passos Sugeridos (Roadmap Futuro)

Embora o sistema esteja funcional, as seguintes evoluções são sugeridas para versões futuras:

1.  **Filtros Avançados:** Adicionar busca por texto nas listas de itens e versões.
2.  **Dashboard de Métricas:** Gráficos mostrando itens entregues por cliente ou por mês.
3.  **Roles de Usuário:** Diferenciar usuários "Admin" (pode excluir) de usuários "Viewer" (apenas leitura).

---
**Conclusão:** O Version Reporter atingiu um nível de maturidade que permite seu uso em produção para o controle diário de releases, centralizando informações que antes poderiam estar dispersas em planilhas ou chats.