using MeuSistema.Domain.Entities;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Shared.Interfaces;
using MeuSistema.Shared.Results;

namespace MeuSistema.Application.Deleters;

public class ProdutoDeleter : IDeleter<Produto>
{
    private readonly IProdutoRepository _repository;

    public ProdutoDeleter(IProdutoRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> DeleteAsync(Produto entity, CancellationToken cancellationToken = default)
    {
        try
        {
            entity.Desativar();
            await _repository.UpdateAsync(entity, cancellationToken);
            return Result<bool>.Ok(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Fail($"Erro ao excluir produto: {ex.Message}");
        }
    }
}
