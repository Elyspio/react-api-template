import {getApiPath} from "../../config/apis/api";
import {ExampleApi} from "./back"
export const Apis = {
    core: {
        example: new ExampleApi({basePath: getApiPath()})
    }
}
