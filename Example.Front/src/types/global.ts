declare global {
	interface Window {
		example: {
			config: {
				endpoints: {
					core: string;
				};
				oidc: {
					authority: string;
					clientId: string;
					scope: string;
					redirectPath: string;
					postLogoutRedirectPath: string;
					silentRedirectPath: string;
				};
			};
		};
	}

	interface ObjectConstructor {
		keys<T>(obj: T): (keyof T)[];

		entries<TKey extends string, TValue>(obj: Record<TKey, TValue>): [TKey, TValue][];
	}
}

export {};
