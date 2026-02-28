import { TodoService } from "@services/todo.service";
import { Container } from "inversify";
import { BackendApi } from "@apis/backend";

export const addServices = (container: Container) => {
	container.bind(TodoService).toConstantValue(new TodoService(container.get(BackendApi)));
};
