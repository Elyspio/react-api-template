import { getAccessToken } from "@/core/auth/token.store";
import { client } from "./generated/client.gen";

/**
 * Points the generated SDK at the API and authenticates its requests with the OIDC access token.
 * Generated code lives in ./generated (`pnpm refresh-api`), never edit it by hand.
 */
client.setConfig({
	baseUrl: import.meta.env.VITE_API_BASE_URL || window.example.config.endpoints.core,
});

client.interceptors.request.use((request) => {
	const accessToken = getAccessToken();
	if (accessToken) request.headers.set("Authorization", `Bearer ${accessToken}`);
	return request;
});

export * from "./generated";
export * from "./generated/@tanstack/react-query.gen";
