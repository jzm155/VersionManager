using MeuSistema.Application.DTOs;
using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Application.Updaters;

public class ProdutoUpdater : IUpdater<Produto, AtualizarProdutoDto>
{
    public void Atualizar(Produto entity, AtualizarProdutoDto dto)
    {
        entity.Atualizar(dto.Nome, dto.Descricao, dto.Preco, dto.Estoque);
    }
}
