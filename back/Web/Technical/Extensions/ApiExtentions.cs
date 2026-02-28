using System.Text.Json.Serialization;
using Example.Api.Abstractions.Common.Helpers.Json;
using Example.Api.Web.Technical.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Example.Api.Web.Technical.Extensions;

/// <summary>
///     Api Extensions methods for <see cref="IServiceCollection" />
/// </summary>
public static class ApiExtentions
{
	/// <summary>
	///     Setup Controllers configuration
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection AddAppControllers(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();

		// services.AddSingleton<CustomAuthorizeFilter>();

		services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

		services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

		services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
					o.Filters.Add<HttpExceptionFilter>();
				}
			)
			.AddNewtonsoftJson(x =>
			{
				x.SerializerSettings.Formatting = Formatting.None;
				x.SerializerSettings.ContractResolver = new JsonContractResolver();

				// x.SerializerSettings.ContractResolver = new JsonContractResolver();
				x.SerializerSettings.Converters.Add(new StringEnumConverter());
				x.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
			});

		return services;
	}

	/// <summary>
	///     Setup SignalR configuration
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
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
    ///     Setup CORS
	/// </summary>
	/// <param name="services"></param>
 /// <param name="configuration"></param>
	/// <returns></returns>
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