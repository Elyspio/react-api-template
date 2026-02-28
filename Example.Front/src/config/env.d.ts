interface ImportMetaEnv {
	readonly BASE_URL: string;
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_OIDC_AUTHORITY?: string;
	readonly VITE_OIDC_REALM?: string;
	readonly VITE_OIDC_CLIENT_ID?: string;
	readonly VITE_OIDC_SCOPE?: string;
	readonly VITE_OIDC_REDIRECT_PATH?: string;
	readonly VITE_OIDC_POST_LOGOUT_REDIRECT_PATH?: string;
	readonly VITE_OIDC_SILENT_REDIRECT_PATH?: string;
	readonly PROD?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
