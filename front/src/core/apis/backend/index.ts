import { injectable } from "inversify";
import axios from "axios";
import { TodoApi, TodoUserApi } from "./generated";

const instance = axios.create({
	withCredentials: true,
});

@injectable()
export class BackendApiClient {


	public readonly todo = {
		common:new TodoApi(undefined, window.config.endpoints.core, instance),
		user: new TodoUserApi(undefined, window.config.endpoints.core, instance),
	}
}
