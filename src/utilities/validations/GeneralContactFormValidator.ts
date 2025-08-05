interface ContactValues {
	name: string;
	email: string;
	subject: string;
	message: string;
}

interface ContactPayload {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export function formatContactFormPayload(values: ContactValues) {
	const { name, email, subject, message } = values;

	const payload: ContactPayload = {
		name: name.trim(),
		email: email.trim(),
		subject: subject.trim(),
		message: message.trim(),
	};

	return payload;
}
