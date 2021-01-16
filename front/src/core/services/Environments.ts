import {Apis} from "../apis";
import {getLoginPage} from "../../config/apis/authentication";
import {Api} from "../apis/api";
import axios, {AxiosRequestConfig} from "axios";

export class EnvironmentService {
    async getServerEnvironmentsVariables() {
        try {
            const a = await Apis.core.environments.environmentsGet()
            return a.data
        }
        catch (e) {
            return {"error": "Fetching is not authorized on this server."}
        }
    }
}
