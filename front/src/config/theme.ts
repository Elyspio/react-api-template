import {adaptV4Theme, createTheme, Theme} from "@material-ui/core";
import * as colors from "@material-ui/core/colors";

const darkTheme = createTheme(adaptV4Theme({
	palette: {
		mode: "dark",
		secondary: {
			...colors.grey,
			main: colors.grey["500"],

		},
		primary: {
			...colors.blue,
			main: colors.blue["400"],
		},
		background: {
			paper: "#1d1d1d",
			default: "#181818",
		}

	},
}));

const lightTheme = createTheme(adaptV4Theme({
	palette: {
		mode: "light",
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
export const getUrlTheme = (): Themes =>
	new URL(window.location.toString()).searchParams.get("theme")
	|| ("light" as any);

export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
