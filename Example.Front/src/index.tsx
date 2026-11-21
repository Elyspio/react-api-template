import { CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@apis/backend";
import { getUrlColorScheme, theme } from "./config/theme";
import { oidcConfig } from "./core/auth/oidc";
import { queryClient } from "./core/query/queryClient";
import "./index.scss";
import "./types/global";
import { AppRouter } from "./view/router/AppRouter";

const browserBaseName = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL?.replace(/\/$/, "");

function Shell() {
	const { mode, systemMode, setMode } = useColorScheme();

	// ?theme=light|dark wins over the persisted choice
	useEffect(() => {
		const fromUrl = getUrlColorScheme();
		if (fromUrl) setMode(fromUrl);
	}, [setMode]);

	return (
		<>
			<BrowserRouter basename={browserBaseName}>
				<AppRouter />
			</BrowserRouter>
			<ToastContainer theme={mode === "system" ? systemMode : mode} position="top-right" />
		</>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider {...oidcConfig}>
				<ThemeProvider theme={theme} defaultMode="dark">
					<CssBaseline />
					<Shell />
				</ThemeProvider>
			</AuthProvider>
			<ReactQueryDevtools buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);
