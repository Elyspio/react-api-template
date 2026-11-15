using Elyspio.Utils.Results;
using Example.Api.Abstractions.Errors;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Interfaces.Repositories;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Example.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Example.Api.Core.Services;

public class TodoService(ITodoRepository todoRepository, ILogger<TodoService> logger) : ITodoService
{
	private const string defaultUser = "public";
	private readonly TodoAssembler todoAssembler = new();

	public async Task<Todo> Add(string label)
	{
		using var trace = logger.Trace($"{Log.F(label)}");

		var entity = await todoRepository.Add(label, defaultUser);
		var data = todoAssembler.Convert(entity);

		return data;
	}

	public async Task<Todo> AddForUser(string label, string user)
	{
		using var trace = logger.Trace($"{Log.F(user)} {Log.F(label)}");

		var entity = await todoRepository.Add(label, user);
		var data = todoAssembler.Convert(entity);

		return data;
	}

	public async Task<List<Todo>> GetAllForUser(string user)
	{
		using var trace = logger.Trace($"{Log.F(user)}");

		var entities = await todoRepository.GetAll(user);
		var data = todoAssembler.Convert(entities);

		return data;
	}

	public async Task<List<Todo>> GetAll()
	{
		using var trace = logger.Trace();

		var entities = await todoRepository.GetAll(defaultUser);
		var data = todoAssembler.Convert(entities);

		return data;
	}

	public Task<Result<Todo>> Check(Guid id)
	{
		return CheckForUser(id, defaultUser);
	}

	public async Task<Result<Todo>> CheckForUser(Guid id, string user)
	{
		using var trace = logger.Trace($"{Log.F(user)} {Log.F(id)}");

		var entity = await todoRepository.Check(id, user);
		if (entity is null) return trace.Fail(new EntityNotFound(nameof(Todo), id));

		return todoAssembler.Convert(entity);
	}

	public async Task Delete(Guid id)
	{
		using var trace = logger.Trace($"{Log.F(id)}");

		await todoRepository.Delete(id, defaultUser);
	}

	public async Task DeleteForUser(Guid id, string user)
	{
		using var trace = logger.Trace($"{Log.F(id)}");

		await todoRepository.Delete(id, user);
	}
}