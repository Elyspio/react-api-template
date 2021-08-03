import {Apis} from "../apis";
import {openPage} from "../utils/web";

export class AuthenticationService {
	public openLoginPage() {
		return openPage(window.config.loginPageUrl);
	}

	public getUsername() {
		return Apis.authentication.user.getCookieInfo("username").then(x => x.data);

	}

	public getToken() {
		return Apis.authentication.user.getCookieInfo("token").then(x => x.data);
	}

	public getCredentials(username: string) {
		return Apis.authentication.user.getUserKeys(username).then(x => x.data);
	}

	public getSettings(username: string) {
		return Apis.authentication.user.getUserSettings(username).then(x => x.data);
	}

	public isLogged() {
		return Apis.authentication.login.validToken().then(x => x.data);
	}

}
