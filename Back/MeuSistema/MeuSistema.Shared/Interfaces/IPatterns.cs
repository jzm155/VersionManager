namespace MeuSistema.Shared.Interfaces;

public interface IFactory<TEntity, TDto>
    where TEntity : IAggregateRoot
{
    TEntity Criar(TDto dto);
}

public interface IUpdater<TEntity, TDto>
    where TEntity : IAggregateRoot
{
    void Atualizar(TEntity entity, TDto dto);
}

public interface IProjector<TEntity, TDto>
    where TEntity : IAggregateRoot
{
    TDto Project(TEntity entity);
}

public interface IDeleter<TEntity>
    where TEntity : IAggregateRoot
{
    Task<Results.Result<bool>> DeleteAsync(TEntity entity, CancellationToken cancellationToken = default);
}
