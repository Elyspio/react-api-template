import {Controller, Get, Use, UseAuth, UseBefore} from "@tsed/common";
import {RequireLogin} from "../../middleware/authentication";
import {Returns} from "@tsed/schema";

@Controller("/example")
export class Example {

    @Get("/")
    @Returns(200, String).ContentType("text/plain")
    async get() {
        return "Content that does not require authentication"
    }


    @Get("/admin")
    @UseBefore(RequireLogin)
    @Returns(403)
    @Returns(200, String).ContentType("text/plain")
    async getAdmin() {
        return "Admin content"
    }
}
