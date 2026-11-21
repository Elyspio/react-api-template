using Elyspio.Utils.Telemetry.MongoDB.Business;
using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Mongo.Repositories;
using Example.Api.Adapters.Mongo.Technical;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Example.Api.Adapters.Mongo.Injections;

public class MongoAdapterModule : IDotnetModule
{
	/// <summary>Name of the connection string (and of the Aspire database resource).</summary>
	public const string ConnectionName = "MongoDB";

	public void Load(IHostApplicationBuilder builder)
	{
		MongoConventions.Register();

		// IMongoClient + IMongoDatabase (database of the connection string) + health check.
		// Spans come from Elyspio.Utils.Telemetry.MongoDB (AddAppMongoInstrumentation), not from Aspire, to avoid duplicates.
		builder.AddMongoDBClient(ConnectionName,
			settings => settings.DisableTracing = true,
			clientSettings => clientSettings.ClusterConfigurator = cluster => cluster.Subscribe(new MongoDbActivityEventSubscriber()));

		builder.Services.Scan(scan => scan
			.FromAssemblyOf<MongoAdapterModule>()
			.AddClasses(classes => classes.InNamespaceOf<TodoRepository>(), false)
			.AsImplementedInterfaces()
			.WithSingletonLifetime()
		);
	}
}
