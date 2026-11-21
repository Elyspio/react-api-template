using Elyspio.Utils.Results;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Errors;
using Example.Api.Abstractions.Interfaces.Repositories;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Example.Api.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Example.Api.Core.Services;

public class TodoService(ITodoRepository todoRepository, ILogger<TodoService> logger) : ITodoService
{
	private readonly TodoAssembler todoAssembler = new();

	public async Task<List<Todo>> GetAll(string user)
	{
		using var trace = logger.Trace($"{Log.F(user)}");

		var entities = await todoRepository.GetAll(user);

		return todoAssembler.Convert(entities);
	}

	public async Task<Result<Todo>> Add(string label, string user)
	{
		using var trace = logger.Trace($"{Log.F(user)} {Log.F(label)}");

		label = label.Trim();
		if (label.Length == 0) return trace.Fail(new InvalidTodoLabel("The label is required."));
		if (label.Length > InvalidTodoLabel.MaxLength) return trace.Fail(new InvalidTodoLabel($"The label must not exceed {InvalidTodoLabel.MaxLength} characters."));

		var entity = await todoRepository.Add(label, user);

		return todoAssembler.Convert(entity);
	}

	public async Task<Result<Todo>> Check(Guid id, string user)
	{
		using var trace = logger.Trace($"{Log.F(user)} {Log.F(id)}");

		var entity = await todoRepository.Check(id, user);
		if (entity is null) return trace.Fail(new EntityNotFound(nameof(Todo), id));

		return todoAssembler.Convert(entity);
	}

	public async Task<Result<Unit>> Delete(Guid id, string user)
	{
		using var trace = logger.Trace($"{Log.F(user)} {Log.F(id)}");

		var deleted = await todoRepository.Delete(id, user);
		if (!deleted) return trace.Fail(new EntityNotFound(nameof(Todo), id));

		return Unit.Value;
	}
}
