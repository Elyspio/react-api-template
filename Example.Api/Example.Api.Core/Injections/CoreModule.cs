using Example.Api.Abstractions.Interfaces.Injections;
using Example.Api.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace Example.Api.Core.Injections;

public class CoreModule : IDotnetModule
{
	public void Load(IHostApplicationBuilder builder)
	{
		builder.Services.TryAddSingleton(TimeProvider.System);

		builder.Services.Scan(scan => scan
			.FromAssemblyOf<CoreModule>()
			.AddClasses(classes => classes.InNamespaceOf<TodoService>(), false)
			.AsImplementedInterfaces()
			.WithSingletonLifetime()
		);
	}
}
