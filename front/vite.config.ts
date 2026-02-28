import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig } from "vite";

const config = getDefaultConfig({ basePath: __dirname });

export default defineConfig(config);
