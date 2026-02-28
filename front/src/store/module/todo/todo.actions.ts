import { TodoService } from "@services/todo.service";
import { TodoState } from "./todo.reducer";
import { Todo } from "@apis/backend/types";
import { createAsyncActionGenerator, getService } from "../../common/common.actions";

const createAsyncThunk = createAsyncActionGenerator("todo");

export const getTodos = createAsyncThunk("getTodo", async (mode: keyof TodoState["todos"], { extra }) => {
	const service = getService(TodoService, extra);
	const fn = mode === "user" ? service.user.get : service.common.get;
	return fn();
});

type AddTodoProps = { mode: keyof TodoState["todos"]; label: string };
export const addTodo = createAsyncThunk("addTodo", async ({ mode, label }: AddTodoProps, { extra }) => {
	const service = getService(TodoService, extra);
	const fn = mode === "user" ? service.user.add : service.common.add;
	return fn(label);
});

type DeleteTodoProps = { mode: keyof TodoState["todos"]; id: Todo["id"] };
export const deleteTodo = createAsyncThunk("deleteTodo", async ({ mode, id }: DeleteTodoProps, { extra }) => {
	const service = getService(TodoService, extra);
	const fn = mode === "user" ? service.user.remove : service.common.remove;
	return fn(id);
});

export const checkTodo = createAsyncThunk("checkTodo", async ({ mode, id }: DeleteTodoProps, { extra }) => {
	const service = getService(TodoService, extra);
	const fn = mode === "user" ? service.user.check : service.common.check;
	return fn(id);
});
