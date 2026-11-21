import { generateHeyApi } from "@elyspio/vite-eslint-config";
import path from "node:path";

// OpenAPI document of the API: first argument, OPENAPI_URL, or the API started by the AppHost
const input = process.argv[2] ?? process.env.OPENAPI_URL ?? "https://localhost:4000/openapi/v1.json";

const output = path.resolve(import.meta.dirname, "..", "src", "core", "apis", "backend", "generated");

// Typed SDK (fetch client) + TanStack Query options, query keys and mutations
await generateHeyApi({ input, output });
