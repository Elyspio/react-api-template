namespace Example.Api.Abstractions.Models.Transports;

/// <summary>
///     A joke. Single-part jokes only have a <see cref="Text" />, two-part jokes also have a <see cref="Punchline" />.
/// </summary>
/// <param name="Id">Identifier of the joke at the provider</param>
/// <param name="Category">Category (Programming, Misc...)</param>
/// <param name="Text">The joke, or its setup for a two-part joke</param>
/// <param name="Punchline">Delivery of a two-part joke</param>
public sealed record Joke(int Id, string Category, string Text, string? Punchline);
