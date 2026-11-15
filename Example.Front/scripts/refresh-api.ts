import { generateApi } from "@elyspio/vite-eslint-config";
import path from "node:path";

const apiUrl = "https://localhost:9851/swagger/v1/swagger.json";

const outputFolder = path.resolve(import.meta.dirname, "..", "src", "core", "apis", "backend", "generated");

await generateApi(apiUrl, outputFolder, "Backend");
