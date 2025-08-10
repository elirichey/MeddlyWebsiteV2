import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';
import { getCookie } from 'cookies-next';

interface UserEventPackagesRequest {
	eventId: string;
	page?: number;
}

async function getEventPackagesAsUser(payload: UserEventPackagesRequest): Promise<AxiosResponse> {
	const { eventId, page } = payload;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${eventId}/packages/all${pageIsNumber ? `?page=${page}` : ''}`;

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

const UserEventPackagesHttp = {
	getEventPackagesAsUser,
};

export default UserEventPackagesHttp;
