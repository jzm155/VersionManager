namespace MeuSistema.Application.DTOs;

public record CriarUsuarioDto(
    string Nome,
    string Email,
    string Senha
);

public record AtualizarUsuarioDto(
    string Nome,
    string Email
);

public record LoginDto(
    string Email,
    string Senha
);

public record UsuarioDto(
    Guid Id,
    string Nome,
    string Email,
    bool Ativo,
    DateTime CriadoEm
);

public record LoginResponseDto(
    string Token,
    UsuarioDto Usuario
);
