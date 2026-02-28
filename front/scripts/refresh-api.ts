import {generateApi} from "@elyspio/vite-eslint-config"
import path from "node:path"

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)

const apiUrl = "https://localhost:9851/swagger/v1/swagger.json"

const outputFolder = path.resolve("src", "core", "apis", "backend", "generated")

await generateApi(apiUrl, outputFolder, "Backend")