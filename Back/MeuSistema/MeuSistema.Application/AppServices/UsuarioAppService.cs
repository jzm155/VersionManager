using FluentValidation;
using MeuSistema.Application.DTOs;
using MeuSistema.Application.Interfaces;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Shared.Interfaces;
using MeuSistema.Shared.Results;

namespace MeuSistema.Application.AppServices;

public class UsuarioAppService : IUsuarioAppService
{
    private readonly IUsuarioRepository _repository;
    private readonly IFactory<Domain.Entities.Usuario, CriarUsuarioDto> _factory;
    private readonly IProjector<Domain.Entities.Usuario, UsuarioDto> _projector;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly IValidator<CriarUsuarioDto> _criarValidator;
    private readonly IValidator<LoginDto> _loginValidator;

    public UsuarioAppService(
        IUsuarioRepository repository,
        IFactory<Domain.Entities.Usuario, CriarUsuarioDto> factory,
        IProjector<Domain.Entities.Usuario, UsuarioDto> projector,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        IValidator<CriarUsuarioDto> criarValidator,
        IValidator<LoginDto> loginValidator)
    {
        _repository = repository;
        _factory = factory;
        _projector = projector;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _criarValidator = criarValidator;
        _loginValidator = loginValidator;
    }

    public async Task<Result<UsuarioDto>> CriarAsync(CriarUsuarioDto dto, CancellationToken cancellationToken = default)
    {
        var validacao = await _criarValidator.ValidateAsync(dto, cancellationToken);
        if (!validacao.IsValid)
            return Result<UsuarioDto>.Fail(string.Join("; ", validacao.Errors.Select(e => e.ErrorMessage)));

        var emailExiste = await _repository.EmailExisteAsync(dto.Email, cancellationToken);
        if (emailExiste)
            return Result<UsuarioDto>.Fail("E-mail já cadastrado.");

        var usuario = _factory.Criar(dto);
        await _repository.AddAsync(usuario, cancellationToken);
        return Result<UsuarioDto>.Ok(_projector.Project(usuario));
    }

    public async Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var validacao = await _loginValidator.ValidateAsync(dto, cancellationToken);
        if (!validacao.IsValid)
            return Result<LoginResponseDto>.Fail(string.Join("; ", validacao.Errors.Select(e => e.ErrorMessage)));

        var usuario = await _repository.GetByEmailAsync(dto.Email, cancellationToken);
        if (usuario is null)
            return Result<LoginResponseDto>.Fail("Credenciais inválidas.");

        if (!_passwordHasher.Verificar(dto.Senha, usuario.SenhaHash))
            return Result<LoginResponseDto>.Fail("Credenciais inválidas.");

        if (!usuario.Ativo)
            return Result<LoginResponseDto>.Fail("Usuário inativo.");

        var token = _jwtService.GerarToken(usuario);
        var response = new LoginResponseDto(token, _projector.Project(usuario));
        return Result<LoginResponseDto>.Ok(response);
    }

    public async Task<Result<UsuarioDto>> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var usuario = await _repository.GetByIdAsync(id, cancellationToken);
        if (usuario is null)
            return Result<UsuarioDto>.Fail("Usuário não encontrado.");

        return Result<UsuarioDto>.Ok(_projector.Project(usuario));
    }

    public async Task<Result<bool>> DesativarAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var usuario = await _repository.GetByIdAsync(id, cancellationToken);
        if (usuario is null)
            return Result<bool>.Fail("Usuário não encontrado.");

        usuario.Desativar();
        await _repository.UpdateAsync(usuario, cancellationToken);
        return Result<bool>.Ok(true);
    }
}
