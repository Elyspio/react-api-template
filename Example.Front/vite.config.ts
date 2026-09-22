import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig } from "vite-plus";

const config = getDefaultConfig({ basePath: import.meta.dirname });

export default defineConfig(config);
