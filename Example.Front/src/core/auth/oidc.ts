import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";

const stripTrailingSlash = (value: string) => (value.endsWith("/") ? value.slice(0, -1) : value);

const normalizePath = (value: string) => (value.startsWith("/") ? value : `/${value}`);

const getBasePath = () => (import.meta.env.BASE_URL === "/" ? "" : stripTrailingSlash(import.meta.env.BASE_URL));

const toAbsoluteUrl = (value: string) => {
	if (/^https?:\/\//i.test(value)) {
		return value;
	}

	return new URL(`${getBasePath()}${normalizePath(value)}`, window.location.origin).toString();
};

const removeCallbackParams = () => {
	const current = new URL(window.location.href);
	for (const param of ["state", "session_state", "iss", "scope", "code"]) {
		current.searchParams.delete(param);
	}
	window.history.replaceState({}, document.title, `${current.pathname}${current.search}${current.hash}`);
};

const resolveAuthority = () => {
	const authorityFromEnv = import.meta.env.VITE_OIDC_AUTHORITY;
	const realmFromEnv = import.meta.env.VITE_OIDC_REALM;

	if (!authorityFromEnv) {
		return window.example.config.oidc.authority;
	}

	if (!realmFromEnv || authorityFromEnv.includes("/realms/")) {
		return authorityFromEnv;
	}

	return `${stripTrailingSlash(authorityFromEnv)}/realms/${realmFromEnv}`;
};

const redirectPath = import.meta.env.VITE_OIDC_REDIRECT_PATH || window.example.config.oidc.redirectPath;
const postLogoutRedirectPath = import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_PATH || window.example.config.oidc.postLogoutRedirectPath;
const silentRedirectPath = import.meta.env.VITE_OIDC_SILENT_REDIRECT_PATH || window.example.config.oidc.silentRedirectPath;
const silentRedirectUri = silentRedirectPath ? toAbsoluteUrl(silentRedirectPath) : undefined;

export const oidcConfig: AuthProviderProps = {
	authority: resolveAuthority(),
	client_id: import.meta.env.VITE_OIDC_CLIENT_ID || window.example.config.oidc.clientId,
	scope: import.meta.env.VITE_OIDC_SCOPE || window.example.config.oidc.scope,
	redirect_uri: toAbsoluteUrl(redirectPath),
	post_logout_redirect_uri: toAbsoluteUrl(postLogoutRedirectPath),
	silent_redirect_uri: silentRedirectUri,
	response_type: "code",
	automaticSilentRenew: Boolean(silentRedirectUri),
	userStore: new WebStorageStateStore({ store: window.localStorage }),
	onSigninCallback: removeCallbackParams,
};
