using Elyspio.Utils.Telemetry.Technical.Extensions;
using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Mongo.Injections;
using Example.Api.Adapters.Rest.Injections;
using Example.Api.Core.Injections;
using Example.Api.Web.Technical.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;

namespace Example.Api.Web.Start;

/// <summary>
///     Application builder
/// </summary>
public sealed class AppBuilder
{
	/// <summary>
	///     Create builder from command args
	/// </summary>
	/// <param name="args"></param>
	public AppBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		// Add Aspire service defaults (OpenTelemetry, health checks, service discovery)

		builder.Configuration.AddJsonFile("appsettings.docker.json", true, true);

		builder.AddLogging();

		builder.AddServiceDefaults();

		builder.Services.AddAppOpenTelemetry(builder.Configuration);
		
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<MongoAdapterModule>(builder.Configuration);
		builder.Services.AddModule<RestAdapterModule>(builder.Configuration);

		builder.Services
			.AddAppControllers()
			.AddAppSignalR()
			.AddAppSwagger()
			.AddAppOpenTelemetry(builder.Configuration);

		builder.Services.SetupCors(builder.Configuration);

		Application = builder.Build();
	}



	/// <summary>
	///     Built application
	/// </summary>
	public WebApplication Application { get; }
}

public static class Extensions
{
	
	public static IServiceCollection AddLogging(this WebApplicationBuilder builder)
	{
		builder.Logging.AddOpenTelemetry(logging =>
		{
			logging.IncludeFormattedMessage = true;
			logging.IncludeScopes = true;
		});
		
		builder.Host.UseSerilogWithTelemetry();

		return builder.Services;
	}
	
	public static IHostApplicationBuilder AddServiceDefaults(this IHostApplicationBuilder builder)
	{
		builder.AddDefaultHealthChecks();


		return builder;
	}


	public static IHostApplicationBuilder AddDefaultHealthChecks(this IHostApplicationBuilder builder)
	{
		builder.Services.AddHealthChecks()
			.AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

		return builder;
	}

	public static WebApplication MapDefaultEndpoints(this WebApplication app)
	{
		// Configure health check endpoints
		app.MapHealthChecks("/health", new HealthCheckOptions
		{
			Predicate = _ => true
		});

		app.MapHealthChecks("/alive", new HealthCheckOptions
		{
			Predicate = r => r.Tags.Contains("live")
		});

		return app;
	}
}