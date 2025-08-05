import axios from 'axios';
import API_URL from '../_url';

const getEventPackages = async (id: string, token: string) => {
	return await axios
		.get(`${API_URL}/event/${id}/packages/all`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const getEventPackage = async (eventId: string, packageId: string, token: string) => {
	return await axios
		.get(`${API_URL}/event/${eventId}/package/${packageId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const orgGetEventPackages = async (id: string, token: string) => {
	return await axios
		.get(`${API_URL}/event/${id}/packages/all/org`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const createEventPackage = async (payload: any, token: string) => {
	return await axios
		.post(`${API_URL}/event/${payload.eventId}/package`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const updateEventPackage = async (eventId: string, packageId: string, payload: any, token: string) => {
	return await axios
		.put(`${API_URL}/event/${eventId}/package/${packageId}`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const deleteEventPackage = async (eventId: string, packId: string, token: string) => {
	axios
		.delete(`${API_URL}/event/${eventId}/package/${packId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const EventPackageHTTP = {
	getEventPackages,
	getEventPackage,
	orgGetEventPackages,
	createEventPackage,
	updateEventPackage,
	deleteEventPackage,
};

export default EventPackageHTTP;
