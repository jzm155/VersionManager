namespace MeuSistema.Domain.Entities;

public class Produto : EntityBase
{
    public string Nome { get; private set; } = string.Empty;
    public string Descricao { get; private set; } = string.Empty;
    public decimal Preco { get; private set; }
    public int Estoque { get; private set; }
    public bool Ativo { get; private set; }

    // EF Core constructor
    protected Produto() { }

    public Produto(string nome, string descricao, decimal preco, int estoque)
    {
        Nome = nome;
        Descricao = descricao;
        Preco = preco;
        Estoque = estoque;
        Ativo = true;
    }

    public void Atualizar(string nome, string descricao, decimal preco, int estoque)
    {
        Nome = nome;
        Descricao = descricao;
        Preco = preco;
        Estoque = estoque;
        MarcarComoAtualizado();
    }

    public void Desativar()
    {
        Ativo = false;
        MarcarComoAtualizado();
    }

    public void Ativar()
    {
        Ativo = true;
        MarcarComoAtualizado();
    }
}
