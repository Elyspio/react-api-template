using Elyspio.Utils.Results;

namespace Example.Api.Abstractions.Errors;

/// <summary>
///     The label of a todo is empty or too long (400, ValidationProblemDetails with a <c>label</c> field).
/// </summary>
public sealed record InvalidTodoLabel : Invalid
{
	public const int MaxLength = 200;

	public InvalidTodoLabel(string reason) : base("todo.invalid-label", "The label of the todo is invalid.")
	{
		Fields = new Dictionary<string, string[]> { ["label"] = [reason] };
	}
}
