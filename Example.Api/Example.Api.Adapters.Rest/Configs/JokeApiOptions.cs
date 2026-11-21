namespace Example.Api.Adapters.Rest.Configs;

/// <summary>
///     Settings of the JokeAPI client (section <c>JokeApi</c>).
/// </summary>
public sealed class JokeApiOptions
{
	public const string Section = "JokeApi";

	/// <summary>Base address of JokeAPI v2.</summary>
	public Uri BaseUrl { get; set; } = new("https://v2.jokeapi.dev/");

	/// <summary>Categories to draw from (see https://v2.jokeapi.dev/categories).</summary>
	public string Categories { get; set; } = "Programming,Misc,Pun";
}
