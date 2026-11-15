using Elyspio.Utils.Results;
using Example.Api.Abstractions.Models.Transports;

namespace Example.Api.Abstractions.Interfaces.Services;

public interface ITodoService
{
	Task<Todo> Add(string label);
	Task<Todo> AddForUser(string label, string user);
	Task<List<Todo>> GetAllForUser(string user);
	Task<List<Todo>> GetAll();
	Task<Result<Todo>> Check(Guid id);
	Task<Result<Todo>> CheckForUser(Guid id, string user);
	Task Delete(Guid id);
	Task DeleteForUser(Guid id, string user);
}