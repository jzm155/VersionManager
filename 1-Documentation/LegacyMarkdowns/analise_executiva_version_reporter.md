# Análise Executiva --- Sistema Version Reporter

## Visão Geral

O **Version Reporter** é um sistema para organizar e registrar
alterações realizadas em um software ao longo do tempo. Ele centraliza o
controle de **versões (releases)** e **itens de mudança**, facilitando a
criação de relatórios de versão (changelog).

## Objetivo

-   Organizar mudanças realizadas no sistema
-   Facilitar geração de relatórios de versão
-   Manter histórico estruturado de alterações
-   Permitir rastreabilidade por cliente

## Estrutura do Sistema

### Versões

Representam releases do sistema.

Campos: - Nome da versão - Data - Lista de itens

### Itens

Representam alterações realizadas.

Campos: - Nome - Data - URL - Migration (sim/não) - Cliente

### Itens Pendentes

Itens que ainda não foram vinculados a nenhuma versão.

Fluxo: Item criado → Itens Pendentes → Associado a uma versão

### Clientes

Cadastro simples de clientes.

Campos: - Nome - Ativo (sim/não)

Na criação de itens existe uma **combo box** que lista os clientes
cadastrados.

## Benefícios

-   Organização do histórico de mudanças
-   Melhor controle de releases
-   Facilidade na geração de changelog
-   Rastreamento de mudanças por cliente
