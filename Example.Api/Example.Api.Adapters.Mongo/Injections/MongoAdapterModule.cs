using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Adapters.Mongo.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Example.Api.Adapters.Mongo.Injections;

public class MongoAdapterModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		services.Scan(scan => scan
			.FromAssemblyOf<MongoAdapterModule>()
			.AddClasses(classes => classes.InNamespaceOf<TodoRepository>(), false)
			.AsImplementedInterfaces()
			.WithSingletonLifetime()
		);
	}
}