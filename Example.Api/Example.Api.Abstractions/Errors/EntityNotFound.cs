using Elyspio.Utils.Results;

namespace Example.Api.Abstractions.Errors;

/// <summary>
///     No entity has this id (404). Business errors are values: a service returns them in a Result and the endpoint maps
///     them to a ProblemDetails with ToHttpResult.
/// </summary>
public sealed record EntityNotFound(string Entity, Guid Id) : NotFound("entity.not-found", $"Could not find {Entity} with id {Id}");
