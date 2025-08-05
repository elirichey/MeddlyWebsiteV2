import type { MeddlyEvent } from '@/interfaces/Event';
import type { UserRole } from '@/interfaces/UserRoles';
import axios from 'axios';
import API_URL from '../_url';

const getOrganizationalEvents = async (token: string, currentRole: UserRole, page: number, status: string) => {
	const roleIsSet = typeof currentRole === 'object' && currentRole !== null;

	const orgId = currentRole?.organization?.id;
	let route = `${API_URL}/org/${orgId}/events`;

	const pageIsNumber = typeof page === 'number';
	const statusIsString = typeof status === 'string';

	if (pageIsNumber) route = `${route}?page=${page}`;
	if (!pageIsNumber && statusIsString) route = `${route}?status=${status}`;
	if (pageIsNumber && statusIsString) route = `${route}&status=${status}`;

	if (roleIsSet) {
		return await axios({
			url: route,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
			.then((res) => res)
			.catch((error) => error);
	}
};

const getOrganizationalEvent = async (token: string, eventId: string) => {
	return await axios({
		url: `${API_URL}/event/${eventId}/overview`,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const createEvent = async (payload: Partial<MeddlyEvent>, token: string) => {
	const payloadOnCreate = { ...payload };
	payloadOnCreate.coverImg = undefined;

	return await axios
		.post(`${API_URL}/event`, payloadOnCreate, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then(async (res) => {
			if (payload.coverImg) {
				try {
					const final: any = await uploadCoverArt(res.data, payload, token);
					if (final.status === 201) final;
					else final;
				} catch (e) {
					e;
				}
			} else res;
		})
		.catch((e) => {
			const error: any = {};
			const res = [];
			res.push({
				type: `${e.status}`,
				body: e,
			});
			error.error = res;
			error;
		});
};

const updateEvent = async (event: MeddlyEvent, payload: Partial<MeddlyEvent>, token: string) => {
	return await axios
		.put(`${API_URL}/event/${event.id}`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then(async (res: any) => {
			if (payload.coverImg && event.coverImg !== payload.coverImg) {
				try {
					const final: any = await uploadCoverArt(res.data, payload, token);
					if (final.status === 201) final;
					else res;
				} catch (e) {
					e;
				}
			} else res;
		})
		.catch((e) => e);
};

const startEventProcessing = async (event: MeddlyEvent, token: string) => {
	return await axios
		.get(`${API_URL}/event/${event.id}/completed`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const updateEventDefaultVideo = async (event: MeddlyEvent, video_id: string, token: string) => {
	const payload = { default_video_id: video_id };

	return await axios
		.put(`${API_URL}/event/${event.id}`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const uploadCoverArt = async (data: any, payload: any, token: string) => {
	const ts = new Date().getTime();
	const file: any = {
		uri: payload.coverImg,
		name: `${data.id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return await axios({
		url: `${API_URL}/event/${data.id}/cover`,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		data: formData,
		onUploadProgress: ({ total, loaded }: any) => {
			const progress = (loaded / total) * 100;
			const percentage = Math.round(progress);
			console.log(`Uploading Event Cover... ${percentage}%`);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const deleteEvent = async (id: string, token: string) => {
	return await axios
		.delete(`${API_URL}/event/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const OrgEventHTTP = {
	getOrganizationalEvents,
	getOrganizationalEvent,
	createEvent,
	updateEvent,
	startEventProcessing,
	updateEventDefaultVideo,
	deleteEvent,
};

export default OrgEventHTTP;
