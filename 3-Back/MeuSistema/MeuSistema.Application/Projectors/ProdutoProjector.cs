using MeuSistema.Application.DTOs;
using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Application.Projectors;

public class ProdutoProjector : IProjector<Produto, ProdutoDto>
{
    public ProdutoDto Project(Produto entity)
    {
        return new ProdutoDto(
            entity.Id,
            entity.Nome,
            entity.Descricao,
            entity.Preco,
            entity.Estoque,
            entity.Ativo,
            entity.CriadoEm,
            entity.AtualizadoEm
        );
    }
}
