import axios from 'axios';
import API from './_url';

export interface SupportTicketPayload {
	payload: SupportTicketOnCreate;
	token: string;
}

interface SupportTicketOnCreate {
	type: string;
	description: string;
	deviceInfo: string;
	orgId: string;
}

interface RequestOrganizationPayload {
	payload: {
		name: string;
		website: string;
		recordsEveryShow: boolean;
		contactName?: string;
		contactPhone?: string;
		contactEmail: string;
		isRepresentative: boolean;
		noShowsPerMonth: number;
		hiddenInput: string;
	};
	token: string;
}

async function createSupportTicket(data: SupportTicketPayload): Promise<any> {
	const { payload, token } = data;

	return axios
		.post(`${API.url}/support`, payload, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);
}

async function requestOrganization(data: RequestOrganizationPayload): Promise<any> {
	const { payload, token } = data;

	return axios
		.post(`${API.url}/request/organization`, payload, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

async function getUserOrgRequests(token: string): Promise<any> {
	return axios
		.get(`${API.url}/request/organization`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

async function deleteUserOrgRequest(data: { token: string; id: string }): Promise<any> {
	const { token, id } = data;

	return axios
		.delete(`${API.url}/request/${id}`, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

const SupportHttp = {
	createSupportTicket,
	requestOrganization,
	getUserOrgRequests,
	deleteUserOrgRequest,
};

export default SupportHttp;
