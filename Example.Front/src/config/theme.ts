import * as colors from "@mui/material/colors";
import { Components, createTheme, type Theme } from "@mui/material/styles";
import { CssVarsTheme } from "@mui/material";

const typography = {
	fontFamily: "'Space Grotesk', 'DM Sans', 'Segoe UI', sans-serif",
	h1: { fontWeight: 700, letterSpacing: "-0.04em" },
	h2: { fontWeight: 700, letterSpacing: "-0.03em" },
	h3: { fontWeight: 700, letterSpacing: "-0.02em" },
	h4: { fontWeight: 700, letterSpacing: "-0.02em" },
	h5: { fontWeight: 600, letterSpacing: "-0.01em" },
	h6: { fontWeight: 600, letterSpacing: "-0.01em" },
	button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
};

const components: Components<Omit<Theme, "palette" | "components"> & CssVarsTheme> = {
	MuiPaper: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				backgroundImage: "none !important",
				border: `1px solid ${theme.palette.divider}`,
				backdropFilter: "blur(9px)",
			}),
		},
	},
	MuiCard: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				borderRadius: 20,
				border: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper,
			}),
		},
	},
	MuiDrawer: {
		styleOverrides: {
			paper: ({ theme }: { theme: Theme }) => ({
				backgroundColor: theme.palette.background.paper,
				borderLeft: `1px solid ${theme.palette.divider}`,
			}),
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				borderRadius: 999,
				paddingInline: "1.1rem",
			},
		},
	},
	MuiChip: {
		styleOverrides: {
			root: {
				borderRadius: 999,
			},
		},
	},
	MuiDialog: {
		styleOverrides: {
			paper: {
				borderRadius: 18,
			},
		},
	},
};

const darkTheme = createTheme({
	shape: {
		borderRadius: 16,
	},
	typography,
	palette: {
		mode: "dark",
		primary: {
			...colors.cyan,
			main: colors.cyan["300"],
		},
		secondary: {
			...colors.orange,
			main: colors.orange["300"],
		},
		background: {
			paper: "#0f1a2e",
			default: "#070d1a",
		},
		text: {
			primary: "#edf4ff",
			secondary: "rgba(210, 228, 255, 0.75)",
		},
		divider: "rgba(152, 180, 223, 0.23)",
	},
	components,
});

const lightTheme = createTheme({
	shape: {
		borderRadius: 16,
	},
	typography,
	palette: {
		mode: "light",
		primary: {
			...colors.teal,
			main: colors.teal["700"],
		},
		secondary: {
			...colors.orange,
			main: colors.orange["700"],
		},
		background: {
			paper: "#ffffff",
			default: "#eaf1f8",
		},
		text: {
			primary: "#0f243d",
			secondary: "rgba(15, 36, 61, 0.72)",
		},
		divider: "rgba(19, 58, 102, 0.14)",
	},
	components,
});

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";

export const getUrlTheme = (): Themes => {
	const theme = new URL(window.location.toString()).searchParams.get("theme");
	return theme === "light" || theme === "dark" ? theme : "dark";
};

export const getCurrentTheme = (theme: Themes): Theme => themes[theme];
