using FluentValidation;
using MeuSistema.Application.DTOs;

namespace MeuSistema.Application.Validators;

public class CriarProdutoValidator : AbstractValidator<CriarProdutoDto>
{
    public CriarProdutoValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(100).WithMessage("Nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória.")
            .MaximumLength(500).WithMessage("Descrição deve ter no máximo 500 caracteres.");

        RuleFor(x => x.Preco)
            .GreaterThan(0).WithMessage("Preço deve ser maior que zero.");

        RuleFor(x => x.Estoque)
            .GreaterThanOrEqualTo(0).WithMessage("Estoque não pode ser negativo.");
    }
}

public class AtualizarProdutoValidator : AbstractValidator<AtualizarProdutoDto>
{
    public AtualizarProdutoValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(100).WithMessage("Nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória.")
            .MaximumLength(500).WithMessage("Descrição deve ter no máximo 500 caracteres.");

        RuleFor(x => x.Preco)
            .GreaterThan(0).WithMessage("Preço deve ser maior que zero.");

        RuleFor(x => x.Estoque)
            .GreaterThanOrEqualTo(0).WithMessage("Estoque não pode ser negativo.");
    }
}
