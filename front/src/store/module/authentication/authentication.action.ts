import {createAsyncThunk} from "@reduxjs/toolkit";
import {Services} from "../../../core/services";
import store, {StoreState} from "../../index";
import {UserSettingsModelThemeEnum} from "../../../core/apis/authentication";
import {setTheme} from "../theme/theme.action";
import {AuthenticationEvents} from "../../../core/services/authentication";

export const login = createAsyncThunk("authentication/login", async (_, {getState, dispatch}) => {
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
				if (process.env.NODE_ENV === "production") page.onclose = clearInter
			})
			if (process.env.NODE_ENV === "production") page.close();
			const username = await authentication.getUsername();

			const [settings, credentials] = await Promise.all([
				authentication.getSettings(username),
				authentication.getCredentials(username),
			]);

			const theme = await authentication.getUserTheme(username);
			dispatch(setTheme(theme));
			Services.localStorage.settings.store(undefined, settings);

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
	AuthenticationEvents.emit("logout")
})

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	const newColorScheme = e.matches ? "dark" : "light";
	const {settings} = store.getState().authentication
	if (settings?.theme === UserSettingsModelThemeEnum.System) {
		store.dispatch(setTheme(newColorScheme));
	}
});


