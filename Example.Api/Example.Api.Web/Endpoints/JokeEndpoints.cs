using Elyspio.Utils.Results.AspNetCore;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;

namespace Example.Api.Web.Endpoints;

public static class JokeEndpoints
{
	public static IEndpointRouteBuilder MapJokeEndpoints(this IEndpointRouteBuilder app)
	{
		app.MapGet("/api/joke/today", async (IJokeService jokes, CancellationToken cancellationToken) => (await jokes.GetJokeOfTheDay(cancellationToken)).ToHttpResult())
			.WithTags("Joke")
			.WithName("getJokeOfTheDay")
			.WithSummary("Joke of the day")
			.WithDescription("Served from the cache until midnight (UTC); yesterday's joke is served while the provider is down.")
			.AllowAnonymous()
			.Produces<Joke>()
			.ProducesProblem(StatusCodes.Status502BadGateway);

		return app;
	}
}
