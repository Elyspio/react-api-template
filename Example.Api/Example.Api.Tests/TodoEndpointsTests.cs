using System.Net;
using System.Net.Http.Json;
using Example.Api.Abstractions.Models.Transports;
using Example.Api.Tests.Infrastructure;
using Microsoft.AspNetCore.Mvc;

[assembly: AssemblyFixture(typeof(ApiFactory))]

namespace Example.Api.Tests;

public sealed class TodoEndpointsTests(ApiFactory factory)
{
	private static CancellationToken Ct => TestContext.Current.CancellationToken;

	[Fact]
	public async Task Public_todo_can_be_added_toggled_and_deleted()
	{
		var client = factory.CreateClient();
		var label = $"public {Guid.NewGuid()}";

		var created = await client.PostAsJsonAsync("/api/todo", new { label }, Ct);
		created.StatusCode.ShouldBe(HttpStatusCode.Created);
		var todo = (await created.Content.ReadFromJsonAsync<Todo>(Ct))!;
		todo.Label.ShouldBe(label);
		todo.User.ShouldBe("public");
		todo.Checked.ShouldBeFalse();

		var all = await client.GetFromJsonAsync<List<Todo>>("/api/todo", Ct);
		all!.ShouldContain(t => t.Id == todo.Id);

		var toggled = await client.PutAsync($"/api/todo/{todo.Id}/toggle", null, Ct);
		toggled.StatusCode.ShouldBe(HttpStatusCode.OK);
		(await toggled.Content.ReadFromJsonAsync<Todo>(Ct))!.Checked.ShouldBeTrue();

		var deleted = await client.DeleteAsync($"/api/todo/{todo.Id}", Ct);
		deleted.StatusCode.ShouldBe(HttpStatusCode.NoContent);

		var deletedAgain = await client.DeleteAsync($"/api/todo/{todo.Id}", Ct);
		deletedAgain.StatusCode.ShouldBe(HttpStatusCode.NotFound);
	}

	[Fact]
	public async Task Toggling_an_unknown_todo_returns_a_not_found_problem()
	{
		var client = factory.CreateClient();

		var response = await client.PutAsync($"/api/todo/{Guid.NewGuid()}/toggle", null, Ct);

		response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
		var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>(Ct);
		problem!.Type.ShouldBe("urn:problem:entity.not-found");
	}

	[Theory]
	[InlineData("")]
	[InlineData("   ")]
	public async Task Adding_a_todo_without_label_returns_a_validation_problem(string label)
	{
		var client = factory.CreateClient();

		var response = await client.PostAsJsonAsync("/api/todo", new { label }, Ct);

		response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
		var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>(Ct);
		problem!.Errors.ShouldContainKey("label");
	}

	[Fact]
	public async Task Adding_a_too_long_label_returns_a_validation_problem()
	{
		var client = factory.CreateClient();

		var response = await client.PostAsJsonAsync("/api/todo", new { label = new string('a', 201) }, Ct);

		response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
	}

	[Theory]
	[InlineData("GET", "/api/todo/user")]
	[InlineData("POST", "/api/todo/user")]
	[InlineData("PUT", "/api/todo/user/7c1f2a43-2a59-4f7b-9d2a-1f0c39f1a001/toggle")]
	[InlineData("DELETE", "/api/todo/user/7c1f2a43-2a59-4f7b-9d2a-1f0c39f1a001")]
	public async Task User_todos_require_authentication(string method, string url)
	{
		var client = factory.CreateClient();

		var response = await client.SendAsync(new HttpRequestMessage(new HttpMethod(method), url) { Content = JsonContent.Create(new { label = "x" }) }, Ct);

		response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
	}

	[Fact]
	public async Task User_todos_are_isolated_per_user()
	{
		var alice = factory.CreateClientFor($"alice-{Guid.NewGuid()}");
		var bob = factory.CreateClientFor($"bob-{Guid.NewGuid()}");

		var created = await alice.PostAsJsonAsync("/api/todo/user", new { label = "alice's todo" }, Ct);
		created.StatusCode.ShouldBe(HttpStatusCode.Created);
		var todo = (await created.Content.ReadFromJsonAsync<Todo>(Ct))!;

		(await alice.GetFromJsonAsync<List<Todo>>("/api/todo/user", Ct))!.ShouldHaveSingleItem().Id.ShouldBe(todo.Id);
		(await bob.GetFromJsonAsync<List<Todo>>("/api/todo/user", Ct))!.ShouldBeEmpty();
		(await bob.GetFromJsonAsync<List<Todo>>("/api/todo", Ct))!.ShouldNotContain(t => t.Id == todo.Id);

		// Bob can neither toggle nor delete Alice's todo
		(await bob.PutAsync($"/api/todo/user/{todo.Id}/toggle", null, Ct)).StatusCode.ShouldBe(HttpStatusCode.NotFound);
		(await bob.DeleteAsync($"/api/todo/user/{todo.Id}", Ct)).StatusCode.ShouldBe(HttpStatusCode.NotFound);

		(await alice.DeleteAsync($"/api/todo/user/{todo.Id}", Ct)).StatusCode.ShouldBe(HttpStatusCode.NoContent);
	}
}
