namespace MeuSistema.Application.DTOs;

public record CriarProdutoDto(
    string Nome,
    string Descricao,
    decimal Preco,
    int Estoque
);

public record AtualizarProdutoDto(
    string Nome,
    string Descricao,
    decimal Preco,
    int Estoque
);

public record ProdutoDto(
    Guid Id,
    string Nome,
    string Descricao,
    decimal Preco,
    int Estoque,
    bool Ativo,
    DateTime CriadoEm,
    DateTime? AtualizadoEm
);
