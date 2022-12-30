import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { silentLogin } from "../module/authentication/authentication.async.action";
import { ExtraArgument } from "../index";

export const initApp = createAsyncThunk("initApp", (_, { dispatch }) => {
	dispatch(silentLogin());
});

type Constructor<T> = new (...args: any[]) => T;

export function getService<T>(service: Constructor<T>, extra): T {
	const { container } = extra as ExtraArgument;
	return container.get(service);
}

export function createActionBase(base: string) {
	return <T = void>(suffix: string) => createAction<T>(`${base}/${suffix}`);
}
