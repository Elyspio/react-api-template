using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Mongo.Injections;
using Example.Api.Adapters.Rest.Injections;
using Example.Api.Core.Injections;
using Example.Api.Web.Technical.Extensions;
using Example.Api.ServiceDefaults;

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
		builder.AddServiceDefaults();

		builder.Configuration.AddJsonFile("appsettings.docker.json", true, true);

		builder.Services.AddModule<CoreModule>(builder.Configuration);

		builder.Services.AddModule<MongoAdapterModule>(builder.Configuration);
		builder.Services.AddModule<RestAdapterModule>(builder.Configuration);

		builder.Host.AddLogging();

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