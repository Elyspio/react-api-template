var builder = DistributedApplication.CreateBuilder(args);

const string keycloakRealm = "react-api-template";
const string keycloakFrontClientId = "react-api-template-front";
// Audience added to the front's tokens by the realm (audience mapper), checked by the API
const string apiAudience = "react-api-template-api";

// MongoDB with data persistence
var mongodb = builder.AddMongoDB("Mongo-Databases")
	.WithDataVolume()
	.WithLifetime(ContainerLifetime.Persistent)
	.AddDatabase("MongoDB");

// Redis: L2 cache and backplane of FusionCache
var redis = builder.AddRedis("Redis")
	.WithLifetime(ContainerLifetime.Persistent);

// Keycloak with the realm of the template (client of the front + demo user)
var keycloak = builder.AddKeycloak("keycloak", 8081)
	.WithRealmImport("./keycloak")
	.WithLifetime(ContainerLifetime.Persistent);

// React front (Vite+)
var frontend = builder.AddViteApp("frontend", "../Example.Front")
	.WithPnpm()
	.WithHttpsEndpoint(name: "https", port: 3000);

// .NET API
var api = builder.AddDotnetProject("api", "../Example.Api/Example.Api.Web/Example.Api.Web.csproj")
	.WithHttpsEndpoint(name: "https", port: 4000)
	.WithEnvironment("Cors__AllowedOrigins__0", frontend.GetEndpoint("https"))
	.WithEnvironment("Keycloak__Realm", keycloakRealm)
	.WithEnvironment("Keycloak__Audience", apiAudience)
	.WithReference(mongodb)
	.WithReference(redis)
	.WithReference(keycloak)
	.WaitFor(mongodb)
	.WaitFor(redis)
	.WaitFor(keycloak)
	.WithHttpHealthCheck("/health");

// The front calls the API and signs in with Keycloak
frontend
	.WithEnvironment("VITE_API_BASE_URL", api.GetEndpoint("https"))
	.WithEnvironment("VITE_OIDC_AUTHORITY", keycloak.GetEndpoint("http"))
	.WithEnvironment("VITE_OIDC_REALM", keycloakRealm)
	.WithEnvironment("VITE_OIDC_CLIENT_ID", keycloakFrontClientId)
	.WithEnvironment("VITE_OIDC_SCOPE", "openid profile email")
	.WithEnvironment("VITE_OIDC_REDIRECT_PATH", "/auth/callback")
	.WithEnvironment("VITE_OIDC_POST_LOGOUT_REDIRECT_PATH", "/")
	.WithEnvironment("VITE_OIDC_SILENT_REDIRECT_PATH", "/auth/silent-callback")
	.WaitFor(keycloak);

builder.Build().Run();
