using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Domain.Entities;

public abstract class EntityBase : IAggregateRoot
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CriadoEm { get; protected set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; protected set; }

    protected void MarcarComoAtualizado()
    {
        AtualizadoEm = DateTime.UtcNow;
    }
}
