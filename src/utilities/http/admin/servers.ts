import axios from 'axios';
import API from '../_url';

async function managerStartProcessingServer(data: { orgId: string; token: string }): Promise<any> {
	const { orgId, token } = data;
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
