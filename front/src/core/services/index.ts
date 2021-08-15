import {ExampleService} from "./example";
import {AuthenticationService} from "./authentication";
import {ThemeService} from "./theme";
import {LocalStorageService} from "./localStorage";
import {Container} from "inversify";
import {DiServices} from "./di";


export const container = new Container({defaultScope: "Singleton"})
container.bind<AuthenticationService>(DiServices.authentication).to(AuthenticationService)
container.bind<ThemeService>(DiServices.theme).to(ThemeService)


export const Services = {
	example: new ExampleService(),
	localStorage: {
		settings: new LocalStorageService("elyspio-authentication-settings")
	},
}
