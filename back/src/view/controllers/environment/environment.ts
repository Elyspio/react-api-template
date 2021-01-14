import {Controller, Get, UseBefore} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {RequireExposedEnvironment} from "../../middleware/environment";
import {EnvironementsModel} from "./models"

@Controller("/environments")
export class Example {
    @Get("/")
    @UseBefore(RequireExposedEnvironment)
    @Returns(403)
    @Returns(200, EnvironementsModel).ContentType("application/json")
    async getAdmin() {
        return process.env;
    }
}
