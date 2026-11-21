using Elyspio.Utils.Results;
using Example.Api.Abstractions.Models.Transports;

namespace Example.Api.Abstractions.Interfaces.Services;

public interface IJokeService
{
	/// <summary>
	///     The joke of the day: fetched once, then cached until midnight (UTC).
	/// </summary>
	Task<Result<Joke>> GetJokeOfTheDay(CancellationToken cancellationToken);
}
