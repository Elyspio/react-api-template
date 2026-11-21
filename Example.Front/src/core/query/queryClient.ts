import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { HttpValidationProblemDetails, ProblemDetails } from "@apis/backend";

declare module "@tanstack/react-query" {
	interface Register {
		/** `silent`: the component shows the error itself, no toast. */
		queryMeta: { silent?: boolean };
		mutationMeta: { silent?: boolean };
	}
}

const isProblem = (error: unknown): error is ProblemDetails & HttpValidationProblemDetails =>
	typeof error === "object" && error !== null && ("title" in error || "status" in error);

/**
 * Human readable message of an API failure: the ProblemDetails of the back (title, detail, field errors), or the network error.
 */
export function getErrorMessage(error: unknown) {
	if (isProblem(error)) {
		const fields = Object.values(error.errors ?? {}).flat();
		return [error.title, error.detail, ...fields].filter(Boolean).join(" — ") || `Request failed (${error.status})`;
	}
	if (error instanceof Error) return error.message;
	return "Unexpected error";
}

/**
 * Server state of the app. Every failed query or mutation is reported once with a toast, unless its meta says `silent`.
 */
export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (!query.meta?.silent) toast.error(getErrorMessage(error), { toastId: query.queryHash });
		},
	}),
	mutationCache: new MutationCache({
		onError: (error, _variables, _context, mutation) => {
			if (!mutation.meta?.silent) toast.error(getErrorMessage(error));
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			// 4xx are answers, not glitches: only retry network errors and 5xx
			retry: (failureCount, error) => failureCount < 2 && !(isProblem(error) && (error.status ?? 500) < 500),
		},
	},
});
