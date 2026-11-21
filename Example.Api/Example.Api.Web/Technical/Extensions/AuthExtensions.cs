namespace Example.Api.Web.Technical.Extensions;

/// <summary>
///     Authentication: bearer tokens issued by Keycloak
/// </summary>
public static class AuthExtensions
{
	/// <summary>Name of the Keycloak resource, resolved by service discovery (<c>services:keycloak:*</c>).</summary>
	public const string KeycloakServiceName = "keycloak";

	/// <summary>
	///     Validates the JWT of the front (realm <c>Keycloak:Realm</c>, audience <c>Keycloak:Audience</c>)
	/// </summary>
	public static IHostApplicationBuilder AddAppAuthentication(this IHostApplicationBuilder builder)
	{
		var realm = builder.Configuration["Keycloak:Realm"] ?? throw new InvalidOperationException("Keycloak:Realm is required");
		var audience = builder.Configuration["Keycloak:Audience"] ?? throw new InvalidOperationException("Keycloak:Audience is required");

		builder.Services.AddServiceDiscovery();

		builder.Services.AddAuthentication()
			.AddKeycloakJwtBearer(KeycloakServiceName, realm, options =>
			{
				options.Audience = audience;
				// Keep the claims as Keycloak issues them (preferred_username, sub)
				options.MapInboundClaims = false;
				// Keycloak runs over http in development (Aspire container)
				if (builder.Environment.IsDevelopment()) options.RequireHttpsMetadata = false;
			});

		builder.Services.AddAuthorization();

		return builder;
	}
}
