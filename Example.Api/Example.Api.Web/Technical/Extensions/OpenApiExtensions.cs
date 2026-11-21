using Scalar.AspNetCore;

namespace Example.Api.Web.Technical.Extensions;

/// <summary>
///     OpenAPI document (Microsoft.AspNetCore.OpenApi) and its Scalar UI
/// </summary>
public static class OpenApiExtensions
{
	/// <summary>
	///     Generates the OpenAPI document from the endpoints metadata and the XML comments
	/// </summary>
	public static IServiceCollection AddAppOpenApi(this IServiceCollection services)
	{
		services.AddOpenApi();
		return services;
	}

	/// <summary>
	///     Serves the document at <c>/openapi/v1.json</c> (input of the front generator) and the UI at <c>/scalar</c>
	/// </summary>
	public static WebApplication MapAppOpenApi(this WebApplication app)
	{
		app.MapOpenApi();
		app.MapScalarApiReference();

		return app;
	}
}
