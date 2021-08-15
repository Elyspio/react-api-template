import {createAsyncThunk} from "@reduxjs/toolkit";
import {container, Services} from "../../../core/services";
import store, {StoreState} from "../../index";
import {UserSettingsModelThemeEnum} from "../../../core/apis/authentication";
import {setTheme} from "../theme/theme.action";
import {AuthenticationEvents, AuthenticationService} from "../../../core/services/authentication";
import {DiServices} from "../../../core/services/di";
import {toast} from "react-toastify";

const authentication = container.get<AuthenticationService>(DiServices.authentication)


function waitForLogin(page: Window) {
	return new Promise<void>(async resolve => {
		let interval: NodeJS.Timer | undefined

		const clearInter = () => (interval !== undefined) && clearInterval(interval);
		page.onclose = clearInter

		const func = async () => {
			console.debug("Checking if user is logged from local storage")
			const isPresent = Services.localStorage.validation.retrieve(undefined) !== undefined;
			if (isPresent) {
				Services.localStorage.validation.remove()
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

	Services.localStorage.settings.store(undefined, settings);

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


