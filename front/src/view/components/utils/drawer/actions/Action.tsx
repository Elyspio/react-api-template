import { type MouseEvent, type ReactNode } from "react";
import { IconButton, Typography } from "@mui/material";

export type ActionComponentProps = {
	icon: ReactNode;
	children?: ReactNode;
	className?: string;
	onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export const ActionComponent = ({ children, icon, onClick, className }: ActionComponentProps) => {
	return (
		<div className={"Action " + (className ?? "")} onClick={onClick}>
			<div className={"icon"}>
				<IconButton size="medium">{icon}</IconButton>
			</div>
			<div className={"description"}>{children}</div>
		</div>
	);
};

export type ActionDescriptionProps = { children: ReactNode };
export const ActionDescription = (props: ActionDescriptionProps) => <Typography className={"ActionDescription"}>{props.children}</Typography>;
