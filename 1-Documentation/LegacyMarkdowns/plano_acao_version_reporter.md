# Plano de Ação --- Desenvolvimento do Version Reporter

## Etapa 1 --- Layout Base

Criar estrutura da aplicação:

-   Header
-   Sidebar
-   Área principal

Sidebar: - Versões - Itens Pendentes - Clientes

## Etapa 2 --- Tela de Versões

Elementos:

-   Título da página
-   Botão "Adicionar Versão"
-   Grid de versões

Cada card mostra: - Nome da versão - Data

## Etapa 3 --- Detalhe da Versão

Elementos: - Botão voltar - Nome da versão - Data - Botão "Adicionar
Item"

Tabela:

-   Nome
-   Data
-   URL
-   Migration
-   Cliente

## Etapa 4 --- Itens Pendentes

Elementos: - Título da página - Botão "Adicionar Item" - Grid ou lista
de itens

Campos visíveis: - Nome - Data - Cliente - URL - Migration

## Etapa 5 --- Cadastro de Clientes

Tela de gerenciamento de clientes.

Campos: - Nome - Ativo

Funcionalidades: - Criar cliente - Editar cliente - Ativar / desativar

## Etapa 6 --- Criar Versão

Formulário:

Campos: - Nome da versão - Data

## Etapa 7 --- Criar Item

Campos:

-   Nome
-   Data
-   URL
-   Cliente (combo box)
-   Migration (checkbox)

Após salvar: Item aparece em **Itens Pendentes**.

## Etapa 8 --- Associar Item à Versão

Permitir mover itens pendentes para uma versão.

Possíveis abordagens: - botão adicionar - seleção múltipla - drag and
drop

## Etapa 9 --- Melhorias

-   filtros por cliente
-   busca de itens
-   ordenação por data
-   sidebar recolhível

## Etapa 10 --- Evoluções Futuras

-   exportar changelog em Markdown
-   exportar PDF
-   integração com Git ou sistema de tickets
