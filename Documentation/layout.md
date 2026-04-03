# 🖥️ Explicação das Telas — Version Reporter (Front-End)

## 🧠 Visão Geral

O sistema possui múltiplas telas que representam diferentes partes do fluxo de gestão de versões.
Cada tela tem um papel específico dentro do processo de criação de releases e organização de itens.

---

## 🔐 1. Tela de Login

### 📌 Função

Autenticar o usuário no sistema.

### ⚙️ O que ela faz:

* Exibe formulário com:

  * usuário/email
  * senha
* Valida os dados no banco (Supabase)
* Salva sessão no `localStorage`
* Redireciona para a tela principal após login

### 🎯 Objetivo

Garantir que apenas usuários autorizados acessem o sistema.

---

## 🟦 2. Tela de Versões (Home)

### 📌 Função

Listar todas as versões cadastradas.

### ⚙️ O que ela faz:

* Exibe todas as versões existentes
* Mostra:

  * nome da versão
  * data
  * status (Pendente, Finalizado, Cancelado)
* Permite:

  * Criar nova versão
  * Clicar em uma versão para ver detalhes

### 🎯 Objetivo

Ser o ponto de entrada principal do sistema.

---

## 🟨 3. Tela de Detalhes da Versão

### 📌 Função

Gerenciar uma versão específica.

### ⚙️ O que ela faz:

* Exibe:

  * informações da versão
  * lista de itens vinculados
* Permite:

  * Criar novo item direto na versão
  * Vincular itens existentes
  * Editar versão
  * Alterar status
  * Remover itens
  * Gerar relatório (changelog)

### 🔥 Destaque

Essa é a **tela mais importante do sistema**.

### 🎯 Objetivo

Centralizar tudo relacionado a uma release.

---

## 🧾 4. Tela de Relatório (Changelog)

### 📌 Função

Gerar o texto final da versão.

### ⚙️ O que ela faz:

* Agrupa itens por cliente
* Formata tudo em Markdown
* Exibe texto pronto para:

  * copiar
  * enviar (Slack, Discord, etc.)
* Destaca itens com migration

### 💡 Exemplo:

```md
**v1.0.0** Versao - Lancamento 2026-03-29

**Cliente X**
- Ajuste no sistema
- Nova feature (migrations)
```

### 🎯 Objetivo

Facilitar comunicação da release.

---

## 🟧 5. Tela de Itens Pendentes

### 📌 Função

Mostrar itens que ainda não estão em nenhuma versão.

### ⚙️ O que ela faz:

* Lista todos os itens sem versão
* Permite:

  * Editar item
  * Excluir item
  * (indiretamente) vincular a uma versão

### 🎯 Objetivo

Funcionar como um **backlog**.

---

## 🟩 6. Tela de Clientes

### 📌 Função

Gerenciar os clientes.

### ⚙️ O que ela faz:

* Lista todos os clientes
* Permite:

  * Criar cliente
  * Editar cliente
  * Excluir cliente

### 🎯 Objetivo

Organizar os itens por cliente.

---

## 🧩 7. Tela de Cadastro/Edição de Cliente

### 📌 Função

Criar ou editar um cliente.

### ⚙️ O que ela faz:

* Exibe formulário com:

  * nome do cliente
* Salva no banco
* Atualiza estado global

### 🎯 Objetivo

Manter a base de clientes atualizada.

---

## 🧩 8. Tela de Cadastro/Edição de Versão

### 📌 Função

Criar ou editar uma versão.

### ⚙️ O que ela faz:

* Exibe formulário com:

  * nome
  * data
  * status
* Salva no banco
* Atualiza lista de versões

### 🎯 Objetivo

Gerenciar releases do sistema.

---

## 🧩 9. Tela de Cadastro/Edição de Item

### 📌 Função

Criar ou editar um item (task/feature/bug).

### ⚙️ O que ela faz:

* Formulário com:

  * descrição
  * cliente
  * link (opcional)
  * flag de migration
  * versão (opcional)
* Permite:

  * criar item novo
  * editar item existente

### 🎯 Objetivo

Registrar mudanças do sistema.

---

## 🔄 RELAÇÃO ENTRE AS TELAS

Fluxo típico:

1. Login
2. Ir para **Versões**
3. Criar versão
4. Criar itens ou usar pendentes
5. Vincular itens à versão
6. Finalizar versão
7. Gerar relatório

---

## 🧠 RESUMO FINAL

Cada tela representa uma etapa do processo:

| Tela               | Papel                      |
| ------------------ | -------------------------- |
| Login              | Autenticação               |
| Versões            | Visão geral                |
| Detalhes da versão | Gestão completa da release |
| Relatório          | Comunicação (changelog)    |
| Pendentes          | Backlog                    |
| Clientes           | Organização                |
| Forms (CRUD)       | Criação/Edição             |

---

## 🚀 Conclusão

O sistema foi pensado como um fluxo simples e direto:

> Criar → Organizar → Finalizar → Comunicar

Cada tela cumpre exatamente uma dessas etapas.

---
