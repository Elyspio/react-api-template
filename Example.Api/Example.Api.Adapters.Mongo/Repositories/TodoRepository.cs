using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Common.Extensions;
using Example.Api.Abstractions.Interfaces.Repositories;
using Example.Api.Abstractions.Models.Base;
using Example.Api.Abstractions.Models.Entities;
using Example.Api.Adapters.Mongo.Repositories.Base;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Example.Api.Adapters.Mongo.Repositories;

internal class TodoRepository(IMongoDatabase database, ILogger<BaseRepository<TodoEntity>> logger) : CrudRepository<TodoEntity, TodoBase>(database, logger),
	ITodoRepository
{
	public async Task<TodoEntity> Add(string label, string user)
	{
		using var trace = Logger.Trace($"{Log.F(user)} {Log.F(label)}");

		var entity = new TodoEntity
		{
			Checked = false,
			Label = label,
			User = user
		};
		await EntityCollection.InsertOneAsync(entity);

		trace.Exit($"{Log.F(entity.Id)}");

		return entity;
	}

	public async Task<List<TodoEntity>> GetAll(string user)
	{
		using var trace = Logger.Trace($"{Log.F(user)}");

		return await EntityCollection.AsQueryable().Where(x => x.User == user).ToListAsync();
	}

	public async Task<TodoEntity?> Check(Guid id, string user)
	{
		using var trace = Logger.Trace($"{Log.F(id)} {Log.F(user)}");

		var entity = await EntityCollection.AsQueryable().FirstOrDefaultAsync(todo => todo.User == user && todo.Id == id.AsObjectId());
		if (entity is null) return null;

		entity.Checked = !entity.Checked;

		await EntityCollection.FindOneAndReplaceAsync(e => e.Id == id.AsObjectId(), entity);

		return entity;
	}

	public async Task<bool> Delete(Guid id, string user)
	{
		using var trace = Logger.Trace($"{Log.F(id)} {Log.F(user)}");

		var result = await EntityCollection.DeleteOneAsync(todo => todo.User == user && todo.Id == id.AsObjectId());

		trace.Exit($"{Log.F(result.DeletedCount)}");

		return result.DeletedCount > 0;
	}

	public async Task<bool> Own(ObjectId id, string user)
	{
		using var trace = Logger.Trace($"{Log.F(id)} {Log.F(user)}");

		var todo = await GetById(id);

		return todo?.User == user;
	}
}