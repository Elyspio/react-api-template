using Example.Api.Abstractions.Interfaces.Adapters;
using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Rest.Adapters;
using Example.Api.Adapters.Rest.Configs;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Http.Resilience;
using Microsoft.Extensions.Options;
using Polly;

namespace Example.Api.Adapters.Rest.Injections;

public class RestAdapterModule : IDotnetModule
{
	public void Load(IHostApplicationBuilder builder)
	{
		builder.Services.AddOptions<JokeApiOptions>().Bind(builder.Configuration.GetSection(JokeApiOptions.Section));

		builder.Services
			.AddHttpClient<IJokeAdapter, JokeApiAdapter>((sp, client) =>
			{
				client.BaseAddress = sp.GetRequiredService<IOptions<JokeApiOptions>>().Value.BaseUrl;
				client.DefaultRequestHeaders.UserAgent.ParseAdd("react-api-template");
			})
			// Polly 8 pipeline, outermost first: total budget > retries > circuit breaker > timeout of each attempt.
			.AddResilienceHandler("joke-api", pipeline =>
			{
				pipeline.AddTimeout(TimeSpan.FromSeconds(15));

				pipeline.AddRetry(new HttpRetryStrategyOptions
				{
					MaxRetryAttempts = 3,
					BackoffType = DelayBackoffType.Exponential,
					UseJitter = true,
					Delay = TimeSpan.FromMilliseconds(300),
					// 5xx, 408, 429 and network errors; JokeAPI answers 429 when the rate limit is hit
					ShouldHandle = args => ValueTask.FromResult(HttpClientResiliencePredicates.IsTransient(args.Outcome))
				});

				pipeline.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
				{
					FailureRatio = 0.5,
					MinimumThroughput = 5,
					SamplingDuration = TimeSpan.FromSeconds(30),
					BreakDuration = TimeSpan.FromSeconds(30)
				});

				pipeline.AddTimeout(TimeSpan.FromSeconds(3));
			});
	}
}
