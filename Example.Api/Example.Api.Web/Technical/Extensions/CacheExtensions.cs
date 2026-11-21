using System.Text.Json;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using StackExchange.Redis;
using ZiggyCreatures.Caching.Fusion;
using ZiggyCreatures.Caching.Fusion.Backplane.StackExchangeRedis;
using ZiggyCreatures.Caching.Fusion.Serialization.SystemTextJson;

namespace Example.Api.Web.Technical.Extensions;

/// <summary>
///     FusionCache: memory (L1) + Redis (L2) + Redis backplane to keep the L1 of every instance in sync
/// </summary>
public static class CacheExtensions
{
	/// <summary>Name of the Redis connection string (and of the Aspire resource).</summary>
	public const string RedisConnectionName = "Redis";

	public static IHostApplicationBuilder AddAppCache(this IHostApplicationBuilder builder)
	{
		// IConnectionMultiplexer + health check; spans come from Elyspio.Utils.Telemetry.Redis (no duplicates)
		builder.AddRedisClient(RedisConnectionName, settings => settings.DisableTracing = true);

		builder.Services.AddFusionCache()
			.WithOptions(options => options.CacheKeyPrefix = "react-api-template:")
			.WithSerializer(new FusionCacheSystemTextJsonSerializer(new JsonSerializerOptions(JsonSerializerDefaults.Web) { IncludeFields = true }))
			.WithDistributedCache(sp => new RedisCache(new RedisCacheOptions
			{
				ConnectionMultiplexerFactory = () => Task.FromResult(sp.GetRequiredService<IConnectionMultiplexer>())
			}))
			.WithBackplane(sp => new RedisBackplane(new RedisBackplaneOptions
			{
				ConnectionMultiplexerFactory = () => Task.FromResult(sp.GetRequiredService<IConnectionMultiplexer>())
			}));

		return builder;
	}
}
