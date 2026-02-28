using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = DistributedApplication.CreateBuilder(args);
var appHostDirectory = builder.AppHostDirectory;

builder.Services.AddLogging(o => o.AddSimpleConsole(x => x.SingleLine = true));

// MongoDB resource with data persistence
var mongo = builder.AddMongoDB("Mongo-Databases")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var mongodb = mongo.AddDatabase("MongoDB");

const string keycloakRealm = "react-api-template";
const string keycloakClientId = "react-api-template-front";

var keycloakImportPath = Path.Combine(appHostDirectory, "keycloak");
var frontendPath = Path.GetFullPath(Path.Combine(appHostDirectory, "..", "Example.Front"));

var keycloak = builder.AddContainer("keycloak", "quay.io/keycloak/keycloak", "26.2")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHttpEndpoint(port: 8081, targetPort: 8080, name: "http")
    .WithBindMount(keycloakImportPath, "/opt/keycloak/data/import", isReadOnly: true)
    .WithEnvironment("KC_BOOTSTRAP_ADMIN_USERNAME", "admin")
    .WithEnvironment("KC_BOOTSTRAP_ADMIN_PASSWORD", "admin")
    .WithArgs("start-dev", "--import-realm");

// NPM Frontend (React app)
var frontend = builder.AddViteApp("frontend", frontendPath)
    .WithYarn()
    .WithHttpsEndpoint(name: "https", port: 3000);



// .NET API with MongoDB reference
var api = builder.AddProject<Projects.Example_Api_Web>("api")
    .WithHttpsEndpoint(name: "https", port: 4000)
    .WithEnvironment("Cors__AllowedOrigins__0", frontend.GetEndpoint("https"))
    .WithReference(mongodb);

// Allow frontend to call API and OIDC provider
frontend
    .WithEnvironment("VITE_API_BASE_URL", api.GetEndpoint("https"))
    .WithEnvironment("VITE_OIDC_AUTHORITY", keycloak.GetEndpoint("http"))
    .WithEnvironment("VITE_OIDC_REALM", keycloakRealm)
    .WithEnvironment("VITE_OIDC_CLIENT_ID", keycloakClientId)
    .WithEnvironment("VITE_OIDC_SCOPE", "openid profile email")
    .WithEnvironment("VITE_OIDC_REDIRECT_PATH", "/auth/callback")
    .WithEnvironment("VITE_OIDC_POST_LOGOUT_REDIRECT_PATH", "/")
    .WithEnvironment("VITE_OIDC_SILENT_REDIRECT_PATH", "/auth/silent-callback");

builder.Build().Run();  
