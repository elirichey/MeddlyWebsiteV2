export interface Values {
	name: string;
	recordsEveryShow: boolean | null;
	website: string;
	contactName: string;
	contactPhone: string;
	contactEmail: string;
	isRepresentative: boolean | null;
	noEventsPerMonth: number;
	hiddenInput: string;
}

export interface OrgFormPayload {
	name: string;
	recordsEveryShow: boolean;
	website: string;
	contactName: string;
	contactPhone: string;
	contactEmail: string;
	isRepresentative: boolean;
	noEventsPerMonth: number;
	hiddenInput: string;
}

export function formatOrgFormPayload(values: Values) {
	const {
		name,
		contactName,
		contactPhone,
		contactEmail,
		noEventsPerMonth,
		website,
		recordsEveryShow,
		isRepresentative,
		hiddenInput,
	} = values;

	const payload: OrgFormPayload = {
		name: name.trim(),
		recordsEveryShow: typeof recordsEveryShow === 'boolean' ? recordsEveryShow : false,
		website: website.trim(),
		contactName: contactName.trim(),
		contactPhone: contactPhone.trim(),
		contactEmail: contactEmail.trim(),
		isRepresentative: typeof isRepresentative === 'boolean' ? isRepresentative : false,
		noEventsPerMonth: noEventsPerMonth,
		hiddenInput: hiddenInput.trim(),
	};

	return payload;
}
