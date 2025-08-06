import axios from 'axios';
import API from '../_url';

interface EventCall {
	id: string;
	token: string;
	page?: number;
}

interface PackageCall {
	eventId: string;
	packageId: string;
	token: string;
}

interface CreatePackage {
	payload: any;
	token: string;
}

interface UpdatePackage {
	eventId: string;
	packageId: string;
	payload: any;
	token: string;
}

interface DeletePackage {
	eventId: string;
	packageId: string;
	token: string;
}

async function userGetEventPackages(data: EventCall): Promise<any> {
	const { id, token, page } = data;

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${id}/packages/all${pageIsNumber ? `?page=${page}` : ''}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);
}

async function orgGetEventPackages(data: EventCall): Promise<any> {
	const { id, token, page } = data;

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${id}/packages/all/org${pageIsNumber ? `?page=${page}` : ''}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);
}

async function getEventPackage(data: PackageCall): Promise<any> {
	const { eventId, packageId, token } = data;

	return await axios
		.get(`${API.url}/event/${eventId}/package/${packageId}`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

async function createEventPackage(data: CreatePackage): Promise<any> {
	const { payload, token } = data;

	return await axios
		.post(`${API.url}/event/${payload.eventId}/package`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function updateEventPackage(data: UpdatePackage): Promise<any> {
	const { eventId, packageId, payload, token } = data;

	return await axios
		.put(`${API.url}/event/${eventId}/package/${packageId}`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function deleteEventPackage(data: DeletePackage): Promise<any> {
	const { eventId, packageId, token } = data;

	return await axios
		.delete(`${API.url}/event/${eventId}/package/${packageId}`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((e) => e);
}

const EventPackageHTTP = {
	userGetEventPackages,
	orgGetEventPackages,
	getEventPackage,
	createEventPackage,
	updateEventPackage,
	deleteEventPackage,
};

export default EventPackageHTTP;
