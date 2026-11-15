using Elyspio.Utils.Results.AspNetCore;
using Elyspio.Utils.Telemetry;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Abstractions.Models.Transports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Example.Api.Web.Controllers;

[AllowAnonymous]
[Route("api/todo")]
[ApiController]
public class TodoController(ITodoService todoService, ILogger<TodoController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(List<Todo>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        using var trace = logger.Trace();
        return Ok(await todoService.GetAll());
    }

    [HttpPut("{id:guid}/toggle")]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Todo>> Check(Guid id)
    {
        using var trace = logger.Trace($"{Log.F(id)}");
        return (await todoService.Check(id)).ToActionResult();
    }


    [HttpPost]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
    public async Task<IActionResult> Add([FromBody] string label)
    {
        using var trace = logger.Trace($"{Log.F(label)}");
        return Ok(await todoService.Add(label));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id)
    {
        using var trace = logger.Trace($"{Log.F(id)}");
        await todoService.Delete(id);
        return NoContent();
    }
}