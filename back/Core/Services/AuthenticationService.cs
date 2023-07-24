﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Example.Api.Abstractions.Common.Technical.Tracing;
using Example.Api.Abstractions.Interfaces.Services;
using Example.Api.Adapters.Rest.AuthenticationApi;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Example.Api.Core.Services;

internal class AuthenticationService : TracingService, IAuthenticationService
{
	private readonly IJwtClient _jwtClient;
	private readonly SecurityKey _publicKey;

	public AuthenticationService(IJwtClient jwtClient, ILogger<AuthenticationService> logger) : base(logger)
	{
		_jwtClient = jwtClient;
		_publicKey = GetPublicKey().Result;
	}


	public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
	{
		using var _ = LogService();

		validatedToken = null;

		if (string.IsNullOrWhiteSpace(token))
			return false;


		token = token[("Bearer".Length + 1)..];

		var tokenHandler = new JwtSecurityTokenHandler();

		try
		{
			tokenHandler.ValidateToken(token, new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = _publicKey,
				ValidateIssuer = false,
				ValidateAudience = false,
				ClockSkew = TimeSpan.Zero
			}, out var securityToken);

			validatedToken = (JwtSecurityToken?) securityToken;

			return true;
		}
		catch
		{
			return false;
		}
	}

	private async Task<SecurityKey> GetPublicKey()
	{
		using var _ = LogService();

		var key = (await _jwtClient.GetValidationKeyAsync()).Data;
		var rsa = RSA.Create();

		rsa.ImportFromPem(key);

		return new RsaSecurityKey(rsa);
	}
}