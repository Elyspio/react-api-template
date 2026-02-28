import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
	Box,
	Divider,
	Drawer as MuiDrawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
	type SxProps,
	type Theme,
} from "@mui/material";
import { type MouseEvent, type ReactNode, useMemo, useState } from "react";
import "./Drawer.scss";

export interface Action {
	text: ReactNode;
	icon: ReactNode;
	onClick?: (e: MouseEvent) => void;
}

type Props = {
	children: ReactNode[] | ReactNode;
	position: "left" | "right";
	actions?: Action[];
};

const drawerWidth = 248;
const baseWidth = 72;

const getActions = (actions: Action[], open: boolean) => {
	const groupedActions: Action[][] = [];
	let currentGroup: Action[] = [];

	for (const action of actions) {
		if (action.text === null) {
			if (currentGroup.length > 0) {
				groupedActions.push(currentGroup);
				currentGroup = [];
			}
			continue;
		}

		currentGroup.push(action);
	}

	if (currentGroup.length > 0) {
		groupedActions.push(currentGroup);
	}

	const actionComponents = (groupedActions.length > 0 ? groupedActions : [actions]).map((group, i) => (
		<Box key={i} mb={1}>
			<List className={"toolbar"}>
				{group.map((action, index) => (
					<Tooltip key={index} title={open ? "" : action.text} placement="left">
						<ListItemButton
							onClick={(e) => action.onClick && action.onClick(e)}
							sx={{
								mb: 0.35,
								minHeight: 46,
								px: open ? 1.25 : 1,
								borderRadius: 2.5,
								justifyContent: open ? "initial" : "center",
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 1.4 : 0,
									justifyContent: "center",
								}}
							>
								{action.icon}
							</ListItemIcon>
							<ListItemText
								primary={action.text}
								sx={{
									opacity: open ? 1 : 0,
									width: open ? "auto" : 0,
									overflow: "hidden",
									transition: (theme) =>
										theme.transitions.create(["opacity", "width"], {
											duration: theme.transitions.duration.shorter,
										}),
									"& .MuiTypography-root": {
										fontSize: "0.95rem",
										fontWeight: 500,
										whiteSpace: "nowrap",
									},
								}}
							/>
						</ListItemButton>
					</Tooltip>
				))}
			</List>
			{i + 1 < groupedActions.length && <Divider sx={{ mx: 0.5 }} />}
		</Box>
	));

	return <>{actionComponents}</>;
};

const getDrawerSx = (open: boolean): SxProps<Theme> => {
	const width = open ? drawerWidth : baseWidth;

	return {
		width,
		height: "100%",
		flexShrink: 0,
		whiteSpace: "nowrap",
		position: "relative",
		overflow: "hidden",
		transition: (theme) =>
			theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
			}),
		"& .MuiDrawer-paper": {
			width,
			height: "100%",
			position: "absolute",
			top: 0,
			right: 0,
			overflowX: "hidden",
			overflowY: "auto",
			boxSizing: "border-box",
			paddingInline: "0.5rem",
			paddingBlockEnd: "0.8rem",
			transition: (theme) =>
				theme.transitions.create("width", {
					easing: theme.transitions.easing.sharp,
					duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
				}),
		},
	};
};

const getMainSx = (): SxProps<Theme> => {
	return {
		height: "100%",
		minWidth: 0,
		flexGrow: 1,
		transition: (theme) =>
			theme.transitions.create("margin", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
	};
};

export function Drawer(props: Props) {
	const [open, setOpen] = useState(false);
	const drawerSx = useMemo(() => getDrawerSx(open), [open]);
	const mainSx = useMemo(() => getMainSx(), []);

	const handleDrawerOpen = (e: MouseEvent) => {
		setOpen(true);
		e.stopPropagation();
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const drawer = (
		<MuiDrawer anchor={props.position} variant="permanent" className={"toolbar"} sx={drawerSx}>
			<div onClick={handleDrawerClose} className={"drawer-btn"}>
				<IconButton onClick={open ? handleDrawerClose : handleDrawerOpen} size="medium">
					{open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				</IconButton>
			</div>
			<Divider />
			<div className="actions">{props.actions && getActions(props.actions, open)}</div>
		</MuiDrawer>
	);

	return (
		<div className={"Drawer"}>
			{props.position === "left" && drawer}
			<Box component="main" sx={mainSx}>
				{props.children}
			</Box>
			{props.position === "right" && drawer}
		</div>
	);
}
