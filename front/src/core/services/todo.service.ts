import { BackendApi } from "@apis/backend";
import { Todo } from "@apis/backend/types";

interface ITodoServiceSub {
	get: () => Promise<Todo[]>;
	add: (label: string) => Promise<Todo>;
	remove: (id: Todo["id"]) => Promise<void>;
	check: (id: Todo["id"]) => Promise<Todo>;
}

export class TodoService {
	constructor(private readonly backendApiClient: BackendApi) {}

	public common: ITodoServiceSub = {
		get: async () => {
			return this.backendApiClient.todo.common.getAll();
		},
		add: async (label) => {
			return this.backendApiClient.todo.common.add(label);
		},
		check: async (id) => {
			return this.backendApiClient.todo.common.check(id);
		},
		remove: async (id) => {
			return this.backendApiClient.todo.common.delete(id);
		},
	};

	public user: ITodoServiceSub = {
		get: async () => {
			return this.backendApiClient.todo.user.getAll();
		},
		add: async (label) => {
			return this.backendApiClient.todo.user.add(label);
		},
		check: async (id) => {
			return this.backendApiClient.todo.user.check(id);
		},
		remove: async (id) => {
			return this.backendApiClient.todo.user.delete(id);
		},
	};
}
