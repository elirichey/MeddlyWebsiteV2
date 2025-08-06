import axios from 'axios';
import API from '../_url';

async function managerStartEventServer(data: { eventId: string; token: string }): Promise<any> {
	const { eventId, token } = data;

	// DON'T FORGET TO SEND AN EMPTY PAYLOAD OR THE REQUEST ARGUMENTS ARE NOT IN ORDER
	const payload = {};
	const timeout = 1000 * 60 * 5; // 5 minutes
	const response = await axios
		.post(`${API.url}/event/${eventId}/server`, payload, { headers: { Authorization: `Bearer ${token}` }, timeout })
		.then((res) => res)
		.catch((err) => err);

	return response;
}

async function managerUpdateEvent(data: { eventId: string; payload: any; token: string }): Promise<any> {
	const { eventId, payload, token } = data;

	return await axios
		.put(`${API.url}/event/${eventId}/manager`, payload, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

const EventManagerHTTP = {
	managerStartEventServer,
	managerUpdateEvent,
};

export default EventManagerHTTP;
