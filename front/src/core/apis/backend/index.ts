import axios, { AxiosHeaders } from "axios";
import { getAccessToken } from "@/core/auth/token.store";
import { BackendApi as _BackendApi, Configuration } from "./generated";
import { Todo } from "./types";

type TodoClient = {
	getAll: () => Promise<Todo[]>;
	add: (label: string) => Promise<Todo>;
	check: (id: string) => Promise<Todo>;
	delete: (id: string) => Promise<void>;
};

export class BackendApi {
	public readonly todo: { common: TodoClient; user: TodoClient };

	constructor() {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.example.config.endpoints.core;
		const instance = axios.create({ withCredentials: true });

		instance.interceptors.request.use((value) => {
			const accessToken = getAccessToken();
			const headers = AxiosHeaders.from(value.headers);

			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);
			} else {
				headers.delete("Authorization");
			}

			value.headers = headers;
			return value;
		});

		const configuration = new Configuration({ basePath: apiBaseUrl });
		const todoApi = new _BackendApi(configuration, apiBaseUrl, instance);

		this.todo = {
			common: {
				getAll: async () => (await todoApi.getAll()).data as Todo[],
				add: async (label: string) => (await todoApi.add(label)).data as Todo,
				check: async (id: string) => (await todoApi.check(id)).data as Todo,
				delete: async (id: string) => {
					await todoApi._delete(id);
				},
			},
			user: {
				getAll: async () => (await todoApi.getAllForUser()).data as Todo[],
				add: async (label: string) => (await todoApi.addForUser(label)).data as Todo,
				check: async (id: string) => (await todoApi.checkForUser(id)).data as Todo,
				delete: async (id: string) => {
					await todoApi.deleteForUser(id);
				},
			},
		};
	}
}
