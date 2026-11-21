using Example.Api.Web.Endpoints;
using Example.Api.Web.Technical.Extensions;

namespace Example.Api.Web.Start;

/// <summary>
///     Application Initializer
/// </summary>
public static class AppRuntime
{
	/// <summary>
	///     Initialize runtime middlewares and endpoints
	/// </summary>
	public static WebApplication Initialize(this WebApplication app)
	{
		app.UseExceptionHandler();

		// Health checks
		app.MapDefaultEndpoints();

		app.UseCors();

		app.UseAuthentication();
		app.UseAuthorization();

		app.MapAppOpenApi();

		app.MapTodoEndpoints();
		app.MapJokeEndpoints();

		if (!app.Environment.IsProduction()) return app;

		// Serve the SPA (front built into wwwroot)
		app.UseStaticFiles();

		app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), appBuilder =>
		{
			appBuilder.UseRouting();
			appBuilder.UseEndpoints(ep => { ep.MapFallbackToFile("index.html"); });
		});

		return app;
	}
}
