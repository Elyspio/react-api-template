using Elyspio.Utils.Results;
using Example.Api.Abstractions.Models.Transports;

namespace Example.Api.Abstractions.Interfaces.Services;

/// <summary>
///     Todos of a user. Public todos belong to the <see cref="PublicUser" /> user.
/// </summary>
public interface ITodoService
{
	const string PublicUser = "public";

	Task<List<Todo>> GetAll(string user);
	Task<Result<Todo>> Add(string label, string user);
	Task<Result<Todo>> Check(Guid id, string user);
	Task<Result<Unit>> Delete(Guid id, string user);
}
