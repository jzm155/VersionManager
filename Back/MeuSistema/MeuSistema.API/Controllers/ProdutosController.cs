using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeuSistema.Application.DTOs;
using MeuSistema.Application.Interfaces;

namespace MeuSistema.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoAppService _produtoAppService;

    public ProdutosController(IProdutoAppService produtoAppService)
    {
        _produtoAppService = produtoAppService;
    }

    /// <summary>Lista todos os produtos</summary>
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.ListarAsync(cancellationToken);
        return result.Success ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    /// <summary>Lista apenas produtos ativos</summary>
    [HttpGet("ativos")]
    public async Task<IActionResult> ListarAtivos(CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.ListarAtivosAsync(cancellationToken);
        return result.Success ? Ok(result.Value) : BadRequest(new { error = result.Error });
    }

    /// <summary>Obtém produto por ID</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObterPorId(Guid id, CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.ObterPorIdAsync(id, cancellationToken);
        if (!result.Success) return NotFound(new { error = result.Error });
        return Ok(result.Value);
    }

    /// <summary>Cria um novo produto</summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarProdutoDto dto, CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.CriarAsync(dto, cancellationToken);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return CreatedAtAction(nameof(ObterPorId), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>Atualiza um produto existente</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarProdutoDto dto, CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.AtualizarAsync(id, dto, cancellationToken);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return Ok(result.Value);
    }

    /// <summary>Desativa (soft delete) um produto</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken cancellationToken)
    {
        var result = await _produtoAppService.ExcluirAsync(id, cancellationToken);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return NoContent();
    }
}
