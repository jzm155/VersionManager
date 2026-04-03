# 📘 Documentação do Banco de Dados

## 📌 Visão Geral

Este banco de dados é composto por quatro tabelas principais:

* **Versao** → Controle de versões/publicações
* **Cliente** → Cadastro de clientes
* **Usuario** → Autenticação de usuários
* **Item** → Registros vinculados a versões e clientes

---

## 🧩 Tabela: Versao

Armazena informações sobre versões/publicações do sistema.

| Campo          | Tipo        | Obrigatório | Descrição                |
| -------------- | ----------- | ----------- | ------------------------ |
| Id             | BIGSERIAL   | ✅           | Identificador único (PK) |
| Titulo         | TEXT        | ✅           | Título da versão         |
| DataPublicacao | TIMESTAMPTZ | ❌           | Data de publicação       |
| Numero         | INT8        | ❌           | Número da versão         |
| Status         | INT8        | ❌           | Status da versão         |

---

## 🧩 Tabela: Cliente

Armazena os dados dos clientes.

| Campo       | Tipo        | Obrigatório | Descrição                      |
| ----------- | ----------- | ----------- | ------------------------------ |
| Id          | BIGSERIAL   | ✅           | Identificador único (PK)       |
| Nome        | TEXT        | ✅           | Nome do cliente                |
| DataCriacao | TIMESTAMPTZ | ❌           | Data de criação (default: NOW) |
| DataEdicao  | TIMESTAMPTZ | ❌           | Data da última edição          |

---

## 🧩 Tabela: Usuario

Responsável pela autenticação dos usuários.

| Campo    | Tipo         | Obrigatório | Descrição                |
| -------- | ------------ | ----------- | ------------------------ |
| Id       | BIGSERIAL    | ✅           | Identificador único (PK) |
| Username | VARCHAR(255) | ✅           | Nome de usuário (único)  |
| Password | VARCHAR(255) | ✅           | Senha do usuário         |
| Name     | VARCHAR(255) | ❌           | Nome completo            |

### 🔒 Restrições

* **UNIQUE (Username)** → Não permite usuários duplicados

---

## 🧩 Tabela: Item

Tabela principal que relaciona versões e clientes.

| Campo      | Tipo        | Obrigatório | Descrição                         |
| ---------- | ----------- | ----------- | --------------------------------- |
| Id         | BIGSERIAL   | ✅           | Identificador único (PK)          |
| Descricao  | TEXT        | ❌           | Descrição do item                 |
| Url        | TEXT        | ❌           | Link relacionado                  |
| Numero     | TEXT        | ❌           | Número identificador              |
| IdVersao   | INT8        | ❌           | FK para Versao                    |
| IdCliente  | INT8        | ❌           | FK para Cliente                   |
| Data       | TIMESTAMPTZ | ❌           | Data de criação (default: NOW)    |
| DataEdicao | TIMESTAMPTZ | ❌           | Data de edição                    |
| Migration  | BOOLEAN     | ❌           | Flag de migração (default: false) |

### 🔗 Relacionamentos

* **IdVersao → Versao(Id)**

  * ON DELETE: SET NULL

* **IdCliente → Cliente(Id)**

  * ON DELETE: SET NULL

---

## ⚡ Índices

Melhoram a performance das consultas:

* `idx_item_versao` → Índice em **Item(IdVersao)**
* `idx_item_cliente` → Índice em **Item(IdCliente)**

---

## 🔄 Relacionamento Geral

```
Cliente ───────┐
               ├── Item ──── Versao
Usuario (independente)
```

---

## 📊 Considerações

* O banco segue um modelo relacional simples e eficiente
* Uso de **BIGSERIAL** garante escalabilidade para IDs
* Uso de **TIMESTAMPTZ** permite controle de fuso horário
* **ON DELETE SET NULL** evita exclusões em cascata indesejadas
* Índices foram aplicados nos campos de relacionamento para otimização

---

## 🚀 Possíveis Melhorias

* Adicionar **soft delete** (ex: coluna `Ativo` ou `DeletedAt`)
* Criptografar senhas (ex: bcrypt) na tabela Usuario
* Criar tabelas de domínio para o campo `Status`
* Adicionar auditoria (logs de alteração)

---
