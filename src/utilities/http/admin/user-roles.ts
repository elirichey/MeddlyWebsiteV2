import axios from 'axios';
import API_URL from '../_url';

const searchUserByEmail = async (email: string, payload: any, token: string) => {
	return await axios.post(`${API_URL}/user/${email}/org`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const getOrgRoles = async (id: string, token: string) => {
	return await axios.get(`${API_URL}/page/${id}/roles`, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const createUserRole = async (id: string, payload: any, token: string) => {
	return await axios.post(`${API_URL}/page/${id}/role`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const updateUserRole = async (id: string, payload: any, token: string) => {
	return await axios.put(`${API_URL}/page/${id}/role`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const deleteUserRole = async (id: string, token: string) => {
	return await axios.delete(`${API_URL}/page/role/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const UserRolesHTTP = {
	searchUserByEmail,
	getOrgRoles,
	createUserRole,
	updateUserRole,
	deleteUserRole,
};

export default UserRolesHTTP;
