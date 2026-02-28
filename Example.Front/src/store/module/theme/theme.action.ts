import { createActionGenerator } from "../../common/common.actions";
import type { Themes } from "@/config/theme";

const createAction = createActionGenerator("theme");

export const setTheme = createAction<Themes>("set");
export const toggleTheme = createAction("toggle");
