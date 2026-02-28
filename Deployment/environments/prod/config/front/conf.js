window.example ??= {};
window.example.config = {
	endpoints: {
		core: "https://elyspio.fr/react-api-template",
	},
	oidc: {
		authority: "https://elyspio.fr/auth/realms/react-api-template",
		clientId: "react-api-template-front",
		scope: "openid profile email",
		redirectPath: "/auth/callback",
		postLogoutRedirectPath: "/",
		silentRedirectPath: "/auth/silent-callback",
	},
};
