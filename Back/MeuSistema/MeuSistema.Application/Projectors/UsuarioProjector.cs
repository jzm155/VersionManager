using MeuSistema.Application.DTOs;
using MeuSistema.Domain.Entities;
using MeuSistema.Shared.Interfaces;

namespace MeuSistema.Application.Projectors;

public class UsuarioProjector : IProjector<Usuario, UsuarioDto>
{
    public UsuarioDto Project(Usuario entity)
    {
        return new UsuarioDto(
            entity.Id,
            entity.Nome,
            entity.Email,
            entity.Ativo,
            entity.CriadoEm
        );
    }
}
