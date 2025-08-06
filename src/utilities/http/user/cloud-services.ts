import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';

async function getOrgCloudServices(id: string, token: string): Promise<AxiosResponse> {
	return axios
		.get(`${API.url}/page/${id}/services`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function createOrgCloudService(id: string, payload: any, token: string): Promise<AxiosResponse> {
	return axios
		.post(`${API.url}/page/${id}/service`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function updateOrgCloudService(id: string, payload: any, token: string): Promise<AxiosResponse> {
	return axios
		.put(`${API.url}/page/${id}/service`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function deleteOrgCloudService(id: string, token: string): Promise<AxiosResponse> {
	return axios
		.delete(`${API.url}/page/service/${id}`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

const CloudServicesHttp = {
	getOrgCloudServices,
	createOrgCloudService,
	updateOrgCloudService,
	deleteOrgCloudService,
};

export default CloudServicesHttp;
