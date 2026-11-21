import Add from "@mui/icons-material/Add";
import DoneAllOutlined from "@mui/icons-material/DoneAllOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
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
	ToggleButton,
	Typography,
} from "@mui/material";
import { type Board, type BoardState, usePublicBoard, useUserBoard } from "@/core/todos/useBoard";
import { usePreferences } from "@store/preferences.store";
import { useModal } from "@hooks/useModal";
import { TodoItem } from "./TodoItem";
import { useAuth } from "react-oidc-context";
import { useCallback, useState } from "react";
import "./Todo.scss";

/** Shared backlog, visible to everyone. */
export function PublicBoard() {
	return <TodoBoard mode={"public"} board={usePublicBoard()} />;
}

/** Todos of the connected user. */
export function UserBoard() {
	return <TodoBoard mode={"user"} board={useUserBoard()} />;
}

type TodoBoardProps = {
	mode: Board;
	board: BoardState;
};

function TodoBoard({ mode, board }: TodoBoardProps) {
	const todos = board.todos.data ?? [];
	const hideCompleted = usePreferences((state) => state.hideCompleted[mode]);
	const toggleHideCompleted = usePreferences((state) => state.toggleHideCompleted);
	const visibleTodos = hideCompleted ? todos.filter((todo) => !todo.checked) : todos;

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

		// Errors (400 ProblemDetails) are toasted by the query client: keep the dialog open to fix the label
		await board.add(label.trim());
		setClose();
		setLabel("");
	}, [canAdd, board, label, setClose]);

	return (
		<Card className={"TodoPanel"} elevation={0}>
			<CardContent className={"TodoPanel-content"}>
				<Box className={"TodoPanel-header"}>
					<Box className={"TodoPanel-headline"}>
						<Typography variant={"overline"} className={"TodoPanel-kicker"}>
							{mode === "public" ? "Public board" : "Personal board"}
						</Typography>
						<Typography variant={"h5"}>{boardTitle}</Typography>
						<Typography
							sx={{
								color: "text.secondary",
							}}
						>
							{boardDescription}
						</Typography>
					</Box>

					<Stack className={"TodoPanel-metrics"} direction={{ xs: "row", md: "column" }} spacing={1}>
						<Chip icon={<PlaylistAddCheckRounded fontSize={"small"} />} label={`${todos.length} tasks`} variant={"outlined"} />
						<Chip
							icon={<DoneAllOutlined fontSize={"small"} />}
							label={`${completedCount} done`}
							variant={"outlined"}
							color={todos.length > 0 && completedCount === todos.length ? "success" : "default"}
						/>
						<ToggleButton
							value={"hide-completed"}
							size={"small"}
							selected={hideCompleted}
							onChange={() => toggleHideCompleted(mode)}
							aria-label={"Hide completed tasks"}
						>
							<VisibilityOffOutlined fontSize={"small"} sx={{ mr: 0.5 }} />
							Hide done
						</ToggleButton>
						{logged && (
							<Button variant={"contained"} startIcon={<Add />} onClick={setOpen}>
								Add task
							</Button>
						)}
					</Stack>
				</Box>

				<LinearProgress className={"TodoPanel-progress"} variant={board.todos.isFetching ? "indeterminate" : "determinate"} value={progress} />
				<Divider />

				<Box className={"TodoPanel-list"}>
					{visibleTodos.length === 0 ? (
						<Box className={"TodoPanel-empty"}>
							<Typography variant={"body1"}>{todos.length === 0 ? "No tasks yet." : "Every task is done."}</Typography>
							<Typography
								variant={"body2"}
								sx={{
									color: "text.secondary",
								}}
							>
								{logged ? "Use Add task to create your first item." : "Sign in to create tasks."}
							</Typography>
						</Box>
					) : (
						visibleTodos.map((row, index) => (
							<TodoItem key={row.id} mode={mode} data={row} isLast={index + 1 === visibleTodos.length} onToggle={board.toggle} onRemove={board.remove} />
						))
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
						onClick={() => {
							setClose();
							setLabel("");
						}}
					>
						Cancel
					</Button>
					<Button onClick={add} disabled={!canAdd || board.isAdding} variant={"contained"}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}
