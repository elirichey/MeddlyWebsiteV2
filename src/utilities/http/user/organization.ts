import axios from 'axios';
import API from '../_url';
import cookieStorage from '@/storage/cookies';

async function getOrganizations(data: any): Promise<any> {
	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const { page } = data;
	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/pages${pageIsNumber ? `?page=${page}` : ''}`;

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

async function getOrganization(data: any): Promise<any> {
	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const { id } = data;
	const route = `${API.url}/page/${id}`;

	return axios
		.get(route, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((e) => e);
}

const UserOrganizationHttp = {
	getOrganizations,
	getOrganization,
};

export default UserOrganizationHttp;
