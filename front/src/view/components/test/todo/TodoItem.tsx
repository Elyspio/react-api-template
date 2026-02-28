import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import { Todo } from "@apis/backend/types";
import { Box, Chip, IconButton, Menu, MenuItem, Stack, Switch, Typography } from "@mui/material";
import { useMenu } from "@hooks/useMenu";
import { useAppDispatch } from "@store";
import { checkTodo, deleteTodo } from "@store/module/todo/todo.actions";
import { TodoState } from "@store/module/todo/todo.reducer";
import { type MouseEvent, useCallback } from "react";

// TodoItem Props
interface TodoItemProps {
	data: Todo;
	mode: keyof TodoState["todos"];
	isLast?: boolean;
}

export function TodoItem({ data, mode, isLast = false }: TodoItemProps) {
	const { open: menuOpen, closeMenu, onContextMenu, position } = useMenu();

	const dispatch = useAppDispatch();

	const onSwitchClick = useCallback(async () => {
		await dispatch(checkTodo({ mode, id: data.id }));
	}, [dispatch, mode, data.id]);

	const remove = useCallback(async () => {
		closeMenu();
		await dispatch(deleteTodo({ id: data.id, mode }));
	}, [dispatch, mode, data.id, closeMenu]);

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
					<Typography className={"TodoRow-meta"} color={"text.secondary"}>
						{mode === "public" ? (data.user ? `Author: ${data.user}` : "Shared item") : "Private item"}
					</Typography>
				</Box>

				<Stack direction={"row"} spacing={0.4} alignItems={"center"}>
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
