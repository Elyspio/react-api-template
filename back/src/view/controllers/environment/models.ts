import * as process from "process";
import {AdditionalProperties, DateTime, Property} from "@tsed/schema";

@AdditionalProperties({type: "string"})
export class EnvironementsModel {
    [key: string]: string;
}
