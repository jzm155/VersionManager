using MeuSistema.Application.DTOs;
using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Application.Factories;

public class ProdutoFactory : IFactory<Produto, CriarProdutoDto>
{
    public Produto Criar(CriarProdutoDto dto)
    {
        return new Produto(
            dto.Nome,
            dto.Descricao,
            dto.Preco,
            dto.Estoque
        );
    }
}
