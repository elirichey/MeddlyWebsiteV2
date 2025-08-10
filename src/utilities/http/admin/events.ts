import axios from 'axios';
import type { MeddlyEvent } from '../../../interfaces/Event';
import API from '../_url';
import { getCookie } from 'cookies-next';

interface OrgEventData {
	eventId: string;
}

async function getOrgEvents(vals: { orgId: string; page?: number; status?: string }): Promise<any> {
	const { orgId, page, status } = vals;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';
	const statusIsString = typeof status === 'string';

	// console.log({statusType: typeof status, statusIsString});

	let route = `${API.url}/org/${orgId}/events`;
	if (pageIsNumber) route = `${route}?page=${page}`;
	if (!pageIsNumber && statusIsString) route = `${route}?status=${status}`;
	if (pageIsNumber && statusIsString) route = `${route}&status=${status}`;

	// console.log({page, status, pageIsNumber, route});

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

async function getOrgEvent(vals: OrgEventData): Promise<any> {
	const { eventId } = vals;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/event/${eventId}/overview`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

// ************** NOT TESTED  ************** //

async function createEvent(data: { payload: any }): Promise<any | any> {
	const { payload } = data;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const payloadOnCreate = { ...payload };
	payloadOnCreate.coverImg = undefined;

	const res = axios
		.post(`${API.url}/event`, payloadOnCreate, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then(async (res) => {
			if (payload.coverImg !== null) {
				try {
					const final = await uploadCoverArt(res.data, payload);
					if (final.status === 201) return final;
					return final;
				} catch (e) {
					return e;
				}
			} else {
				return res;
			}
		})
		.catch((e) => {
			const error: any = {};
			const res: any = [];
			res.push({ type: `${e.status}`, body: e });
			error.error = res;
			return error;
		});

	return res;
}

async function updateEvent(data: { event: MeddlyEvent; payload: any }): Promise<any | any> {
	const { event, payload } = data;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	console.log('updateEvent: Payload', { event, payload });

	const res = await axios
		.put(`${API.url}/event/${event.id}`, payload, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then(async (res) => {
			if (payload.coverImg && event.coverImg !== payload.coverImg) {
				try {
					const final = await uploadCoverArt(res.data, payload);
					if (final.status === 201) {
						return final;
					}
					return res;
				} catch (e) {
					return e;
				}
			} else {
				return res;
			}
		})
		.catch((e) => e);

	return res;
}

async function deleteEvent(data: { eventId: string }): Promise<any> {
	const { eventId } = data;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.delete(`${API.url}/event/${eventId}`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function resyncEventAudioSources(eventId: string): Promise<any> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.post(
			`${API.url}/event/${eventId}/sync`,
			{ forceAudioRecreation: false },
			{ headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
		)
		.then((res) => res)
		.catch((e) => e);
}

// ************* NOT TESTED ************* //

async function startEventProcessing(eventId: string): Promise<any> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/event/${eventId}/completed`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function updateEventDefaultVideo(data: { eventId: string; videoId: string }): Promise<any> {
	const { eventId, videoId } = data;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const payload = { default_video_id: videoId };

	return axios
		.put(`${API.url}/event/${eventId}`, payload, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function uploadCoverArt(data: any, payload: any): Promise<any> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const ts = new Date().getTime();
	const file: any = {
		uri: payload?.coverImg,
		name: `${data.id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return axios({
		url: `${API.url}/event/${data.id}/cover`,
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'content-type': 'multipart/form-data' },
		data: formData,
		onUploadProgress: ({ total, loaded }) => {
			const totalVal = total ? total : 1;
			const progress = (loaded / totalVal) * 100;
			const percentage = Math.round(progress);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
}

const OrgEventsHttp = {
	getOrgEvents,
	getOrgEvent,
	// getOrgEvent,
	updateEvent,
	uploadCoverArt,
	// Untested
	createEvent,
	deleteEvent,
	//
	resyncEventAudioSources,
	//
	startEventProcessing,
	updateEventDefaultVideo,
};

export default OrgEventsHttp;
