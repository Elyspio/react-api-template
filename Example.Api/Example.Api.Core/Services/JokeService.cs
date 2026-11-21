using Elyspio.Utils.Results;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Errors;
using Example.Api.Abstractions.Interfaces.Adapters;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Microsoft.Extensions.Logging;
using ZiggyCreatures.Caching.Fusion;

namespace Example.Api.Core.Services;

/// <summary>
///     Joke of the day, cached with FusionCache (memory L1 + Redis L2, shared by every instance through the backplane).
/// </summary>
public class JokeService(IJokeAdapter jokeAdapter, IFusionCache cache, TimeProvider timeProvider, ILogger<JokeService> logger) : IJokeService
{
	internal const string CacheKey = "joke:of-the-day";

	public async Task<Result<Joke>> GetJokeOfTheDay(CancellationToken cancellationToken)
	{
		using var trace = logger.Trace();

		var now = timeProvider.GetUtcNow();
		var untilMidnight = now.Date.AddDays(1) - now.UtcDateTime;

		Error? failure = null;

		var options = new FusionCacheEntryOptions(untilMidnight)
			// The provider is down at midnight: keep serving yesterday's joke (up to 2 days) and retry every 5 minutes.
			.SetFailSafe(true, TimeSpan.FromDays(2), TimeSpan.FromMinutes(5))
			// Answer from the stale value after 1s while the call goes on in the background.
			.SetFactoryTimeouts(TimeSpan.FromSeconds(1));

		try
		{
			return await cache.GetOrSetAsync<Joke>(CacheKey, async (ctx, ct) =>
			{
				var result = await jokeAdapter.GetRandom(ct);
				if (result.TryGet(out var value, out var error)) return value;

				// Fail without throwing: FusionCache falls back on the expired joke if there is one
				failure = error;
				return ctx.Fail(error.Message);
			}, options, cancellationToken);
		}
		catch (FusionCacheFactoryException)
		{
			// No joke cached yet and the provider failed
			return trace.Fail(failure ?? new JokeSourceUnavailable("No joke available"));
		}
	}
}
