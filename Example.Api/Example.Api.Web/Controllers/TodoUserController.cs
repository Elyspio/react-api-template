using Elyspio.Utils.Results.AspNetCore;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Microsoft.AspNetCore.Mvc;

namespace Example.Api.Web.Controllers;

[Route("api/todo/user")]
[ApiController]
public class TodoUserController(ITodoService todoService, ILogger<TodoUserController> logger) : ControllerBase
{
	private string Username => Request.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value;


	[HttpDelete("{id:guid}")]
	[ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
	public async Task<IActionResult> DeleteForUser(Guid id)
	{
		using var trace = logger.Trace($"{Log.F(id)} {Log.F(Username)}");
		await todoService.DeleteForUser(id, Username);
		return NoContent();
	}

	[HttpPost]
	[ProducesResponseType(typeof(Todo), StatusCodes.Status201Created)]
	public async Task<IActionResult> AddForUser([FromBody] string label)
	{
		using var trace = logger.Trace($"{Log.F(label)} {Log.F(Username)}");
		var todo = await todoService.AddForUser(label, Username);
		return Created($"/{todo.Id}", todo);
	}


	[HttpGet]
	[ProducesResponseType(typeof(List<Todo>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetAllForUser()
	{
		using var trace = logger.Trace($"{Log.F(Username)}");
		return Ok(await todoService.GetAllForUser(Username));
	}


	[HttpPut("{id:guid}/toggle")]
	[ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
	[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
	public async Task<ActionResult<Todo>> CheckForUser(Guid id)
	{
		using var trace = logger.Trace($"{Log.F(id)} {Log.F(Username)}");
		return (await todoService.CheckForUser(id, Username)).ToActionResult();
	}
}