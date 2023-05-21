import { getDefaultConfig } from "@elyspio/vite-eslint-config/vite/vite.config";
import { defineConfig } from "vite";

const config = getDefaultConfig(__dirname);

export default defineConfig({ ...config, base: "/react-api-template" });
