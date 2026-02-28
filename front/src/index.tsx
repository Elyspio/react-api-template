import { CssBaseline, ThemeProvider } from "@mui/material";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store, { useAppSelector } from "./store";
import { themes } from "./config/theme";
import { AppRouter } from "./view/router/AppRouter";
import { oidcConfig } from "./core/auth/oidc";
import "./index.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./types/global"

const browserBaseName = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL?.replace(/\/$/, "");

function ThemedApp() {
	const current = useAppSelector((state) => state.theme.current);

	return (
		<ThemeProvider theme={themes[current]}>
			<CssBaseline />
			<BrowserRouter basename={browserBaseName}>
				<AppRouter />
			</BrowserRouter>
			<ToastContainer theme={current} position="top-right" />
		</ThemeProvider>
	);
}

function App() {
	return (
		<Provider store={store}>
			<AuthProvider {...oidcConfig}>
				<ThemedApp />
			</AuthProvider>
		</Provider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);
