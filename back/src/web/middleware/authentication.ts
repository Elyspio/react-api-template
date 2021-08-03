import {IMiddleware, Middleware, QueryParams, Req} from "@tsed/common";
import {ArrayOf, Integer, Property, Returns} from "@tsed/schema";
import {Unauthorized} from "@tsed/exceptions"
import {Services} from "../../core/services";
import {Request} from "express"
import {authorization_cookie_token} from "../../config/authentication";
import {getLogger} from "../../core/utils/logger";
import {Helper} from "../../core/utils/helper";
import isDev = Helper.isDev;

export class UnauthorizedModel {
	@ArrayOf(String)
	errors: []
	@Property()
	message: "You must be logged to access to this resource see https://elyspio.fr/authentication"
	@Property()
	name: "UNAUTHORIZED"
	@Integer()
	status: 401
}


@Middleware()
export class RequireLogin implements IMiddleware {

	private static log = getLogger.middleware(RequireLogin)

	@Returns(401, UnauthorizedModel)
	public async use(@Req() {headers, cookies}: Request, @QueryParams("token") token?: string) {

		// Sanitize token param
		if (token === "") token = undefined;

		if (!isDev()) {
			try {

				const cookieAuth = cookies[authorization_cookie_token]
				const headerToken = headers[authorization_cookie_token];

				RequireLogin.log.info("RequireLogin", {
					cookieAuth,
					headerToken,
					uriToken: token,
				})

				token = token ?? cookieAuth;
				token = token ?? headerToken as string


				if (await Services.authentication.isAuthenticated(token)) {
					return true
				} else throw ""
			} catch (e) {
				throw new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication");
			}
		}
	}
}
