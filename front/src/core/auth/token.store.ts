let accessToken: string | undefined;

export function setAccessToken(value?: string) {
	accessToken = value;
}

export function getAccessToken() {
	return accessToken;
}
