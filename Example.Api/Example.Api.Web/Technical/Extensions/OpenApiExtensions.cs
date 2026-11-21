using Microsoft.OpenApi;
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
		// OpenAPI 3.1: the version supported by the front generator (@hey-api/openapi-ts)
		services.AddOpenApi(options => options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_1);
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
