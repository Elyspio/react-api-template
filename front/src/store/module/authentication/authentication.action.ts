import {createAsyncThunk} from "@reduxjs/toolkit";
import store, {StoreState} from "../../index";
import {UserSettingsModelThemeEnum} from "../../../core/apis/authentication";
import {setTheme} from "../theme/theme.action";
import {AuthenticationEvents, AuthenticationService} from "../../../core/services/authentication";
import {toast} from "react-toastify";
import {DependencyInjection} from "../../../core/services/di";
import {LocalStorageService} from "../../../core/services/localStorage";

const authentication = DependencyInjection.container.get<AuthenticationService>(DependencyInjection.keys.authentication)
const localStorages = {
	validation :  DependencyInjection.container.get<LocalStorageService>(DependencyInjection.keys.localStorage.validation),
	settings: DependencyInjection.container.get<LocalStorageService>(DependencyInjection.keys.localStorage.settings)
}


function waitForLogin(page: Window) {
	return new Promise<void>(async resolve => {
		let interval: NodeJS.Timer | undefined

		const clearInter = () => (interval !== undefined) && clearInterval(interval);
		page.onclose = clearInter

		const func = async () => {
			console.debug("Checking if user is logged from local storage")
			const isPresent = localStorages.validation.retrieve(undefined) !== undefined;
			if (isPresent) {
				localStorages.validation.remove()
				clearInter();
				resolve()
				return true;
			}

			return false;
		}

		if (!(await func())) {
			interval = setInterval(func, 500);
		}
	})

}

export const login = createAsyncThunk("authentication/login", async (_, {getState, dispatch}) => {
	const {logged, username, credentials, settings} = (getState() as StoreState).authentication
	if (!logged || username === undefined || credentials === undefined) {
		const toastId = toast.info("Connecting", {autoClose: false})
		const page = authentication.openLoginPage();
		if (page != null) {
			await waitForLogin(page);
			page.close();
			dispatch(getUserInfos());
			toast.update(toastId, {render: "Connected", autoClose: 5000, type: "success"})
		} else {
			throw new Error("An error occurred while opening the login page")
		}
	} else {
		console.info("You are already logged");
		return {username, credentials, settings}
	}
})


export const getUserInfos = createAsyncThunk("authentication/getUserInfos", async () => {
	const username = await authentication.getUsername();

	const [settings, credentials] = await Promise.all([
		authentication.getSettings(username),
		authentication.getCredentials(username),
	]);

	localStorages.settings.store(undefined, settings);

	AuthenticationEvents.emit("login", username);
	return {settings, credentials, username}
})

export const logout = createAsyncThunk("authentication/logout", async () => {
	await authentication.logout();
	AuthenticationEvents.emit("logout")
})

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	const newColorScheme = e.matches ? "dark" : "light";
	const {settings} = store.getState().authentication
	if (settings?.theme === UserSettingsModelThemeEnum.System) {
		store.dispatch(setTheme(newColorScheme));
	}
});


