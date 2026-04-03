# 📊 Arquitetura por Projetos (Solution) - DDD + SOLID

---

# 🏗️ 📁 Estrutura da Solution

```plaintext
Solution/
│
├── MeuSistema.API                → Camada de entrada (Web API)
├── MeuSistema.Application        → Casos de uso (AppServices, DTOs)
├── MeuSistema.Domain             → Núcleo do domínio
├── MeuSistema.Infrastructure     → Acesso a dados (EF, Repositories)
├── MeuSistema.Shared             → Componentes compartilhados (Result, Base)
```

---

# 🧠 📦 Responsabilidade de cada projeto

---

## 🎮 MeuSistema.API

### 📌 Contém:

* Controllers
* Configuração de DI
* Middlewares
* Configuração de autenticação (JWE)

### ❌ NÃO deve conter:

* Regra de negócio
* Acesso direto ao banco

---

## 🧠 MeuSistema.Application

### 📌 Contém:

* AppServices
* DTOs
* Validators (FluentValidation)
* Factories
* Updaters
* Projectors
* Deleters
* Interfaces dos AppServices

### 🎯 Responsável por:

* Orquestrar o fluxo
* Converter dados
* Coordenar regras

---

## 🧱 MeuSistema.Domain

### 📌 Contém:

* Entidades (Aggregate Root)
* Interfaces de Repositórios
* Interfaces de Services
* Domain Services
* Value Objects
* Regras de negócio puras

### ❗ Regra importante:

👉 NÃO depende de nenhum outro projeto

---

## 🗂️ MeuSistema.Infrastructure

### 📌 Contém:

* DbContext (Entity Framework)
* Implementações dos Repositories
* Configuração do banco

### 🎯 Responsável por:

* Persistência de dados

---

## 🔁 MeuSistema.Shared

### 📌 Contém:

* Result Pattern
* Interfaces base:

  * `IAggregateRoot`
  * `IFactory<>`
  * `IUpdater<>`
  * `IProjector<>`
  * `IDeleter<>`
* Classes utilitárias

---

# 🔗 🔥 Dependências entre projetos

```plaintext
API → Application → Domain
         ↓
   Infrastructure
         
Shared → (usado por todos)
```

---

## 📌 Regras importantes

* API depende de Application
* Application depende de Domain
* Infrastructure depende de Domain
* Domain NÃO depende de ninguém
* Shared pode ser usado por todos

---

# 🧩 Exemplo prático (Usuario)

---

## 🧱 Domain

```csharp
// MeuSistema.Domain
public class Usuario : IAggregateRoot
{
    public Guid Id { get; private set; }
    public string Username { get; private set; }
    public string Password { get; private set; }
}
```

---

## 📦 Application

```csharp
// MeuSistema.Application
public class UsuarioDto
{
    public string Username { get; set; }
    public string Password { get; set; }
}
```

---

## 🧩 Repository Interface (Domain)

```csharp
public interface IUsuarioRepository
{
    Task Add(Usuario usuario);
}
```

---

## 🗂️ Repository (Infrastructure)

```csharp
public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task Add(Usuario usuario)
    {
        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();
    }
}
```

---

## 🧠 AppService (Application)

```csharp
public class UsuarioAppService
{
    private readonly IUsuarioRepository _repo;
    private readonly IFactory<Usuario, UsuarioDto> _factory;

    public UsuarioAppService(
        IUsuarioRepository repo,
        IFactory<Usuario, UsuarioDto> factory)
    {
        _repo = repo;
        _factory = factory;
    }

    public async Task<Result<UsuarioDto>> Criar(UsuarioDto dto)
    {
        var usuario = _factory.Criar(dto);

        await _repo.Add(usuario);

        return Result<UsuarioDto>.Ok(dto);
    }
}
```

---

## 🎮 Controller (API)

```csharp
[ApiController]
[Route("usuario")]
public class UsuarioController : ControllerBase
{
    private readonly UsuarioAppService _app;

    public UsuarioController(UsuarioAppService app)
    {
        _app = app;
    }

    [HttpPost]
    public async Task<IActionResult> Criar(UsuarioDto dto)
    {
        var result = await _app.Criar(dto);

        if (!result.Success)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }
}
```

---

# 💉 DI (na API)

```csharp
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<UsuarioAppService>();

builder.Services.AddScoped<IFactory<Usuario, UsuarioDto>, UsuarioFactory>();
builder.Services.AddScoped<IUpdater<Usuario, UsuarioDto>, UsuarioUpdater>();
builder.Services.AddScoped<IProjector<Usuario, UsuarioDto>, UsuarioProjector>();
builder.Services.AddScoped<IDeleter<Usuario>, UsuarioDeleter>();
```

---

# 🔄 Fluxo Final

```plaintext
HTTP Request
   ↓
Controller (API)
   ↓
AppService (Application)
   ↓
Factory / Validator / Patterns
   ↓
Domain
   ↓
Repository (Infrastructure)
   ↓
DbContext → Banco
```

---

# 🚀 Benefícios dessa separação

* 🔹 Organização profissional
* 🔹 Escalabilidade
* 🔹 Baixo acoplamento
* 🔹 Testes isolados
* 🔹 Reutilização
* 🔹 Clareza de responsabilidades

---

# ⚠️ Erros comuns

❌ Colocar regra no Controller
❌ Fazer Application acessar DbContext direto
❌ Domain depender de Infrastructure
❌ Não usar interfaces

---

# 🧠 Conclusão

Essa separação por projetos transforma seu sistema em:

* Arquitetura limpa
* Modular
* Pronta para crescer
* Fácil de manter

---

# 📌 Resumo Final

Você terá:

* API → entrada
* Application → orquestração
* Domain → regras
* Infrastructure → banco
* Shared → base comum

👉 Isso é exatamente o padrão usado em sistemas enterprise.

---
