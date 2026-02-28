import { DarkMode, LightMode, Login, Logout } from "@mui/icons-material";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "react-oidc-context";
import "./Application.scss";
import { Todos } from "./test/Todos";
import { useAppDispatch, useAppSelector } from "@store";
import { toggleTheme } from "@store/module/theme/theme.action";

function Application() {
	const dispatch = useAppDispatch();
	const auth = useAuth();
	const theme = useAppSelector((state) => state.theme.current);

	const getProfileValue = (key: string) => {
		const value = auth.user?.profile?.[key];
		return typeof value === "string" ? value : undefined;
	};

	const userName = getProfileValue("preferred_username") ?? getProfileValue("name") ?? getProfileValue("sub");

	return (
		<Box
			className={"Application"}
			sx={(activeTheme) => ({
				background:
					activeTheme.palette.mode === "dark"
						? "radial-gradient(circle at 6% 18%, rgba(0, 198, 255, 0.22), transparent 34%), radial-gradient(circle at 84% 12%, rgba(253, 186, 116, 0.18), transparent 36%), linear-gradient(145deg, #070d1a 0%, #0b1628 50%, #111f37 100%)"
						: "radial-gradient(circle at 8% 18%, rgba(14, 165, 233, 0.2), transparent 34%), radial-gradient(circle at 84% 12%, rgba(249, 115, 22, 0.16), transparent 36%), linear-gradient(145deg, #f0f7ff 0%, #e8f1fb 54%, #dde8f5 100%)",
			})}
		>
			<Container maxWidth={"xl"} className={"Application-shell"}>
				<Paper className={"Application-header"} elevation={0}>
					<Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" gap={2}>
						<Box>
							<Typography variant={"overline"} className={"Application-kicker"}>
								Team workspace
							</Typography>
							<Typography variant={"h3"}>Todo Studio</Typography>
							<Typography color={"text.secondary"}>
								{auth.isAuthenticated ? `Connected as ${userName ?? "user"}` : "Organize tasks with a clean and focused workspace."}
							</Typography>
						</Box>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={1} width={{ xs: "100%", md: "auto" }}>
							<Button
								variant={"outlined"}
								startIcon={theme === "dark" ? <LightMode /> : <DarkMode />}
								onClick={() => {
									dispatch(toggleTheme());
								}}
							>
								{theme === "dark" ? "Light mode" : "Dark mode"}
							</Button>
							{auth.isAuthenticated ? (
								<Button
									variant={"contained"}
									color={"secondary"}
									startIcon={<Logout />}
									onClick={() => {
										void auth.signoutRedirect();
									}}
								>
									Logout
								</Button>
							) : (
								<Button
									variant={"contained"}
									startIcon={<Login />}
									onClick={() => {
										void auth.signinRedirect();
									}}
								>
									Login
								</Button>
							)}
						</Stack>
					</Stack>
					<Chip className={"Application-actionsChip"} label={"2 quick actions"} color={"primary"} variant={"outlined"} />
				</Paper>

				<Todos />
			</Container>
		</Box>
	);
}

export default Application;
