import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import type { Todo } from "@apis/backend";
import { Box, Chip, IconButton, Menu, MenuItem, Stack, Switch, Typography } from "@mui/material";
import { useMenu } from "@hooks/useMenu";
import type { Board } from "@/core/todos/useBoard";
import { type MouseEvent, useCallback } from "react";

// TodoItem Props
interface TodoItemProps {
	data: Todo;
	mode: Board;
	isLast?: boolean;
	onToggle: (id: Todo["id"]) => void;
	onRemove: (id: Todo["id"]) => void;
}

export function TodoItem({ data, mode, isLast = false, onToggle, onRemove }: TodoItemProps) {
	const { open: menuOpen, closeMenu, onContextMenu, position } = useMenu();

	const onSwitchClick = useCallback(() => onToggle(data.id), [onToggle, data.id]);

	const remove = useCallback(() => {
		closeMenu();
		onRemove(data.id);
	}, [onRemove, data.id, closeMenu]);

	const openActions = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			onContextMenu(event);
		},
		[onContextMenu]
	);

	return (
		<>
			<Menu open={menuOpen} onClose={closeMenu} anchorReference="anchorPosition" anchorPosition={position}>
				<MenuItem sx={{ color: "error.main" }} onClick={remove}>
					Delete
				</MenuItem>
			</Menu>

			<Box className={`TodoRow${data.checked ? " TodoRow-checked" : ""}${isLast ? " TodoRow-last" : ""}`} onContextMenu={onContextMenu}>
				<Box className={"TodoRow-main"}>
					<Typography className={"TodoRow-label"}>{data.label}</Typography>
					<Typography
						className={"TodoRow-meta"}
						sx={{
							color: "text.secondary",
						}}
					>
						{mode === "public" ? (data.user ? `Author: ${data.user}` : "Shared item") : "Private item"}
					</Typography>
				</Box>

				<Stack
					direction={"row"}
					spacing={0.4}
					sx={{
						alignItems: "center",
					}}
				>
					{data.checked && <Chip size={"small"} color={"success"} label={"Done"} variant={"outlined"} />}
					<Switch onChange={onSwitchClick} checked={data.checked} />
					<IconButton size={"small"} onClick={openActions} aria-label={"Open task actions"}>
						<MoreHorizRounded fontSize={"small"} />
					</IconButton>
				</Stack>
			</Box>
		</>
	);
}
