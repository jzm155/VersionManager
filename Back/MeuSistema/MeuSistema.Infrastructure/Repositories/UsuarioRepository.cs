using Microsoft.EntityFrameworkCore;
using MeuSistema.Domain.Entities;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Infrastructure.Context;

namespace MeuSistema.Infrastructure.Repositories;

public class UsuarioRepository : RepositoryBase<Usuario>, IUsuarioRepository
{
    public UsuarioRepository(AppDbContext context) : base(context) { }

    public async Task<Usuario?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<bool> EmailExisteAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(u => u.Email.ToLower() == email.ToLower(), cancellationToken);
    }
}
