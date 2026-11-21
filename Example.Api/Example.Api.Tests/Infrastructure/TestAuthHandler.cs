using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Example.Api.Tests.Infrastructure;

/// <summary>
///     Authenticates the request as the user named in the <see cref="UserHeader" /> header; anonymous without it.
/// </summary>
internal sealed class TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
	: AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
	public const string SchemeName = "Test";
	public const string UserHeader = "X-Test-User";

	protected override Task<AuthenticateResult> HandleAuthenticateAsync()
	{
		if (!Request.Headers.TryGetValue(UserHeader, out var user)) return Task.FromResult(AuthenticateResult.NoResult());

		var identity = new ClaimsIdentity([new Claim("preferred_username", user.ToString()), new Claim("sub", Guid.NewGuid().ToString())], SchemeName);

		return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName)));
	}
}
