using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Example.Api.Adapters.Mongo.Repositories.Base;

/// <summary>
///     Manage entity in MongoDB
/// </summary>
/// <typeparam name="T">Entity implementation</typeparam>
public abstract class BaseRepository<T>
{
	private readonly string _collectionName;
	private readonly IMongoDatabase _database;

	/// <summary>
	///     Default constructor
	/// </summary>
	/// <param name="database">Database of the MongoDB connection string (registered by Aspire)</param>
	/// <param name="logger"></param>
	protected BaseRepository(IMongoDatabase database, ILogger<BaseRepository<T>> logger)
	{
		Logger = logger;
		_database = database;
		_collectionName = typeof(T).Name[..^"Entity".Length];
	}

	/// <summary>
	///     Logger of the repository, also used to open trace scopes
	/// </summary>
	protected ILogger<BaseRepository<T>> Logger { get; }

	/// <summary>
	///     Implementation of the collection
	/// </summary>
	protected IMongoCollection<T> EntityCollection => _database.GetCollection<T>(_collectionName);


	/// <summary>
	///     Create an index for this collection
	/// </summary>
	/// <param name="properties"></param>
	/// <param name="unique"></param>
	protected void CreateIndexIfMissing(ICollection<string> properties, bool unique = false)
	{
		var indexName = string.Join("-", properties);
		var indexes = EntityCollection.Indexes.List().ToList();
		var foundIndex = indexes.Any(index => index["key"].AsBsonDocument.Names.Contains(indexName));

		var indexBuilder = Builders<T>.IndexKeys;

		var newIndex = indexBuilder.Combine(properties.Select(property => indexBuilder.Ascending(property)));


		var options = new CreateIndexOptions
		{
			Unique = unique,
			Name = indexName
		};

		var indexModel = new CreateIndexModel<T>(newIndex, options);


		if (foundIndex) return;

		Logger.LogWarning($"Property {_collectionName}.{indexName} is not indexed, creating one");
		EntityCollection.Indexes.CreateOne(indexModel);
		Logger.LogWarning($"Property {_collectionName}.{indexName} is now indexed");
	}
}