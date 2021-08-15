import {createTheme, Theme} from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import {container, Services} from "../core/services";
import {UserSettingsModel} from "../core/apis/authentication";
import {DiServices} from "../core/services/di";
import {ThemeService} from "../core/services/theme";

const darkTheme = createTheme(({
	palette: {
		type: "dark",
		secondary: {
			...colors.grey,
			main: colors.grey["500"],

		},
		primary: {
			...colors.teal,
			main: colors.teal["A400"],
		},
		background: {
			paper: "#1d1d1d",
			default: "#181818",
		}

	},
}));

const lightTheme = createTheme(({
	palette: {
		type: "light",
		secondary: {
			...colors.grey,
			main: colors.grey["900"],
		},
		primary: {
			...colors.blue,
			main: colors.blue["400"],
		},
	},
}));

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";
const themeService = container.get<ThemeService>(DiServices.theme);
export const getUrlTheme = (): Themes => {
	let fromUrl = new URL(window.location.toString()).searchParams.get("theme");
	let fromSession = Services.localStorage.settings.retrieve<UserSettingsModel>()
	if (fromUrl) return fromUrl as Themes;
	if (fromSession?.theme) {
		if (fromSession.theme === "system") {
			return themeService.getThemeFromSystem();
		} else return fromSession.theme;
	}
	return "light";
};

export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
