using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;

namespace Example.Api.Adapters.Mongo.Technical;

/// <summary>
///     Serialization conventions of the app documents: camelCase names, enums as strings, nulls omitted.
/// </summary>
public static class MongoConventions
{
	private static int _registered;

	/// <summary>
	///     Registers the conventions once per process (the BSON registry is global).
	/// </summary>
	public static void Register()
	{
		if (Interlocked.Exchange(ref _registered, 1) == 1) return;

		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String),
			new CamelCaseElementNameConvention(),
			new IgnoreIfNullConvention(true)
		};
		ConventionRegistry.Register("AppConventions", pack, _ => true);
		BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
	}
}
