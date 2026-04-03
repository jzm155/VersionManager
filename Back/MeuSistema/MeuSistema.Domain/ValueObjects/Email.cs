using System.Text.RegularExpressions;

namespace MeuSistema.Domain.ValueObjects;

public record Email
{
    public string Valor { get; }

    public Email(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new ArgumentException("E-mail não pode ser vazio.");

        if (!Regex.IsMatch(valor, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            throw new ArgumentException("E-mail inválido.");

        Valor = valor.ToLowerInvariant();
    }

    public override string ToString() => Valor;

    public static implicit operator string(Email email) => email.Valor;
    public static explicit operator Email(string valor) => new(valor);
}
