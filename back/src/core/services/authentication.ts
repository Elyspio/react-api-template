import {Apis} from "../apis";
import {Log} from "../utils/decorators/logger";
import {getLogger} from "../utils/logger";

export class AuthenticationService {

	private static log = getLogger.service(AuthenticationService)

	@Log(AuthenticationService.log)
	public async isAuthenticated(token: string) {
		const {data} = await Apis.authentication.validToken({token});
		AuthenticationService.log.debug(`isAuthenticated token=${token} result=${data}`)
		return data === true;
	}
}
