import {createAction as _createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Services} from "../../../core/services";
import store, {StoreState} from "../../index";
import {UserSettingsModel, UserSettingsModelThemeEnum} from "../../../core/apis/authentication";
import {setTheme} from "../theme/theme.action";
import {AuthenticationEvents} from "../../../core/services/authentication";

const createAction = <T>(name: string) => _createAction<T>(`authentication/${name}`);


export const login = createAsyncThunk("authentication/login", async (_, {getState}) => {
	const {authentication} = Services
	const {logged, username, credentials, settings} = (getState() as StoreState).authentication
	if (!logged || username === undefined || credentials === undefined) {
		const page = authentication.openLoginPage();
		if (page != null) {
			await new Promise<void>(async resolve => {
				let interval: NodeJS.Timer | undefined

				const clearInter = () => (interval !== undefined) && clearInterval(interval);

				const func = async () => {
					console.debug("Checking if user got logged")
					if (await authentication.isLogged()) {
						clearInter();
						resolve()
						return true;
					}

					return false;
				}
				if (!(await func())) {
					interval = setInterval(func, 500);
				}

				page.onclose = clearInter
			})
			page.close();
			const username = await authentication.getUsername();

			const [credentials, settings] = await Promise.all([
				authentication.getCredentials(username),
				authentication.getSettings(username)
			]);
			AuthenticationEvents.emit("login");
			return {username, credentials, settings}
		} else {
			throw new Error("An error occurred while opening the login page")
		}
	} else {
		console.info("You are already logged");
		return {username, credentials, settings}
	}
})

export const logout = createAsyncThunk("authentication/logout", async () => {
	await Services.authentication.logout();
})

export const setUserSettings = createAction<UserSettingsModel>("setUserSettings");

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	const newColorScheme = e.matches ? "dark" : "light";
	const {settings} = store.getState().authentication
	if (settings?.theme === UserSettingsModelThemeEnum.System) {
		store.dispatch(setTheme(newColorScheme));
	}
});


