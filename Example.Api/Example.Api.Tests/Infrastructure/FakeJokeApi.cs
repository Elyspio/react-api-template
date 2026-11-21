using System.Net;
using System.Text;

namespace Example.Api.Tests.Infrastructure;

/// <summary>
///     Stands for JokeAPI: answers a two-part joke, or 503 while <see cref="Down" /> is set.
/// </summary>
public sealed class FakeJokeApi : HttpMessageHandler
{
	private int _calls;

	public bool Down { get; set; }

	public int JokeId { get; set; } = 42;

	/// <summary>Number of requests received (retries included).</summary>
	public int Calls => _calls;

	public void Reset()
	{
		Down = false;
		JokeId = 42;
		Interlocked.Exchange(ref _calls, 0);
	}

	protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
	{
		Interlocked.Increment(ref _calls);

		if (Down) return Task.FromResult(new HttpResponseMessage(HttpStatusCode.ServiceUnavailable));

		var json = $$"""
		             {
		               "error": false,
		               "category": "Programming",
		               "type": "twopart",
		               "setup": "Why do programmers prefer dark mode?",
		               "delivery": "Because light attracts bugs.",
		               "id": {{JokeId}},
		               "safe": true,
		               "lang": "en"
		             }
		             """;

		return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(json, Encoding.UTF8, "application/json") });
	}
}
