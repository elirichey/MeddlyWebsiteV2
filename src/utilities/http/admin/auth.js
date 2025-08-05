import axios from 'axios';
import API_URL from '../_url';

const login = async (payload) => {
	return await axios.post(`${API_URL}/auth/login/org`, payload);
};

const logout = () => {
	// HTTP Invalidate Token...
	//
	// Then remove..
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('currentRole');
	localStorage.removeItem('userId');
	location.replace('/');
};

const registerNewUser = async (payload) => {
	const { password, username, email } = payload;

	const newUser = {
		email: email.trim().toLowerCase(),
		username: username.trim().toLowerCase(),
		password: password,
	};

	await axios.post(`${API_URL}/auth/register`, newUser);
};

const refreshUser = async (token) => {
	return await new Promise(() => {
		const body = { token };
		axios
			.post(`${API_URL}/auth/refresh`, body)
			.then((res) => res)
			.catch((error) => error);
	});
};

const updateUser = async (oldProfile, updatedProfile, token) => {
	return await axios
		.put(`${API_URL}/user`, updatedProfile, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then(async (res) => {
			if (updatedProfile.avatar && updatedProfile.avatar !== oldProfile.avatar) {
				const final = await uploadProfileImage(oldProfile, updatedProfile, token);
				final;
			} else res;
		})
		.catch((error) => error);
};

const deleteUser = async (token) => {
	return await axios
		.delete(`${API_URL}/user`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const uploadProfileImage = async (profile, payload, token) => {
	const ts = new Date().getTime();
	const file = {
		uri: payload.avatar,
		name: `${profile.id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return await axios({
		url: `${API_URL}/user/avatar`,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		data: formData,
		onUploadProgress: ({ total, loaded }) => {
			const progress = (loaded / total) * 100;
			const percentage = Math.round(progress);
			console.log(`Uploading User Avatar... ${percentage}%`);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const userGetSelf = async (token) => {
	return await axios
		.get(`${API_URL}/user`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

/*
const checkIfUsernameInUse = async (test, token) => {
  return await new Promise(async () => {
    axios
      .get(`${API_URL}/check/username/${test}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => (res))
      .catch((error) => (error));
  });
};
*/

const AdminAuthHTTP = {
	login,
	logout,
	registerNewUser,
	refreshUser,
	updateUser,
	deleteUser,
	userGetSelf,
	// checkIfUsernameInUse,
};

export default AdminAuthHTTP;
