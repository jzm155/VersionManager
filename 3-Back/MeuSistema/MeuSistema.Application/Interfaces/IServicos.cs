using MeuSistema.Domain.Entities;

namespace MeuSistema.Application.Interfaces;

public interface IPasswordHasher
{
    string Hash(string senha);
    bool Verificar(string senha, string hash);
}

public interface IJwtService
{
    string GerarToken(Usuario usuario);
}
