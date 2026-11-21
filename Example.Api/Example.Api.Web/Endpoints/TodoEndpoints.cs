using System.Security.Claims;
using Elyspio.Utils.Results.AspNetCore;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Example.Api.Web.Endpoints;

/// <summary>Body of the creation of a todo.</summary>
/// <param name="Label">Label of the todo (1 to 200 characters)</param>
public sealed record AddTodoRequest(string Label);

/// <summary>
///     Todos: a public board (anonymous) and a board per connected user.
/// </summary>
public static class TodoEndpoints
{
	public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
	{
		var common = app.MapGroup("/api/todo").WithTags("Todo").AllowAnonymous();

		common.MapGet("/", (ITodoService todos) => GetAll(todos, ITodoService.PublicUser)).WithName("getTodos").WithSummary("Public todos");
		common.MapPost("/", (AddTodoRequest request, ITodoService todos) => Add(todos, request, ITodoService.PublicUser)).WithName("addTodo").WithSummary("Add a public todo").WithTodoCreation();
		common.MapPut("/{id:guid}/toggle", (Guid id, ITodoService todos) => Toggle(todos, id, ITodoService.PublicUser)).WithName("toggleTodo").WithSummary("Check or uncheck a public todo").WithTodoChange();
		common.MapDelete("/{id:guid}", (Guid id, ITodoService todos) => Delete(todos, id, ITodoService.PublicUser)).WithName("deleteTodo").WithSummary("Delete a public todo").WithTodoDeletion();

		var user = app.MapGroup("/api/todo/user").WithTags("Todo").RequireAuthorization().ProducesProblem(StatusCodes.Status401Unauthorized);

		user.MapGet("/", (ClaimsPrincipal principal, ITodoService todos) => GetAll(todos, principal.GetUserName())).WithName("getUserTodos").WithSummary("Todos of the connected user");
		user.MapPost("/", (AddTodoRequest request, ClaimsPrincipal principal, ITodoService todos) => Add(todos, request, principal.GetUserName())).WithName("addUserTodo")
			.WithSummary("Add a todo for the connected user").WithTodoCreation();
		user.MapPut("/{id:guid}/toggle", (Guid id, ClaimsPrincipal principal, ITodoService todos) => Toggle(todos, id, principal.GetUserName())).WithName("toggleUserTodo")
			.WithSummary("Check or uncheck a todo of the connected user").WithTodoChange();
		user.MapDelete("/{id:guid}", (Guid id, ClaimsPrincipal principal, ITodoService todos) => Delete(todos, id, principal.GetUserName())).WithName("deleteUserTodo")
			.WithSummary("Delete a todo of the connected user").WithTodoDeletion();

		return app;
	}

	private static async Task<Ok<List<Todo>>> GetAll(ITodoService todos, string user) => TypedResults.Ok(await todos.GetAll(user));

	private static async Task<IResult> Add(ITodoService todos, AddTodoRequest request, string user) =>
		(await todos.Add(request.Label, user)).ToHttpResult(todo => TypedResults.Created($"/api/todo/{todo.Id}", todo));

	private static async Task<IResult> Toggle(ITodoService todos, Guid id, string user) => (await todos.Check(id, user)).ToHttpResult();

	private static async Task<IResult> Delete(ITodoService todos, Guid id, string user) => (await todos.Delete(id, user)).ToHttpResult();

	// ToHttpResult returns an IResult: the responses are declared for the OpenAPI document.
	private static RouteHandlerBuilder WithTodoCreation(this RouteHandlerBuilder route) => route.Produces<Todo>(StatusCodes.Status201Created).ProducesValidationProblem();
	private static RouteHandlerBuilder WithTodoChange(this RouteHandlerBuilder route) => route.Produces<Todo>().ProducesProblem(StatusCodes.Status404NotFound);
	private static RouteHandlerBuilder WithTodoDeletion(this RouteHandlerBuilder route) => route.Produces(StatusCodes.Status204NoContent).ProducesProblem(StatusCodes.Status404NotFound);

	/// <summary>Owner of the user's todos: the Keycloak username (falls back to the subject).</summary>
	private static string GetUserName(this ClaimsPrincipal principal) =>
		principal.FindFirstValue("preferred_username") ?? principal.FindFirstValue("sub") ?? throw new InvalidOperationException("Authenticated user without a name");
}
