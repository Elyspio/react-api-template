using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MongoDb;
using Testcontainers.Redis;

namespace Example.Api.Tests.Infrastructure;

/// <summary>
///     The real API over real MongoDB and Redis (Testcontainers). Keycloak is replaced by <see cref="TestAuthHandler" />
///     and JokeAPI by <see cref="FakeJokeApi" />.
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
	private readonly MongoDbContainer _mongo = new MongoDbBuilder("mongo:8.0").Build();
	private readonly RedisContainer _redis = new RedisBuilder("redis:8.2").Build();

	public FakeJokeApi JokeApi { get; } = new();

	public async ValueTask InitializeAsync()
	{
		await Task.WhenAll(_mongo.StartAsync(), _redis.StartAsync());
	}

	public override async ValueTask DisposeAsync()
	{
		await base.DisposeAsync();
		await _mongo.DisposeAsync();
		await _redis.DisposeAsync();
	}

	protected override void ConfigureWebHost(IWebHostBuilder builder)
	{
		builder.UseEnvironment("Testing");

		// The database must be part of the URL: Aspire then registers IMongoDatabase
		var mongo = new UriBuilder(_mongo.GetConnectionString()) { Path = "/tests", Query = "authSource=admin" };
		builder.UseSetting("ConnectionStrings:MongoDB", mongo.Uri.ToString());
		builder.UseSetting("ConnectionStrings:Redis", _redis.GetConnectionString());

		builder.ConfigureTestServices(services =>
		{
			services.AddAuthentication(options =>
				{
					options.DefaultScheme = TestAuthHandler.SchemeName;
					options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
					options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
				})
				.AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, _ => { });

			// Typed client of IJokeAdapter: its name is the type name
			services.AddHttpClient("IJokeAdapter").ConfigurePrimaryHttpMessageHandler(() => JokeApi);
		});
	}

	/// <summary>Client authenticated as <paramref name="user" /> (preferred_username).</summary>
	public HttpClient CreateClientFor(string user)
	{
		var client = CreateClient();
		client.DefaultRequestHeaders.Add(TestAuthHandler.UserHeader, user);
		return client;
	}
}
