import * as colors from "@mui/material/colors";
import { createTheme, type Components, type Theme } from "@mui/material/styles";

const typography = {
	fontFamily: "'Space Grotesk', 'DM Sans', 'Segoe UI', sans-serif",
	h1: { fontWeight: 700, letterSpacing: "-0.04em" },
	h2: { fontWeight: 700, letterSpacing: "-0.03em" },
	h3: { fontWeight: 700, letterSpacing: "-0.02em" },
	h4: { fontWeight: 700, letterSpacing: "-0.02em" },
	h5: { fontWeight: 600, letterSpacing: "-0.01em" },
	h6: { fontWeight: 600, letterSpacing: "-0.01em" },
	button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
} as const;

// Overrides read the palette through the CSS variables: they follow the active color scheme without re-rendering
const components: Components<Theme> = {
	MuiPaper: {
		styleOverrides: {
			root: ({ theme }) => ({
				backgroundImage: "none !important",
				border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
				backdropFilter: "blur(9px)",
			}),
		},
	},
	MuiCard: {
		styleOverrides: {
			root: ({ theme }) => ({
				borderRadius: 20,
				border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
				backgroundColor: (theme.vars ?? theme).palette.background.paper,
			}),
		},
	},
	MuiDrawer: {
		styleOverrides: {
			paper: ({ theme }) => ({
				backgroundColor: (theme.vars ?? theme).palette.background.paper,
				borderLeft: `1px solid ${(theme.vars ?? theme).palette.divider}`,
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

/**
 * One theme, two color schemes (MUI CSS variables). The active scheme is chosen with useColorScheme() and persisted by MUI.
 */
export const theme = createTheme({
	cssVariables: { colorSchemeSelector: "class" },
	shape: {
		borderRadius: 16,
	},
	typography,
	colorSchemes: {
		dark: {
			palette: {
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
		},
		light: {
			palette: {
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
		},
	},
	components,
});

/** Color scheme forced by the URL (`?theme=light|dark`), applied once at startup. */
export const getUrlColorScheme = () => {
	const value = new URL(window.location.href).searchParams.get("theme");
	return value === "light" || value === "dark" ? value : undefined;
};
