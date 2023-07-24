﻿using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Example.Api.Adapters.Mongo.Technical;

/// <summary>
///     Manage app mongo connection
/// </summary>
public sealed class MongoContext
{
	/// <summary>
	///     Default constructor
	/// </summary>
	/// <param name="configuration"></param>
	public MongoContext(IConfiguration configuration)
	{
		var connectionString = configuration["Database"];

		ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);

		var (client, url) = MongoClientFactory.Create(connectionString);

		Console.WriteLine($"Connecting to Database '{url.DatabaseName}'");

		MongoDatabase = client.GetDatabase(url.DatabaseName);

		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String)
		};
		ConventionRegistry.Register("EnumStringConvention", pack, _ => true);
		BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
	}

	/// <summary>
	///     Récupération de la IMongoDatabase
	/// </summary>
	/// <returns></returns>
	public IMongoDatabase MongoDatabase { get; }
}