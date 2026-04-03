using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Domain.Interfaces;

public interface IProdutoRepository : IRepository<Produto>
{
    Task<Produto?> GetByNomeAsync(string nome, CancellationToken cancellationToken = default);
    Task<IEnumerable<Produto>> GetAtivosAsync(CancellationToken cancellationToken = default);
}

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> EmailExisteAsync(string email, CancellationToken cancellationToken = default);
}
