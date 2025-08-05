import axios, { type AxiosResponse } from 'axios';
import API_URL from '../_url';

interface EventCall {
	eventId: string;
	token: string;
}

interface SequenceCall {
	sequenceId: string;
	token: string;
}

interface CreateSequence {
	payload: {
		eventId: string;
		packageId: string;
	};
	token: string;
}

interface UpdateSequence {
	sequenceId: string;
	payload: {
		price: {
			attendee?: number;
			nonAttendee?: number;
		};
	};
	token: string;
}

interface DeleteSequence {
	sequenceId: string;
	token: string;
}

const orgGetEventSequences = async (data: EventCall): Promise<AxiosResponse> => {
	const { eventId, token } = data;
	return await axios
		.get(`${API_URL}/event/${eventId}/sequences/all/org`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const getEventSequence = async (data: SequenceCall): Promise<AxiosResponse> => {
	const { sequenceId, token } = data;
	return await axios
		.get(`${API_URL}/sequence/${sequenceId}/org`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const createEventSequence = async (data: CreateSequence): Promise<AxiosResponse> => {
	const { payload, token } = data;
	const { eventId, packageId } = payload;

	return await axios
		.post(`${API_URL}/event/${eventId}/package/${packageId}/sequence/generate`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const updateEventSequence = async (data: UpdateSequence): Promise<AxiosResponse> => {
	const { sequenceId, payload, token } = data;

	return await axios
		.put(`${API_URL}/sequence/${sequenceId}/user`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const deleteEventSequence = async (data: DeleteSequence): Promise<AxiosResponse> => {
	const { sequenceId, token } = data;

	return await axios
		.delete(`${API_URL}/sequence/${sequenceId}}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const requestSequenceGeneration = async (data: CreateSequence): Promise<AxiosResponse> => {
	const { payload, token } = data;

	return await axios
		.post(`${API_URL}/sequence/request`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((e) => e);
};

const EventSequenceHTTP = {
	orgGetEventSequences,
	getEventSequence,
	createEventSequence,
	updateEventSequence,
	deleteEventSequence,
	requestSequenceGeneration,
};

export default EventSequenceHTTP;
