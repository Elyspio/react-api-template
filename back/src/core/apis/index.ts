import {AuthenticationApi} from "./authentication/generated";

export const Apis = {
	authentication: new AuthenticationApi(undefined, "https://elyspio.fr/authentication")
}
