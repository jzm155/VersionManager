using MeuSistema.Application.DTOs;
using MeuSistema.Application.Interfaces;
using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Application.Factories;

public class UsuarioFactory : IFactory<Usuario, CriarUsuarioDto>
{
    private readonly IPasswordHasher _passwordHasher;

    public UsuarioFactory(IPasswordHasher passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public Usuario Criar(CriarUsuarioDto dto)
    {
        var senhaHash = _passwordHasher.Hash(dto.Senha);
        return new Usuario(dto.Nome, dto.Email, senhaHash);
    }
}
