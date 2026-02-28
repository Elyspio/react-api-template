import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { setAccessToken } from "@/core/auth/token.store";
import Application from "@/view/components/Application";

type LoadingStateProps = {
	message: string;
};

function LoadingState({ message }: LoadingStateProps) {
	return (
		<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} minHeight="100vh">
			<CircularProgress />
			<Typography>{message}</Typography>
		</Box>
	);
}

type ErrorStateProps = {
	message: string;
	onRetry?: () => void;
};

function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} minHeight="100vh">
			<Typography color="error">{message}</Typography>
			{onRetry && (
				<Button onClick={onRetry} variant="contained">
					Retry
				</Button>
			)}
		</Box>
	);
}

function SessionSynchronizer() {
	const auth = useAuth();

	useEffect(() => {
		setAccessToken(auth.isAuthenticated ? auth.user?.access_token : undefined);
	}, [auth.isAuthenticated, auth.user?.access_token]);

	return null;
}

function RequireAuth({ children }: PropsWithChildren) {
	const auth = useAuth();
	const location = useLocation();

	useEffect(() => {
		if (auth.isLoading || auth.activeNavigator || auth.isAuthenticated) {
			return;
		}

		void auth.signinRedirect({
			state: {
				returnTo: `${location.pathname}${location.search}${location.hash}`,
			},
		});
	}, [auth.isLoading, auth.activeNavigator, auth.isAuthenticated, auth.signinRedirect, location.pathname, location.search, location.hash]);

	if (auth.error) {
		return <ErrorState message={`Authentication error: ${auth.error.message}`} onRetry={() => void auth.signinRedirect()} />;
	}

	if (auth.isLoading || auth.activeNavigator) {
		return <LoadingState message="Authenticating..." />;
	}

	if (!auth.isAuthenticated) {
		return <LoadingState message="Redirecting to login..." />;
	}

	return <>{children}</>;
}

function getReturnToPath(userState: unknown) {
	if (typeof userState !== "object" || userState === null || !("returnTo" in userState)) {
		return "/";
	}

	const value = (userState as { returnTo?: unknown }).returnTo;
	return typeof value === "string" && value.startsWith("/") ? value : "/";
}

function AuthCallback() {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!auth.isAuthenticated) {
			return;
		}

		navigate(getReturnToPath(auth.user?.state), { replace: true });
	}, [auth.isAuthenticated, auth.user?.state, navigate]);

	if (auth.error) {
		return <ErrorState message={`Could not complete sign in: ${auth.error.message}`} onRetry={() => void auth.signinRedirect()} />;
	}

	return <LoadingState message="Completing sign in..." />;
}

function SilentCallback() {
	return <LoadingState message="Refreshing authentication session..." />;
}

export function AppRouter() {
	return (
		<>
			<SessionSynchronizer />
			<Routes>
				<Route path="/auth/callback" element={<AuthCallback />} />
				<Route path="/auth/silent-callback" element={<SilentCallback />} />
				<Route
					path="/*"
					element={
						<RequireAuth>
							<Application />
						</RequireAuth>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	);
}
