import axios from 'axios';
import API from '../_url';

interface EventCall {
	eventId: string;
	token: string;
}

interface SequenceCall {
	sequenceId: string;
	token: string;
}

export interface SequenceOptions {
	orientation?: 'landscape' | 'portrait';
	segmentLength?: 'short' | 'medium' | 'long';
	customStartTime?: number;
	customEndTime?: number;
}

export interface CreateSequence {
	payload: {
		eventId: string;
		packageId: string;
		sequenceOptions: SequenceOptions;
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

async function orgGetEventSequences(data: EventCall): Promise<any> {
	const { eventId, token } = data;
	return await axios
		.get(`${API.url}/event/${eventId}/sequences/all/org`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

async function getEventSequence(data: SequenceCall): Promise<any> {
	const { sequenceId, token } = data;

	return await axios
		.get(`${API.url}/sequence/${sequenceId}/org`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

async function createEventSequence(data: CreateSequence): Promise<any> {
	const { payload, token } = data;

	return await axios
		.post(`${API.url}/sequence/request`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

const updateEventSequence = async (data: UpdateSequence): Promise<any> => {
	const { sequenceId, payload, token } = data;

	return await axios
		.put(`${API.url}/sequence/${sequenceId}/user`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
};

async function deleteEventSequence(data: DeleteSequence): Promise<any> {
	const { sequenceId, token } = data;

	return await axios
		.post(`${API.url}/sequence/${sequenceId}/delete`, {}, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((e) => e);
}

const EventSequenceHTTP = {
	orgGetEventSequences,
	getEventSequence,
	createEventSequence,
	updateEventSequence,
	deleteEventSequence,
};

export default EventSequenceHTTP;
