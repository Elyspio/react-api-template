import {ExampleService} from "./example";
import {AuthenticationService} from "./authentication";

export const Services = {
	example: new ExampleService(),
	authentication: new AuthenticationService(),
}
