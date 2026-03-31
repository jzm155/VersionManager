using MeuSistema.Application.DTOs;
using MeuSistema.Shared.Results;

namespace MeuSistema.Application.Interfaces;

public interface IProdutoAppService
{
    Task<Result<ProdutoDto>> CriarAsync(CriarProdutoDto dto, CancellationToken cancellationToken = default);
    Task<Result<ProdutoDto>> AtualizarAsync(Guid id, AtualizarProdutoDto dto, CancellationToken cancellationToken = default);
    Task<Result<bool>> ExcluirAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ProdutoDto>> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ProdutoDto>>> ListarAsync(CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ProdutoDto>>> ListarAtivosAsync(CancellationToken cancellationToken = default);
}
