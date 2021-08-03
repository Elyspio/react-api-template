import {AuthenticationService} from "./authentication";
import {StorageService} from "./storage";

export const Services = {
	authentication: new AuthenticationService(),
	storage: new StorageService()
}
