namespace MeuSistema.Domain.Entities;

public class Usuario : EntityBase
{
    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string SenhaHash { get; private set; } = string.Empty;
    public bool Ativo { get; private set; }

    protected Usuario() { }

    public Usuario(string nome, string email, string senhaHash)
    {
        Nome = nome;
        Email = email;
        SenhaHash = senhaHash;
        Ativo = true;
    }

    public void Atualizar(string nome, string email)
    {
        Nome = nome;
        Email = email;
        MarcarComoAtualizado();
    }

    public void AlterarSenha(string novaSenhaHash)
    {
        SenhaHash = novaSenhaHash;
        MarcarComoAtualizado();
    }

    public void Desativar()
    {
        Ativo = false;
        MarcarComoAtualizado();
    }
}
