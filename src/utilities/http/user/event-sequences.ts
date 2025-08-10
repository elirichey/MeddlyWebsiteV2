import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';
import { getCookie } from 'cookies-next';

interface UserEventSequencesRequest {
	eventId: string;
}

interface UserEventSequenceRequest {
	sequenceId: string;
}

async function getEventSequencesAsUser(payload: UserEventSequencesRequest): Promise<AxiosResponse> {
	const { eventId } = payload;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/event/${eventId}/sequences/all`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function getEventSequencesOwnedAsUser(payload: UserEventSequencesRequest): Promise<AxiosResponse> {
	const { eventId } = payload;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/event/${eventId}/sequences/owned`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function getSequenceOwnedAsUser(payload: UserEventSequenceRequest): Promise<AxiosResponse> {
	const { sequenceId } = payload;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/sequence/${sequenceId}/user`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

const UserEventSequencesHttp = {
	getEventSequencesAsUser,
	getEventSequencesOwnedAsUser,
	getSequenceOwnedAsUser,
};

export default UserEventSequencesHttp;
