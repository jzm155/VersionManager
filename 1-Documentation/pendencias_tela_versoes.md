# Levantamento de Pendências: Tela de Versões

**Data:** 27/05/2024
**Status Atual:** Interface Pronta / Persistência Pendente

## 1. Visão Geral

A análise do arquivo `app.js` indica que, embora a listagem de versões (`renderVersions`) já consuma dados do Supabase, as ações de **escrita e atualização** (Criar, Editar, Finalizar, Vincular) ainda operam apenas no estado local da aplicação (Mock). Para considerar o módulo 100%, é necessário implementar as chamadas de API nas funções listadas abaixo.

## 2. Pendências de Persistência (Backend)

### 2.1. Criação e Edição de Versões (`renderVersionForm`)
Atualmente, o formulário apenas atualiza o array `state.versions`.
- [ ] **Implementar INSERT:** Ao criar nova versão, enviar POST para tabela `Versao`.
- [ ] **Implementar UPDATE:** Ao editar versão, enviar PATCH para tabela `Versao` com `Nome` e `DataPublicacao`.
- [ ] **Tratamento de Erro:** Adicionar `try/catch` e feedback visual em caso de falha no banco.

### 2.2. Edição Rápida via Modal (`openEditVersionModal`)
O modal de edição dentro dos detalhes da versão não salva no banco.
- [ ] **Implementar UPDATE:** Atualizar a função `onsubmit` para chamar `supabaseClient.from('Versao').update(...)`.

### 2.3. Alteração de Ciclo de Vida (`updateVersionStatus`)
Os botões "Finalizar Versão" e "Cancelar Versão" alteram apenas o objeto local.
- [ ] **Implementar UPDATE:** Atualizar a coluna `Status` na tabela `Versao` (IDs: 1=Finalizado, 2=Pendente, 3=Cancelado).

### 2.4. Vínculo de Itens Existentes (`openLinkExistingItemsModal`)
A funcionalidade de "puxar" itens pendentes para a versão atual não persiste.
- [ ] **Implementar UPDATE em Lote:** Atualizar a coluna `IdVersao` na tabela `Item` para os itens selecionados.
  - *Snippet Sugerido:* `supabase.from('Item').update({ IdVersao: versionId }).in('Id', selectedIds)`

### 2.5. Criação Rápida de Item (`openItemModal`)
O modal "Criar Novo Item" dentro da tela de detalhes difere do formulário principal de itens e não possui lógica de banco.
- [ ] **Implementar INSERT:** Garantir que o item criado seja salvo na tabela `Item` já com o `IdVersao` preenchido.

## 3. Melhorias de Interface e UX

### 3.1. Feedback de Carregamento
- [ ] **Loaders em Ações:** Adicionar `toggleLoading(true)` durante as operações de salvamento (Criar, Vincular, Finalizar) para evitar cliques duplos.

### 3.2. Ordenação e Filtros
- [ ] **Ordenação de Itens:** Garantir que a lista de itens dentro da versão esteja ordenada (ex: por Data ou ID), pois o banco pode retornar em ordem aleatória após edições.

### 3.3. Remoção de Vínculo (Unlink)
- [ ] **Funcionalidade Faltante:** Atualmente só existe o botão "Excluir" (que deleta o item). É recomendável adicionar um botão "Desvincular" que apenas remove o `IdVersao` (tornando o item pendente novamente) sem apagar o registro.

## 4. Mapa de Funções para Refatoração (app.js)

| Função | Linha Aprox. | Ação Necessária |
| :--- | :--- | :--- |
| `renderVersionForm` | ~860 | Adicionar lógica `supabase.insert` e `supabase.update`. |
| `updateVersionStatus` | ~560 | Adicionar lógica `supabase.update` para o status. |
| `openEditVersionModal` | ~580 | Adicionar lógica `supabase.update` para nome/data. |
| `openItemModal` | ~620 | Adicionar lógica `supabase.insert` (atualmente só faz push no state). |
| `openLinkExistingItemsModal` | ~660 | Adicionar lógica `supabase.update` na tabela de Itens. |

---

**Conclusão:** O "frontend" está 95% pronto. O esforço restante é focado quase exclusivamente na integração das camadas de serviço do Supabase dentro dos *event handlers* existentes.