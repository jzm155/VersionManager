using FluentValidation;
using MeuSistema.Application.DTOs;
using MeuSistema.Application.Interfaces;
using MeuSistema.Domain.Interfaces;
using MeuSistema.Shared.Interfaces;
using MeuSistema.Shared.Results;

namespace MeuSistema.Application.AppServices;

public class ProdutoAppService : IProdutoAppService
{
    private readonly IProdutoRepository _repository;
    private readonly IFactory<Domain.Entities.Produto, CriarProdutoDto> _factory;
    private readonly IUpdater<Domain.Entities.Produto, AtualizarProdutoDto> _updater;
    private readonly IProjector<Domain.Entities.Produto, ProdutoDto> _projector;
    private readonly IDeleter<Domain.Entities.Produto> _deleter;
    private readonly IValidator<CriarProdutoDto> _criarValidator;
    private readonly IValidator<AtualizarProdutoDto> _atualizarValidator;

    public ProdutoAppService(
        IProdutoRepository repository,
        IFactory<Domain.Entities.Produto, CriarProdutoDto> factory,
        IUpdater<Domain.Entities.Produto, AtualizarProdutoDto> updater,
        IProjector<Domain.Entities.Produto, ProdutoDto> projector,
        IDeleter<Domain.Entities.Produto> deleter,
        IValidator<CriarProdutoDto> criarValidator,
        IValidator<AtualizarProdutoDto> atualizarValidator)
    {
        _repository = repository;
        _factory = factory;
        _updater = updater;
        _projector = projector;
        _deleter = deleter;
        _criarValidator = criarValidator;
        _atualizarValidator = atualizarValidator;
    }

    public async Task<Result<ProdutoDto>> CriarAsync(CriarProdutoDto dto, CancellationToken cancellationToken = default)
    {
        var validacao = await _criarValidator.ValidateAsync(dto, cancellationToken);
        if (!validacao.IsValid)
            return Result<ProdutoDto>.Fail(string.Join("; ", validacao.Errors.Select(e => e.ErrorMessage)));

        var produto = _factory.Criar(dto);
        await _repository.AddAsync(produto, cancellationToken);
        return Result<ProdutoDto>.Ok(_projector.Project(produto));
    }

    public async Task<Result<ProdutoDto>> AtualizarAsync(Guid id, AtualizarProdutoDto dto, CancellationToken cancellationToken = default)
    {
        var validacao = await _atualizarValidator.ValidateAsync(dto, cancellationToken);
        if (!validacao.IsValid)
            return Result<ProdutoDto>.Fail(string.Join("; ", validacao.Errors.Select(e => e.ErrorMessage)));

        var produto = await _repository.GetByIdAsync(id, cancellationToken);
        if (produto is null)
            return Result<ProdutoDto>.Fail("Produto não encontrado.");

        _updater.Atualizar(produto, dto);
        await _repository.UpdateAsync(produto, cancellationToken);
        return Result<ProdutoDto>.Ok(_projector.Project(produto));
    }

    public async Task<Result<bool>> ExcluirAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var produto = await _repository.GetByIdAsync(id, cancellationToken);
        if (produto is null)
            return Result<bool>.Fail("Produto não encontrado.");

        return await _deleter.DeleteAsync(produto, cancellationToken);
    }

    public async Task<Result<ProdutoDto>> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var produto = await _repository.GetByIdAsync(id, cancellationToken);
        if (produto is null)
            return Result<ProdutoDto>.Fail("Produto não encontrado.");

        return Result<ProdutoDto>.Ok(_projector.Project(produto));
    }

    public async Task<Result<IEnumerable<ProdutoDto>>> ListarAsync(CancellationToken cancellationToken = default)
    {
        var produtos = await _repository.GetAllAsync(cancellationToken);
        return Result<IEnumerable<ProdutoDto>>.Ok(produtos.Select(_projector.Project));
    }

    public async Task<Result<IEnumerable<ProdutoDto>>> ListarAtivosAsync(CancellationToken cancellationToken = default)
    {
        var produtos = await _repository.GetAtivosAsync(cancellationToken);
        return Result<IEnumerable<ProdutoDto>>.Ok(produtos.Select(_projector.Project));
    }
}
