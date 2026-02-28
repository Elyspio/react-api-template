using Example.Api.Abstractions.Interfaces.Injections;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Example.Api.Adapters.Rest.Injections;

public class RestAdapterModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{

	}
}