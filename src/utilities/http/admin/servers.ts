import axios from 'axios';
import API from '../_url';
import { getCookie } from 'cookies-next';

async function managerStartProcessingServer(data: { orgId: string }): Promise<any> {
	const { orgId } = data;

	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	// DON'T FORGET TO SEND AN EMPTY PAYLOAD OR THE REQUEST ARGUMENTS ARE NOT IN ORDER
	const payload = {};
	const timeout = 1000 * 60 * 5; // 5 minutes
	const response = await axios
		.post(`${API.url}/org/${orgId}/server/live`, payload, { headers: { Authorization: `Bearer ${token}` }, timeout })
		.then((res) => res)
		.catch((err) => err);

	return response;
}

const OrgServersHTTP = {
	managerStartProcessingServer,
};

export default OrgServersHTTP;
