import { Chip, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import "./Test.scss";
import { useAuth } from "react-oidc-context";
import { Todo } from "./todo/Todo";

export const Todos = () => {
	const auth = useAuth();
	const logged = auth.isAuthenticated;
	const profile = auth.user?.profile;
	const userName = (typeof profile?.preferred_username === "string" && profile.preferred_username) || (typeof profile?.name === "string" && profile.name) || "you";

	return (
		<Container className={"Test"} maxWidth={"xl"}>
			<Stack className={"hero"} spacing={1.15}>
				<Typography variant={"overline"} className={"hero-kicker"}>
					Task board
				</Typography>
				<Typography variant={"h4"}>Keep priorities visible and moving</Typography>
				<Typography color={"text.secondary"} maxWidth={700}>
					Use the public board for shared items and your personal board for focused execution.
				</Typography>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
					<Chip label={"Public board enabled"} variant={"outlined"} />
					{logged && <Chip label={`Connected as ${userName}`} color={"primary"} variant={"outlined"} />}
				</Stack>
			</Stack>

			<Grid container spacing={{ xs: 2, md: 2.5 }} alignItems={"stretch"}>
				<Grid size={logged ? { xs: 12, xl: 6 } : 12}>
					<Todo mode={"public"} />
				</Grid>
				{logged && (
					<Grid size={{ xs: 12, xl: 6 }}>
						<Todo mode={"user"} />
					</Grid>
				)}
			</Grid>
		</Container>
	);
};
