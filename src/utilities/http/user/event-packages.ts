import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';

interface UserEventPackagesRequest {
	token: string;
	eventId: string;
	page?: number;
}

async function getEventPackagesAsUser(payload: UserEventPackagesRequest): Promise<AxiosResponse> {
	const { eventId, token, page } = payload;

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
