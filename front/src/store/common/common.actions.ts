import { AsyncThunkPayloadCreator, createAction as _createAction, createAsyncThunk as _createAsyncThunk } from "@reduxjs/toolkit";
import { ExtraArgument } from "@store";

type Constructor<T> = new (...args: any[]) => T;

export function getService<T>(service: Constructor<T>, extra: ExtraArgument): T {
	const { container } = extra;
	return container.get(service);
}

export function createAsyncActionGenerator(prefix: string) {
	return function createAsyncThunk<Returned, ThunkArg = void>(suffix: string, payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { extra: ExtraArgument }>) {
		return _createAsyncThunk<Returned, ThunkArg, { extra: ExtraArgument }>(`${prefix}/${suffix}`, payloadCreator);
	};
}

export function createActionGenerator(prefix: string) {
	return <T = void>(suffix: string) => _createAction<T>(`${prefix}/${suffix}`);
}
