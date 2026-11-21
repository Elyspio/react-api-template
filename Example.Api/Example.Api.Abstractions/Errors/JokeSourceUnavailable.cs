using Elyspio.Utils.Results;

namespace Example.Api.Abstractions.Errors;

/// <summary>
///     The joke provider failed (after retries) and no joke was cached yet (502).
/// </summary>
public sealed record JokeSourceUnavailable(string Reason) : BadGateway("joke.source-unavailable", "The joke provider is unavailable, try again later.");
