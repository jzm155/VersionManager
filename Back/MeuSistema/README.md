# MeuSistema — .NET 8 + DDD + SOLID

Projeto base com arquitetura profissional seguindo **DDD**, **SOLID**, **Repository Pattern**, **Factory / Updater / Projector / Deleter**, **Result Pattern** e autenticação via **JWT**.

---

## 🏗️ Estrutura

```
MeuSistema.sln
├── MeuSistema.API           → Entrada HTTP (Controllers, Middlewares, Program.cs)
├── MeuSistema.Application   → Orquestração (AppServices, DTOs, Factories, Validators…)
├── MeuSistema.Domain        → Núcleo (Entidades, Interfaces de Repositório, Value Objects)
├── MeuSistema.Infrastructure→ Dados (EF Core, Repositórios, JWT, BCrypt)
└── MeuSistema.Shared        → Base comum (Interfaces genéricas, Result Pattern)
```

---

## 🚀 Como rodar

### Pré-requisitos
- .NET 8 SDK
- SQL Server (local ou Docker)

### 1. Configurar connection string
Edite `MeuSistema.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MeuSistemaDb;..."
}
```

### 2. Configurar chave JWT
```json
"Jwt": {
  "Chave": "SUA_CHAVE_SECRETA_MINIMO_32_CARACTERES_AQUI!!"
}
```

### 3. Aplicar migrations
```bash
cd MeuSistema.API
dotnet ef migrations add InitialCreate --project ../MeuSistema.Infrastructure
dotnet ef database update
```

### 4. Rodar a API
```bash
dotnet run --project MeuSistema.API
```

Acesse o Swagger em: `https://localhost:{porta}/swagger`

---

## 🔐 Autenticação

1. `POST /api/usuarios/registrar` — cria um usuário
2. `POST /api/usuarios/login` — retorna o token JWT
3. Clique em **Authorize** no Swagger e informe: `Bearer {token}`

---

## 📦 Pacotes utilizados

| Pacote | Uso |
|---|---|
| `FluentValidation` | Validação de DTOs |
| `BCrypt.Net-Next` | Hash de senhas |
| `Microsoft.EntityFrameworkCore` | ORM |
| `System.IdentityModel.Tokens.Jwt` | Geração de token |
| `Swashbuckle.AspNetCore` | Swagger UI |

---

## 🧩 Padrões implementados

- **Factory** → cria entidades a partir de DTOs
- **Updater** → atualiza entidades a partir de DTOs
- **Projector** → converte entidades em DTOs de resposta
- **Deleter** → encapsula regras de exclusão (soft delete)
- **Repository** → abstrai o acesso a dados
- **Result\<T\>** → retorno padronizado sem exceptions no fluxo normal
