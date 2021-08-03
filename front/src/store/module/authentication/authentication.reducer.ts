import {createReducer} from "@reduxjs/toolkit";
import {login} from "./authentication.action";
import {CredentialsModel, UserSettingsModel} from "../../../core/apis/authentication";

export interface AuthenticationState {
	logged: boolean,
	username?: string
	credentials?: CredentialsModel,
	settings?: UserSettingsModel
}

const defaultState: AuthenticationState = {
	logged: false,
};

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(login.fulfilled, (state, action) => {
		state.logged = true;
		state.credentials = action.payload.credentials
		state.username = action.payload.username;
		state.settings = action.payload.settings
	});
});
