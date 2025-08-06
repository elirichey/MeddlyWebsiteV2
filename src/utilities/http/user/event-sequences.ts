import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';

interface UserEventSequencesRequest {
	token: string;
	eventId: string;
}

interface UserEventSequenceRequest {
	token: string;
	sequenceId: string;
}

async function getEventSequencesAsUser(payload: UserEventSequencesRequest): Promise<AxiosResponse> {
	const { eventId, token } = payload;

	return axios
		.get(`${API.url}/event/${eventId}/sequences/all`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function getEventSequencesOwnedAsUser(payload: UserEventSequencesRequest): Promise<AxiosResponse> {
	const { eventId, token } = payload;

	return axios
		.get(`${API.url}/event/${eventId}/sequences/owned`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((e) => e);
}

async function getSequenceOwnedAsUser(payload: UserEventSequenceRequest): Promise<AxiosResponse> {
	const { sequenceId, token } = payload;

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
