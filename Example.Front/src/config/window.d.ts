export type Config = {
	endpoints: {
		core: string;
	};
	oidc: {
		authority: string;
		clientId: string;
		scope: string;
		redirectPath: string;
		postLogoutRedirectPath: string;
		silentRedirectPath?: string;
	};
};

declare global {
	interface Window {
		config: Config;
	}
}
