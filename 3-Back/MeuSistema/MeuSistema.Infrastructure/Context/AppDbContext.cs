using Microsoft.EntityFrameworkCore;
using MeuSistema.Domain.Entities;

namespace MeuSistema.Infrastructure.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Produto>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descricao).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Preco).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Estoque).IsRequired();
            entity.Property(e => e.Ativo).IsRequired();
            entity.Property(e => e.CriadoEm).IsRequired();
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.SenhaHash).IsRequired();
            entity.Property(e => e.Ativo).IsRequired();
            entity.Property(e => e.CriadoEm).IsRequired();
        });
    }
}
