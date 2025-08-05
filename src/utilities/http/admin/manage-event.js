import axios from 'axios';
import API_URL from '../_url';

const managerUpdateEvent = async (event, payload, profile, token) => {
	// Make sure user is event.manager.id === profile.id
	return await axios
		.put(`${API_URL}/event/${event.id}/manager`, payload, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		})
		.then((res) => res)
		.catch((error) => error);
};

const EventManagerHTTP = {
	managerUpdateEvent,
};

export default EventManagerHTTP;
