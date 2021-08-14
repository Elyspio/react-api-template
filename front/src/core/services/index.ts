import {ExampleService} from "./example";
import {AuthenticationService} from "./authentication";
import {ThemeService} from "./theme";
import {LocalStorageService} from "./localStorage";

export const Services = {
	example: new ExampleService(),
	authentication: new AuthenticationService(),
	theme: new ThemeService(),
	localStorage: {
		settings: new LocalStorageService("elyspio-authentication-settings")
	},
}
