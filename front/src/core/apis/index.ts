import {ExampleApi} from "./backend"


export const Apis = {
	core: {
		example: new ExampleApi(undefined, window.config.endpoints.core)
	}
}




