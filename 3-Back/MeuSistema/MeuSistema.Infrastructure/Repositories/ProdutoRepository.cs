using Microsoft.EntityFrameworkCore;
using MeuSistema.Domain.Entities;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Infrastructure.Context;

namespace MeuSistema.Infrastructure.Repositories;

public class ProdutoRepository : RepositoryBase<Produto>, IProdutoRepository
{
    public ProdutoRepository(AppDbContext context) : base(context) { }

    public async Task<Produto?> GetByNomeAsync(string nome, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.Nome.ToLower() == nome.ToLower(), cancellationToken);
    }

    public async Task<IEnumerable<Produto>> GetAtivosAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.Ativo)
            .OrderBy(p => p.Nome)
            .ToListAsync(cancellationToken);
    }
}
