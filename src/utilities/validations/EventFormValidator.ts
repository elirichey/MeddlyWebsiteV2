import { getCookie } from 'cookies-next';

export interface EventOnCreate {
	title: string;
	status: string;
	type: string;
	venueId: string;
	managerId: string;
	coverImg?: string;
	date: string;
	time: string;
}

export interface EventOnCreatePayload {
	title: string;
	status: string;
	type: string;
	venueId: string;
	managerId: string;
	orgOwnerId: string;
	dateTime: number;
	coverImg?: string;
}

export interface EventInterface {
	id: string;
	title: string;
	status: string;
	type: string;
	dateTime: number;
	date?: string;
	time?: string;
	venueId: string;
	managerId?: string;
	orgOwnerId: string;
	coverImg?: string;
	updated?: string;
	created?: string;
}

export function validateEventFields(values: EventOnCreate) {
	const { title, status, type, venueId, managerId, date, time } = values;
	const payload: any = {};
	const errors: Array<any> = [];

	if (title && title.trim() !== '') payload.title = title;
	else errors.push({ error: 'Please add Title' });
	if (status && status.trim() !== '') payload.status = status;
	else errors.push({ error: 'Please add Status' });
	if (type && type.trim() !== '') payload.type = type;
	else errors.push({ error: 'Please add Type' });
	if (venueId && venueId.trim() !== '') payload.venueId = venueId;
	else errors.push({ error: 'Please add Venue' });
	if (managerId && managerId.trim() !== '') payload.managerId = managerId;
	else errors.push({ error: 'Please add Manager' });
	if (date && date.trim() !== '') payload.date = date;
	else errors.push({ error: 'Please add Date' });
	if (time && time.trim() !== '') payload.time = time;
	else errors.push({ error: 'Please add Time' });

	if (errors.length > 0) return { status: 400, errors };
	return { status: 200, payload };
}

export function formatCreateEventPayload(values: EventOnCreate): EventOnCreatePayload {
	const { title, status, type, venueId, managerId, date, time, coverImg } = values;

	const roleCookie: any = getCookie('role');
	const role = roleCookie ? JSON.parse(roleCookie) : null;
	const newDateTime = new Date();
	const timeArray: any = time.split(':');
	const dateArray: any = date.split('-');
	newDateTime.setHours(timeArray[0]);
	newDateTime.setMinutes(timeArray[1]);
	newDateTime.setFullYear(dateArray[0]);
	newDateTime.setMonth(dateArray[1] - 1);
	newDateTime.setDate(dateArray[2]);
	const resTime = newDateTime.getTime();

	const payload: EventOnCreatePayload = {
		title: title.trim(),
		status: status.trim(),
		type: type.trim(),
		venueId: venueId.trim(),
		managerId: managerId.trim(),
		orgOwnerId: role.organization.id,
		dateTime: resTime,
		coverImg,
	};

	return payload;
}

export function formatEditEventPayload(values: any): Partial<EventInterface> {
	const { title, status, type, venueId, managerId, date, time } = values;

	const newDateTime = new Date();
	const timeArray: any = time.split(':');
	const dateArray: any = date.split('-');
	newDateTime.setHours(timeArray[0]);
	newDateTime.setMinutes(timeArray[1]);
	newDateTime.setFullYear(dateArray[0]);
	newDateTime.setMonth(dateArray[1] - 1);
	newDateTime.setDate(dateArray[2]);
	const resTime = newDateTime.getTime();

	const payload: Partial<EventInterface> = {
		title: title.trim(),
		status: status.trim(),
		type: type.trim(),
		venueId: venueId.trim(),
		managerId: managerId.trim(),
		dateTime: resTime,
	};

	console.log('PAYLOAD_FINAL', payload);

	return payload;
}
