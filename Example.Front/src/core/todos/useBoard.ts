import { type UseMutationResult, type UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addTodoMutation,
	addUserTodoMutation,
	deleteTodoMutation,
	deleteUserTodoMutation,
	getTodosOptions,
	getTodosQueryKey,
	getUserTodosOptions,
	getUserTodosQueryKey,
	toggleTodoMutation,
	toggleUserTodoMutation,
	type Todo,
} from "@apis/backend";

/** `public`: shared board, `user`: board of the connected user. */
export type Board = "public" | "user";

/** What a board component needs, whatever the endpoints behind it. */
export type BoardState = {
	todos: UseQueryResult<Todo[], unknown>;
	add: (label: string) => Promise<unknown>;
	toggle: (id: Todo["id"]) => void;
	remove: (id: Todo["id"]) => void;
	isAdding: boolean;
};

const byLabel = (a: Todo, b: Todo) => a.label.localeCompare(b.label);
const select = (data: Todo[]) => data.toSorted(byLabel);

type AddVariables = { body: { label: string } };
type IdVariables = { path: { id: Todo["id"] } };

function toBoardState(
	todos: UseQueryResult<Todo[], unknown>,
	add: UseMutationResult<Todo, unknown, AddVariables>,
	toggle: UseMutationResult<Todo, unknown, IdVariables>,
	remove: UseMutationResult<unknown, unknown, IdVariables>
): BoardState {
	return {
		todos,
		add: (label) => add.mutateAsync({ body: { label } }),
		toggle: (id) => toggle.mutate({ path: { id } }),
		remove: (id) => remove.mutate({ path: { id } }),
		isAdding: add.isPending,
	};
}

/**
 * Public board: generated query and mutation options (TanStack Query); each mutation refetches the board when it settles.
 */
export function usePublicBoard(): BoardState {
	const queryClient = useQueryClient();
	const onSettled = () => queryClient.invalidateQueries({ queryKey: getTodosQueryKey() });

	return toBoardState(
		useQuery({ ...getTodosOptions(), select }),
		useMutation({ ...addTodoMutation(), onSettled }),
		useMutation({ ...toggleTodoMutation(), onSettled }),
		useMutation({ ...deleteTodoMutation(), onSettled })
	);
}

/**
 * Board of the connected user (the access token is added by the API client).
 */
export function useUserBoard(): BoardState {
	const queryClient = useQueryClient();
	const onSettled = () => queryClient.invalidateQueries({ queryKey: getUserTodosQueryKey() });

	return toBoardState(
		useQuery({ ...getUserTodosOptions(), select }),
		useMutation({ ...addUserTodoMutation(), onSettled }),
		useMutation({ ...toggleUserTodoMutation(), onSettled }),
		useMutation({ ...deleteUserTodoMutation(), onSettled })
	);
}
