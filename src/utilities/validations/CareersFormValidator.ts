interface CareersValues {
	name: string;
	email: string;
	subject: string;
	comments: string;
}

interface CareersPayload {
	name: string;
	email: string;
	subject: string;
	comments: string;
}

export function formatCareersFormPayload(values: CareersValues) {
	const { name, email, subject, comments } = values;

	const payload: CareersPayload = {
		name: name.trim(),
		email: email.trim(),
		subject: subject.trim(),
		comments: comments.trim(),
	};

	return payload;
}
