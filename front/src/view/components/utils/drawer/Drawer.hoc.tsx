import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Drawer, type Action } from "./Drawer";

export type WithDrawerProps = {
	component: ReactNode;
	actions: Action[];
	title: string;
	subtitle?: string;
};

export function withDrawer({ component, title, subtitle, actions }: WithDrawerProps) {
	return (
		<Box className={"Drawer-hoc"}>
			<Box className={"header-wrapper"}>
				<Paper className={"header"} elevation={0}>
					<Stack className={"header-content"} direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
						<Box>
							<Typography variant={"overline"} className={"header-kicker"}>
								Team workspace
							</Typography>
							<Typography variant={"h3"}>{title}</Typography>
							{subtitle && (
								<Typography variant={"body1"} color={"text.secondary"}>
									{subtitle}
								</Typography>
							)}
						</Box>
						<Chip label={`${actions.length} quick actions`} color={"primary"} variant={"outlined"} />
					</Stack>
				</Paper>
			</Box>

			<Drawer position={"right"} actions={actions}>
				<div className="content">{component}</div>
			</Drawer>
		</Box>
	);
}

export function createDrawerAction(name: string, config: Omit<Action, "text">): Action {
	return {
		text: name,
		...config,
	};
}
