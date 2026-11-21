using Microsoft.Extensions.Hosting;

namespace Example.Api.Abstractions.Interfaces.Injections;

/// <summary>
///     Registers the services of one layer (core, adapter...) in the host.
/// </summary>
public interface IDotnetModule
{
	/// <summary>
	///     Registers the services of the module.
	/// </summary>
	/// <param name="builder">Application builder: services, configuration and environment</param>
	void Load(IHostApplicationBuilder builder);
}

public static class DotnetModuleExtensions
{
	/// <summary>
	///     Registers an entire module.
	/// </summary>
	/// <typeparam name="TModule">Module type</typeparam>
	/// <param name="builder">Application builder</param>
	public static IHostApplicationBuilder AddModule<TModule>(this IHostApplicationBuilder builder) where TModule : IDotnetModule, new()
	{
		new TModule().Load(builder);
		return builder;
	}
}
