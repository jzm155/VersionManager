using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeuSistema.Application.DTOs;
using MeuSistema.Application.Interfaces;

namespace MeuSistema.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioAppService _usuarioAppService;

    public UsuariosController(IUsuarioAppService usuarioAppService)
    {
        _usuarioAppService = usuarioAppService;
    }

    /// <summary>Registra um novo usuário</summary>
    [HttpPost("registrar")]
    [AllowAnonymous]
    public async Task<IActionResult> Registrar([FromBody] CriarUsuarioDto dto, CancellationToken cancellationToken)
    {
        var result = await _usuarioAppService.CriarAsync(dto, cancellationToken);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return CreatedAtAction(nameof(ObterPorId), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>Realiza login e retorna o token JWT</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        var result = await _usuarioAppService.LoginAsync(dto, cancellationToken);
        if (!result.Success) return Unauthorized(new { error = result.Error });
        return Ok(result.Value);
    }

    /// <summary>Obtém usuário por ID</summary>
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        var result = await _usuarioAppService.ObterPorIdAsync(id, cancellationToken);
        if (!result.Success) return NotFound(new { error = result.Error });
        return Ok(result.Value);
    }

    /// <summary>Desativa um usuário</summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Desativar(Guid id, CancellationToken cancellationToken)
    {
        var result = await _usuarioAppService.DesativarAsync(id, cancellationToken);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return NoContent();
    }
}
