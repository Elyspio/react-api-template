import type { TodoBase } from "./generated/models/todo-base";

export type Todo = TodoBase & {
	id: string;
};
