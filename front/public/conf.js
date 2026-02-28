window.example ??= {};
window.example.config = {
	endpoints: {
		core: "http://localhost:4000",
	},
	oidc: {
		authority: "http://localhost:8081/realms/react-api-template",
		clientId: "react-api-template-front",
		scope: "openid profile email",
		redirectPath: "/auth/callback",
		postLogoutRedirectPath: "/",
		silentRedirectPath: "/auth/silent-callback",
	},
};
