using System.Text.Json.Serialization;

namespace Example.Api.Web.Technical.Extensions;

/// <summary>
///     Api Extensions methods for <see cref="IServiceCollection" />
/// </summary>
public static class ApiExtentions
{
	/// <summary>
	///     JSON (System.Text.Json) and ProblemDetails of the HTTP API
	/// </summary>
	public static IServiceCollection AddAppApi(this IServiceCollection services)
	{
		services.ConfigureHttpJsonOptions(options =>
		{
			options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
			options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
			// Numbers are numbers: no "integer | string" in the OpenAPI schemas (the Web defaults read numbers from strings)
			options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict;
		});

		// Unexpected exceptions become a 500 ProblemDetails without their details (see UseExceptionHandler);
		// expected failures are Results mapped by ToHttpResult.
		services.AddProblemDetails();

		return services;
	}

	/// <summary>
	///     Setup SignalR configuration
	/// </summary>
	public static IServiceCollection AddAppSignalR(this IServiceCollection services)
	{
		services.AddSignalR(options => { options.EnableDetailedErrors = true; })
			.AddJsonProtocol(options =>
				{
					options.PayloadSerializerOptions.IncludeFields = true;
					options.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
					options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
					options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
				}
			);

		return services;
	}

	/// <summary>
	///     Setup CORS: the origins of <c>Cors:AllowedOrigins</c> (with credentials), any origin otherwise
	/// </summary>
	public static IServiceCollection SetupCors(this IServiceCollection services, IConfiguration configuration)
	{
		var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins")
			.Get<string[]>()?
			.Where(origin => !string.IsNullOrWhiteSpace(origin))
			.Select(origin => origin.Trim())
			.Distinct(StringComparer.OrdinalIgnoreCase)
			.ToArray() ?? [];

		services.AddCors(options =>
			{
				options.AddDefaultPolicy(b =>
					{
						if (allowedOrigins.Length > 0)
						{
							b.WithOrigins(allowedOrigins);
							b.AllowAnyHeader();
							b.AllowAnyMethod();
							b.AllowCredentials();
						}
						else
						{
							b.AllowAnyOrigin();
							b.AllowAnyHeader();
							b.AllowAnyMethod();
						}
					}
				);
			}
		);

		return services;
	}
}
