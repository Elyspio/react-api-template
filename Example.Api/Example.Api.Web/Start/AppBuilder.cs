using Elyspio.Utils.Telemetry;
using Elyspio.Utils.Telemetry.MongoDB.Extensions;
using Elyspio.Utils.Telemetry.Redis.Extensions;
using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Mongo.Injections;
using Example.Api.Adapters.Rest.Injections;
using Example.Api.Core.Injections;
using Example.Api.Web.Technical.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace Example.Api.Web.Start;

/// <summary>
///     Application builder
/// </summary>
public sealed class AppBuilder
{
	/// <summary>
	///     Create builder from command args
	/// </summary>
	public AppBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		builder.Configuration.AddJsonFile("appsettings.docker.json", true, true);

		// Serilog console, plus traces, metrics and logs over OTLP when OTEL_EXPORTER_OTLP_ENDPOINT is set (Aspire sets it)
		builder.AddElyspioTelemetry(options =>
		{
			options.Tracing = tracing => tracing
				.AddAppMongoInstrumentation()
				.AddAppRedisInstrumentation()
				.AddFusionCacheInstrumentation();
			options.Metrics = metrics => metrics.AddFusionCacheInstrumentation();
		});

		builder.AddDefaultHealthChecks();

		builder.AddModule<CoreModule>();
		builder.AddModule<MongoAdapterModule>();
		builder.AddModule<RestAdapterModule>();

		builder.AddAppCache();
		builder.AddAppAuthentication();

		builder.Services
			.AddAppApi()
			.AddAppSignalR()
			.AddAppOpenApi()
			.SetupCors(builder.Configuration);

		Application = builder.Build();
	}

	/// <summary>
	///     Built application
	/// </summary>
	public WebApplication Application { get; }
}

public static class Extensions
{
	public static IHostApplicationBuilder AddDefaultHealthChecks(this IHostApplicationBuilder builder)
	{
		builder.Services.AddHealthChecks()
			.AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

		return builder;
	}

	public static WebApplication MapDefaultEndpoints(this WebApplication app)
	{
		// Readiness: every check (MongoDB and Redis included)
		app.MapHealthChecks("/health", new HealthCheckOptions
		{
			Predicate = _ => true
		});

		// Liveness: the process answers
		app.MapHealthChecks("/alive", new HealthCheckOptions
		{
			Predicate = r => r.Tags.Contains("live")
		});

		return app;
	}
}
