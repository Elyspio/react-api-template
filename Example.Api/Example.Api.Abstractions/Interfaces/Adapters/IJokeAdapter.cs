using Elyspio.Utils.Results;
using Example.Api.Abstractions.Models.Transports;

namespace Example.Api.Abstractions.Interfaces.Adapters;

/// <summary>
///     Reads jokes from an external provider.
/// </summary>
public interface IJokeAdapter
{
	/// <summary>
	///     Fetches a random safe joke. Fails with a <see cref="Errors.JokeSourceUnavailable" /> when the provider cannot answer.
	/// </summary>
	Task<Result<Joke>> GetRandom(CancellationToken cancellationToken);
}
