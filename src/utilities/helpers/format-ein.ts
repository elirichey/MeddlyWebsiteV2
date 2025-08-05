export const isNumericInput = (event: KeyboardEvent) => {
	const key = event.keyCode;
	return (
		(key >= 48 && key <= 57) || // Allow number line
		(key >= 96 && key <= 105) // Allow number pad
	);
};

export const isModifierKey = (event: KeyboardEvent) => {
	const key = event.keyCode;
	return (
		event.shiftKey === true ||
		key === 35 ||
		key === 36 || // Allow Shift, Home, End
		key === 8 ||
		key === 9 ||
		key === 13 ||
		key === 46 || // Allow Backspace, Tab, Enter, Delete
		(key > 36 && key < 41) || // Allow left, up, right, down
		// Allow Ctrl/Command + A,C,V,X,Z
		((event.ctrlKey === true || event.metaKey === true) &&
			(key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
	);
};

export const enforceFormat = (event: KeyboardEvent | any) => {
	// Input must be of a valid number format or a modifier key, and not longer than ten digits
	if (!isNumericInput(event) && !isModifierKey(event)) event.preventDefault();
};

export const formatToEIN = (e: any) => {
	if (isModifierKey(e)) return;
	const input = e.target.value.replace(/\D/g, '').substring(0, 9); // EINs are nine digits
	const firstPart = input.substring(0, 2);
	const secondPart = input.substring(2, 9);

	if (input.length > 2) e.target.value = `${firstPart}-${secondPart}`;
	else if (input.length > 0) e.target.value = `${firstPart}`;
};
