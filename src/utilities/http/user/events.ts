import axios from 'axios';
import API from '../_url';

export interface UserEventsRequest {
	id: string;
	token: string;
	type: string;
	page?: number;
	status?: string;
}

export interface UserEventPackagesRequest {
	userId: string;
	eventId: string;
	token: string;
	page?: number;
}

interface UserEventData {
	eventId: string;
	token: string;
}

async function getUserCameraEvents(data: { token: string; page?: number }): Promise<any> {
	const { token, page } = data;
	const pageIsNumber = typeof page === 'number';

	const route = `${API.url}/user/events${pageIsNumber ? `?page=${page}` : ''}`;

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

async function getUserListEvents(payload: UserEventsRequest): Promise<any> {
	const { id, token, type, page, status } = payload;
	const pageIsNumber = typeof page === 'number';
	const statusIsString = typeof status === 'string';
	// console.log({statusType: typeof status, statusIsString});

	const isOrg = type === 'org';
	const value = isOrg ? `page/${id}` : 'user';

	let route = `${API.url}/${value}/events`;
	if (pageIsNumber) route = `${route}?page=${page}`;
	if (!pageIsNumber && statusIsString) route = `${route}?status=${status}`;
	if (pageIsNumber && statusIsString) route = `${route}&status=${status}`;

	// console.log({page, status, pageIsNumber, statusIsString, route});

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

async function getEventAsUser(vals: UserEventData): Promise<any> {
	const { eventId, token } = vals;

	return axios
		.get(`${API.url}/event/${eventId}/overview`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function userGetOrgEvents(vals: { orgId: string; token: string; page?: number; status?: string }): Promise<any> {
	const { orgId, token, page, status } = vals;
	const pageIsNumber = typeof page === 'number';
	const statusIsString = typeof status === 'string';

	// console.log({statusType: typeof status, statusIsString});

	let route = `${API.url}/page/${orgId}/events`;
	if (pageIsNumber) route = `${route}?page=${page}`;
	if (!pageIsNumber && statusIsString) route = `${route}?status=${status}`;
	if (pageIsNumber && statusIsString) route = `${route}&status=${status}`;

	// console.log({page, status, pageIsNumber, route});

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

async function getUserEventPackages(payload: UserEventPackagesRequest): Promise<any> {
	const { eventId, token } = payload;

	return axios
		.get(`${API.url}/user/event/${eventId}`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

const UserEventsHttp = {
	getUserCameraEvents,
	getUserListEvents,
	getEventAsUser,
	userGetOrgEvents,
	getUserEventPackages,
};

export default UserEventsHttp;
