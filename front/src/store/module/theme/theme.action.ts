import {createAction as _createAction} from "@reduxjs/toolkit";
import {AuthenticationEvents, AuthenticationService} from "../../../core/services/authentication";
import {container} from "../../../core/services";
import store from "../../index";
import {DiServices} from "../../../core/services/di";

const createAction = <T>(name: string) => _createAction<T>(`theme/${name}`);

export const setTheme = createAction<"dark" | "light">("set");
export const toggleTheme = createAction<void>("toggle");

const authentication = container.get<AuthenticationService>(DiServices.authentication)


AuthenticationEvents.on("login", async (username) => {
	const theme = await authentication.getUserTheme(username);
	store.dispatch(setTheme(theme));
})