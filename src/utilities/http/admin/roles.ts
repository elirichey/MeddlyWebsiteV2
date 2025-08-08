import axios from 'axios';
import API from '../_url';
import cookieStorage from '@/storage/cookies';

// Tested

async function getOrgRoles(data: { id: string; page?: number }): Promise<any> {
	const { id, page } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';

	const route = `${API.url}/page/${id}/roles`;
	//if (pageIsNumber) route = route + `?page=${page}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

async function getOrgRole(data: { id: string }): Promise<any> {
	const { id } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return await axios
		.get(`${API.url}/role/${id}`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

async function updateUserRole(data: { id: string; payload: any }): Promise<any> {
	const { id, payload } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return await axios
		.put(`${API.url}/page/${id}/role`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

async function getOrgEventManagers(data: { id: string; page?: number }): Promise<any> {
	const { id, page } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';

	const route = `${API.url}/page/${id}/managers`;
	//if (pageIsNumber) route = route + `?page=${page}`;

	return await axios
		.get(route, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((err) => err);
}

// ******************* UNTESTED ******************* //

async function searchUserByEmail(data: { email: string; payload: any }): Promise<any> {
	const { email, payload } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return await axios
		.post(`${API.url}/user/${email.toLowerCase()}/org`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

async function createUserRole(data: { id: string; payload: any }): Promise<any> {
	const { id, payload } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return await axios
		.post(`${API.url}/page/${id}/role`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

async function deleteUserRole(data: { id: string }): Promise<any> {
	const { id } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return await axios
		.delete(`${API.url}/page/role/${id}`, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((err) => err);
}

const OrgRolesHttp = {
	getOrgRoles,
	getOrgRole,
	getOrgEventManagers,
	updateUserRole,
	deleteUserRole,
	searchUserByEmail,
	createUserRole,
};

export default OrgRolesHttp;
