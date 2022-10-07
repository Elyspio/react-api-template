import { BackendApiClient } from "../../apis/backend";
import { AuthenticationApiClient } from "../../apis/authentication";
import { Container } from "inversify";

export const addApis = (container: Container) => {
	container.bind(BackendApiClient).toSelf();
	container.bind<AuthenticationApiClient>(AuthenticationApiClient).toSelf();
};
