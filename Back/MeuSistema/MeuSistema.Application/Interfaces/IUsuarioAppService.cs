using MeuSistema.Application.DTOs;
using MeuSistema.Shared.Results;

namespace MeuSistema.Application.Interfaces;

public interface IUsuarioAppService
{
    Task<Result<UsuarioDto>> CriarAsync(CriarUsuarioDto dto, CancellationToken cancellationToken = default);
    Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
    Task<Result<UsuarioDto>> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<bool>> DesativarAsync(Guid id, CancellationToken cancellationToken = default);
}
