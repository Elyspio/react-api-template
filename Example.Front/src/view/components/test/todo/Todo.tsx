import Add from "@mui/icons-material/Add";
import DoneAllOutlined from "@mui/icons-material/DoneAllOutlined";
import PlaylistAddCheckRounded from "@mui/icons-material/PlaylistAddCheckRounded";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	LinearProgress,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { TodoState } from "@store/module/todo/todo.reducer";
import { useAppDispatch, useAppSelector } from "@store";
import { addTodo, getTodos } from "@store/module/todo/todo.actions";
import { useModal } from "@hooks/useModal";
import { TodoItem } from "./TodoItem";
import { useAuth } from "react-oidc-context";
import { useCallback, useEffect, useState } from "react";
import "./Todo.scss";

type TodoProps = {
	mode: keyof TodoState["todos"];
};

export function Todo({ mode }: TodoProps) {
	const todos = useAppSelector((state) => [...state.todo.todos[mode]].sort((a, b) => a.label.localeCompare(b.label)));

	const dispatch = useAppDispatch();
	const auth = useAuth();
	const logged = auth.isAuthenticated;

	const [label, setLabel] = useState("");

	const { open, setOpen, setClose } = useModal(false);
	const boardTitle = mode === "public" ? "Shared backlog" : "My focus list";
	const boardDescription = mode === "public" ? "Coordinate collective priorities visible to everyone." : "Keep personal objectives on track and ready to execute.";
	const completedCount = todos.filter((todo) => todo.checked).length;
	const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;
	const canAdd = label.trim().length > 0;

	const add = useCallback(async () => {
		if (!canAdd) {
			return;
		}

		setClose();
		await dispatch(addTodo({ label: label.trim(), mode }));
		setLabel("");
	}, [canAdd, dispatch, mode, label, setClose]);

	useEffect(() => {
		void dispatch(getTodos(mode));
	}, [dispatch, mode]);

	return (
		<Card className={"TodoPanel"} elevation={0}>
			<CardContent className={"TodoPanel-content"}>
				<Box className={"TodoPanel-header"}>
					<Box className={"TodoPanel-headline"}>
						<Typography variant={"overline"} className={"TodoPanel-kicker"}>
							{mode === "public" ? "Public board" : "Personal board"}
						</Typography>
						<Typography variant={"h5"}>{boardTitle}</Typography>
						<Typography color={"text.secondary"}>{boardDescription}</Typography>
					</Box>

					<Stack className={"TodoPanel-metrics"} direction={{ xs: "row", md: "column" }} spacing={1}>
						<Chip icon={<PlaylistAddCheckRounded fontSize={"small"} />} label={`${todos.length} tasks`} variant={"outlined"} />
						<Chip
							icon={<DoneAllOutlined fontSize={"small"} />}
							label={`${completedCount} done`}
							variant={"outlined"}
							color={todos.length > 0 && completedCount === todos.length ? "success" : "default"}
						/>
						{logged && (
							<Button variant={"contained"} startIcon={<Add />} onClick={setOpen}>
								Add task
							</Button>
						)}
					</Stack>
				</Box>

				<LinearProgress className={"TodoPanel-progress"} variant={"determinate"} value={progress} />
				<Divider />

				<Box className={"TodoPanel-list"}>
					{todos.length === 0 ? (
						<Box className={"TodoPanel-empty"}>
							<Typography variant={"body1"}>No tasks yet.</Typography>
							<Typography variant={"body2"} color={"text.secondary"}>
								{logged ? "Use Add task to create your first item." : "Sign in to create tasks."}
							</Typography>
						</Box>
					) : (
						todos.map((row, index) => <TodoItem key={row.id} mode={mode} data={row} isLast={index + 1 === todos.length} />)
					)}
				</Box>
			</CardContent>

			<Dialog open={open} onClose={setClose}>
				<DialogTitle>Add a todo</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter a clear label for the new task</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="todo-label"
						label="Label"
						fullWidth
						variant="filled"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && canAdd) {
								void add();
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={(e) => {
							setClose();
							setLabel("");
						}}
					>
						Cancel
					</Button>
					<Button onClick={add} disabled={!canAdd} variant={"contained"}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}
