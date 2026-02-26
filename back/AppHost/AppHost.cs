var builder = DistributedApplication.CreateBuilder(args);

// MongoDB resource with data persistence
var mongo = builder.AddMongoDB("mongodb")
                   .WithDataVolume()
                   .WithLifetime(ContainerLifetime.Persistent);

var mongodb = mongo.AddDatabase("example-db");

// NPM Frontend (React app) - path is relative to AppHost project
var frontend = builder.AddNpmApp("frontend", "../../front")
                      .WithHttpEndpoint(port: 3000, env: "PORT")
                      .WithExternalHttpEndpoints()
                      .PublishAsDockerFile();

// .NET API with MongoDB reference
var api = builder.AddProject<Projects.Example_Api_Web>("api")
                 .WithReference(mongodb);

// Allow frontend to call API
frontend.WithEnvironment("REACT_APP_API_URL", api.GetEndpoint("http"));

builder.Build().Run();
