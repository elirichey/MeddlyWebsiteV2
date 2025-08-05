interface LoginValues {
	email: string;
	password: string;
}

interface LoginPayload {
	email: string;
	password: string;
}

export function formatLoginFormPayload(values: LoginValues) {
	const { email, password } = values;

	const payload: LoginPayload = {
		email: email.trim(),
		password: password.trim(),
	};

	return payload;
}
