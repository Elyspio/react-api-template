import {BodyParams, Cookies, IMiddleware, Middleware, QueryParams, Req} from "@tsed/common";
import * as Express from "express"
import {authentication_token} from "../config/authentication";
import {Property, Returns} from "@tsed/schema";
import {Services} from "../core/services";
import {Unauthorized} from "@tsed/exceptions"

export class UnauthorizedModel {

    @Property()
    url: string

    @Property()
    message: string
}


@Middleware()
export class RequireLogin implements IMiddleware {
    @Returns(401).Of(UnauthorizedModel)
    public async use(@Req() req,  @QueryParams("token") token: string) {

        token ??= token

        try {
            await Services.authentication.isAuthenticated(token)
            return true
        } catch (e) {
            throw new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication");
        }
    }
}
