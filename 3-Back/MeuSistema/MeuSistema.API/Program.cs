using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MeuSistema.API.Middlewares;
using MeuSistema.Application.AppServices;
using MeuSistema.Application.DTOs;
using MeuSistema.Application.Deleters;
using MeuSistema.Application.Factories;
using MeuSistema.Application.Interfaces;
using MeuSistema.Application.Projectors;
using MeuSistema.Application.Updaters;
using MeuSistema.Application.Validators;
using MeuSistema.Domain.Entities;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Infrastructure.Context;
using MeuSistema.Infrastructure.Repositories;
using MeuSistema.Infrastructure.Services;
using MeuSistema.Shared.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// DbContext
// ─────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─────────────────────────────────────────────
// Repositories
// ─────────────────────────────────────────────
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

// ─────────────────────────────────────────────
// Factories
// ─────────────────────────────────────────────
builder.Services.AddScoped<IFactory<Produto, CriarProdutoDto>, ProdutoFactory>();
builder.Services.AddScoped<IFactory<Usuario, CriarUsuarioDto>, UsuarioFactory>();

// ─────────────────────────────────────────────
// Updaters
// ─────────────────────────────────────────────
builder.Services.AddScoped<IUpdater<Produto, AtualizarProdutoDto>, ProdutoUpdater>();

// ─────────────────────────────────────────────
// Projectors
// ─────────────────────────────────────────────
builder.Services.AddScoped<IProjector<Produto, ProdutoDto>, ProdutoProjector>();
builder.Services.AddScoped<IProjector<Usuario, UsuarioDto>, UsuarioProjector>();

// ─────────────────────────────────────────────
// Deleters
// ─────────────────────────────────────────────
builder.Services.AddScoped<IDeleter<Produto>, ProdutoDeleter>();

// ─────────────────────────────────────────────
// Validators
// ─────────────────────────────────────────────
builder.Services.AddScoped<IValidator<CriarProdutoDto>, CriarProdutoValidator>();
builder.Services.AddScoped<IValidator<AtualizarProdutoDto>, AtualizarProdutoValidator>();
builder.Services.AddScoped<IValidator<CriarUsuarioDto>, CriarUsuarioValidator>();
builder.Services.AddScoped<IValidator<LoginDto>, LoginValidator>();

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();

// ─────────────────────────────────────────────
// AppServices
// ─────────────────────────────────────────────
builder.Services.AddScoped<IProdutoAppService, ProdutoAppService>();
builder.Services.AddScoped<IUsuarioAppService, UsuarioAppService>();

// ─────────────────────────────────────────────
// JWT Authentication
// ─────────────────────────────────────────────
var chaveJwt = builder.Configuration["Jwt:Chave"]
    ?? throw new InvalidOperationException("Chave JWT não configurada.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Emissor"],
            ValidAudience = builder.Configuration["Jwt:Audiencia"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveJwt))
        };
    });

builder.Services.AddAuthorization();

// ─────────────────────────────────────────────
// Swagger
// ─────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MeuSistema API",
        Version = "v1",
        Description = "API com DDD + SOLID + JWT"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe: Bearer {seu_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// ─────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MeuSistema API v1"));
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
