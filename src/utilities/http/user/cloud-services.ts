import type { AxiosResponse } from 'axios';
import axios from 'axios';
import API from '../_url';
import { getCookie } from 'cookies-next';

async function getOrgCloudServices(id: string): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/page/${id}/services`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function createOrgCloudService(id: string, payload: any): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.post(`${API.url}/page/${id}/service`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function updateOrgCloudService(id: string, payload: any): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.put(`${API.url}/page/${id}/service`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function deleteOrgCloudService(id: string): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

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
