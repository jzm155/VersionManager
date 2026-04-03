# 🚀 Version Manager

Sistema completo para gestão de versões e releases com frontend em JavaScript puro e backend em .NET 8.

---

## 📋 Pré-requisitos

- **.NET 8 SDK** - [Download aqui](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Python 3** (para servidor de desenvolvimento do frontend)
- **SQL Server LocalDB** (já incluído com Visual Studio 2022)

---

## 🏗️ Estrutura do Projeto

```
VersionManager/
├── 1-Documentation/     # Documentação do sistema
├── 2-Front/            # Frontend (HTML/CSS/JavaScript)
├── 3-Back/MeuSistema/  # Backend .NET 8 API
└── README.md
```

---

## 🛠️ Como Rodar

### 1️⃣ Configurar o Backend

```bash
# Navegar até o diretório do backend
cd 3-Back/MeuSistema

# Restaurar pacotes NuGet
dotnet restore

# Criar e aplicar migrations no banco
cd MeuSistema.API
dotnet ef migrations add InitialCreate --project ../MeuSistema.Infrastructure
dotnet ef database update

# Iniciar a API
cd ..
dotnet run --project MeuSistema.API
```

**O backend estará rodando em:**
- HTTPS: `https://localhost:62386`
- HTTP: `http://localhost:62387`
- Swagger: `https://localhost:62386/swagger`

### 2️⃣ Configurar o Frontend

```bash
# Navegar até o diretório do frontend (em outro terminal)
cd 2-Front

# Iniciar servidor de desenvolvimento
python -m http.server 8080
```

**O frontend estará rodando em:** `http://localhost:8080`

---

## 🔧 Configurações Importantes

### Connection String
O projeto usa **SQL Server LocalDB** por padrão. A connection string está configurada em:
`3-Back/MeuSistema/MeuSistema.API/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MeuSistemaDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### JWT Token
A chave JWT está configurada como placeholder. Para produção, altere em `appsettings.json`:
```json
{
  "Jwt": {
    "Chave": "SUA_CHAVE_SECRETA_MINIMO_32_CARACTERES_AQUI!!"
  }
}
```

---

## 🌐 Acesso ao Sistema

1. **Frontend Principal**: http://localhost:8080
2. **API Documentation**: https://localhost:62386/swagger
3. **API Endpoints**: https://localhost:62386/api

---

## 📱 Funcionalidades do Sistema

### 🎯 Telas Principais
- **Login** - Autenticação de usuários
- **Versões** - Listagem e gestão de releases
- **Detalhes da Versão** - Gestão completa de itens por versão
- **Relatório (Changelog)** - Geração automática de changelog
- **Itens Pendentes** - Backlog de tarefas
- **Clientes** - Gestão de clientes

### 🔧 Fluxo de Uso
1. Faça login no sistema
2. Crie uma nova versão
3. Adicione itens à versão (novos ou pendentes)
4. Finalize a versão
5. Gere o relatório/changelog

---

## 🏛️ Arquitetura do Backend

O backend segue melhores práticas com:

- **DDD** (Domain-Driven Design)
- **SOLID Principles**
- **Repository Pattern**
- **Factory/Updater/Projector/Deleter Pattern**
- **Result Pattern** para tratamento de erros
- **JWT Authentication**
- **Entity Framework Core 8**

### Estrutura de Camadas
```
MeuSistema.API           → Controllers, Middlewares
MeuSistema.Application   → Services, DTOs, Validators
MeuSistema.Domain        → Entities, Interfaces
MeuSistema.Infrastructure→ EF Core, Repositories
MeuSistema.Shared        → Common utilities
```

---

## 🐛 Solução de Problemas

### SQL Server não encontrado
Se encontrar erro de conexão com SQL Server:
1. Verifique se o SQL Server LocalDB está instalado
2. Use o comando: `sqllocaldb info`
3. Se necessário, instale o [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads)

### Portas em uso
Se as portas padrão estiverem ocupadas:
- A API .NET automaticamente buscará portas disponíveis
- Verifique o console para ver as portas reais em uso
- Atualize a URL do frontend se necessário

### Migrations
Se precisar recriar o banco:
```bash
cd 3-Back/MeuSistema/MeuSistema.API
dotnet ef database drop
dotnet ef database update
```

---

## 📚 Tecnologias Utilizadas

### Backend
- **.NET 8** - Framework principal
- **Entity Framework Core 8** - ORM
- **SQL Server** - Banco de dados
- **JWT Bearer** - Autenticação
- **FluentValidation** - Validação
- **BCrypt.Net-Next** - Hash de senhas
- **Swashbuckle** - Swagger/OpenAPI

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript ES6+** - Lógica
- **Fetch API** - Comunicação com backend

---

## 🚀 Deploy

### Backend (Produção)
```bash
dotnet publish -c Release -o ./publish
cd publish
dotnet MeuSistema.API.dll
```

### Frontend (Produção)
O frontend pode ser servido por qualquer servidor web estático (Nginx, Apache, IIS, etc.).



