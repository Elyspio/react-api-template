using System.Net;
using System.Net.Http.Json;
using Example.Api.Abstractions.Models.Transports;
using Example.Api.Core.Services;
using Example.Api.Tests.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using ZiggyCreatures.Caching.Fusion;

namespace Example.Api.Tests;

public sealed class JokeEndpointsTests(ApiFactory factory)
{
	private static CancellationToken Ct => TestContext.Current.CancellationToken;

	/// <summary>
	///     One scenario on purpose: the resilience pipeline (circuit breaker) and the cache are shared by the whole app,
	///     so the steps must run in this order.
	/// </summary>
	[Fact]
	public async Task Joke_of_the_day_is_cached_and_survives_a_provider_outage()
	{
		var cache = factory.Services.GetRequiredService<IFusionCache>();
		await cache.RemoveAsync(JokeService.CacheKey, token: Ct);
		factory.JokeApi.Reset();
		var client = factory.CreateClient();

		// 1. Provider down, nothing cached: 502 ProblemDetails
		factory.JokeApi.Down = true;
		var failed = await client.GetAsync("/api/joke/today", Ct);
		failed.StatusCode.ShouldBe(HttpStatusCode.BadGateway);
		(await failed.Content.ReadFromJsonAsync<ProblemDetails>(Ct))!.Type.ShouldBe("urn:problem:joke.source-unavailable");
		factory.JokeApi.Calls.ShouldBeGreaterThan(1, "the transient failure is retried");

		// 2. Provider back: the two-part joke is mapped
		factory.JokeApi.Reset();
		var joke = await client.GetFromJsonAsync<Joke>("/api/joke/today", Ct);
		joke.ShouldBe(new Joke(42, "Programming", "Why do programmers prefer dark mode?", "Because light attracts bugs."));

		// 3. Same day: served from the cache
		factory.JokeApi.JokeId = 7;
		(await client.GetFromJsonAsync<Joke>("/api/joke/today", Ct))!.Id.ShouldBe(42);
		factory.JokeApi.Calls.ShouldBe(1);

		// 4. Entry expired (next day) while the provider is down: fail-safe serves the previous joke
		await cache.ExpireAsync(JokeService.CacheKey, token: Ct);
		factory.JokeApi.Down = true;
		var stale = await client.GetAsync("/api/joke/today", Ct);
		stale.StatusCode.ShouldBe(HttpStatusCode.OK);
		(await stale.Content.ReadFromJsonAsync<Joke>(Ct))!.Id.ShouldBe(42);

		factory.JokeApi.Reset();
	}
}
