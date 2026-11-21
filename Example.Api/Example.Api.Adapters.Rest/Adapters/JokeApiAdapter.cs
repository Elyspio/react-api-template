using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Elyspio.Utils.Results;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Errors;
using Example.Api.Abstractions.Interfaces.Adapters;
using Example.Api.Abstractions.Models.Transports;
using Example.Api.Adapters.Rest.Configs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly.CircuitBreaker;
using Polly.Timeout;

namespace Example.Api.Adapters.Rest.Adapters;

/// <summary>
///     Calls JokeAPI v2 (https://v2.jokeapi.dev). Retries, circuit breaker and timeouts come from the resilience pipeline
///     of the HttpClient (see <see cref="Injections.RestAdapterModule" />): this class only maps the outcome to a Result.
/// </summary>
internal sealed class JokeApiAdapter(HttpClient httpClient, IOptions<JokeApiOptions> options, ILogger<JokeApiAdapter> logger) : IJokeAdapter
{
	public async Task<Result<Joke>> GetRandom(CancellationToken cancellationToken)
	{
		using var trace = logger.Trace();

		JokeApiResponse? response;
		try
		{
			response = await httpClient.GetFromJsonAsync<JokeApiResponse>($"joke/{options.Value.Categories}?safe-mode", cancellationToken);
		}
		catch (Exception e) when (e is HttpRequestException or BrokenCircuitException or TimeoutRejectedException)
		{
			return trace.Fail(new JokeSourceUnavailable(e.Message));
		}

		if (response is null || response.Error) return trace.Fail(new JokeSourceUnavailable(response?.Message ?? "Empty response"));

		var joke = response.Type == "twopart"
			? new Joke(response.Id, response.Category, response.Setup ?? "", response.Delivery)
			: new Joke(response.Id, response.Category, response.Joke ?? "", null);

		trace.Exit($"{Log.F(joke.Id)}");

		return joke;
	}

	/// <summary>Payload of <c>GET /joke/{categories}</c>.</summary>
	private sealed record JokeApiResponse(
		[property: JsonPropertyName("error")] bool Error,
		[property: JsonPropertyName("message")] string? Message,
		[property: JsonPropertyName("id")] int Id,
		[property: JsonPropertyName("category")] string Category,
		[property: JsonPropertyName("type")] string Type,
		[property: JsonPropertyName("joke")] string? Joke,
		[property: JsonPropertyName("setup")] string? Setup,
		[property: JsonPropertyName("delivery")] string? Delivery);
}
