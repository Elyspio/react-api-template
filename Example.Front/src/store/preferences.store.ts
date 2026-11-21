import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Board } from "@/core/todos/useBoard";

/**
 * Client state shared across the app (Zustand), persisted in localStorage.
 * Server state (todos, joke) lives in TanStack Query, the color scheme in MUI (useColorScheme).
 */
type PreferencesState = {
	/** Hide the checked todos of a board */
	hideCompleted: Record<Board, boolean>;
	toggleHideCompleted: (board: Board) => void;
};

export const usePreferences = create<PreferencesState>()(
	persist(
		(set) => ({
			hideCompleted: { public: false, user: false },
			toggleHideCompleted: (board) => set((state) => ({ hideCompleted: { ...state.hideCompleted, [board]: !state.hideCompleted[board] } })),
		}),
		{
			name: "example.preferences",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ hideCompleted: state.hideCompleted }),
		}
	)
);
