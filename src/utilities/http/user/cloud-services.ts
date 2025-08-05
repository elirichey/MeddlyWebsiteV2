import axios from 'axios';
import API_URL from '../_url';

const getOrgCloudServices = async (id: string, token: string) => {
	return await axios.get(`${API_URL}/page/${id}/services`, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const createOrgCloudService = async (id: string, payload: any, accessToken: string) => {
	return await axios
		.post(`${API_URL}/page/${id}/service`, payload, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const updateOrgCloudService = async (id: string, payload: any, accessToken: string) => {
	return await axios
		.put(`${API_URL}/page/${id}/service`, payload, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const deleteOrgCloudService = async (id: string, accessToken: string) => {
	return await axios
		.delete(`${API_URL}/page/service/${id}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const CloudServicesHttp = {
	getOrgCloudServices,
	createOrgCloudService,
	updateOrgCloudService,
	deleteOrgCloudService,
};

export default CloudServicesHttp;
