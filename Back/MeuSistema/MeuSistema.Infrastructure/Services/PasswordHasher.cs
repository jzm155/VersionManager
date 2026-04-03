using MeuSistema.Application.Interfaces;

namespace MeuSistema.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string senha)
    {
        return BCrypt.Net.BCrypt.HashPassword(senha, workFactor: 12);
    }

    public bool Verificar(string senha, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(senha, hash);
    }
}
