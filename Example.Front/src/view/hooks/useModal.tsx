import React from "react";

/**
 *
 * @param defaultState initial state of modal (open or not)
 */
export function useModal(defaultState: boolean) {
	const [state, setOpen] = React.useState<boolean>(defaultState);

	const open = () => {
		if (!state) {
			setOpen(true);
		}
	};
	const close = () => {
		if (state) {
			setOpen(false);
		}
	};

	return {
		open: state,
		setOpen: open,
		setClose: close,
	};
}
