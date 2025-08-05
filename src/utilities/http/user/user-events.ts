import axios, { type AxiosResponse } from 'axios';
import API_URL from '../_url';

const getUserEvents = async (id: string, token: string): Promise<AxiosResponse> => {
	return await axios({
		url: `${API_URL}/user/${id}/events`,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const checkIfUserHasEventPackages = async (userId: string, eventId: string, token: string): Promise<AxiosResponse> => {
	return await axios({
		url: `${API_URL}/user/${userId}/event/${eventId}`,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const UserEventHTTP = {
	getUserEvents,
	checkIfUserHasEventPackages,
};

export default UserEventHTTP;
