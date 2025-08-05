import axios from 'axios';
import type { CookieValueTypes } from 'cookies-next';
import validator from 'validator';
import API_URL from '../_url';

interface ResponseError {
	type: string;
	message: string;
}

interface ErrorResponse {
	status: number;
	errors: ResponseError[];
}

const login = async (payload: any): Promise<any | ErrorResponse> => {
	const { email, password } = payload;

	const errors = [];
	if (!validator.isEmail(email)) {
		if (email.trim() === '') {
			errors.push({ type: 'Email', message: 'Please enter your email' });
		} else {
			errors.push({ type: 'Email', message: 'Please enter a valid email' });
		}
	}

	if (password.trim() === '') {
		errors.push({ type: 'Password', message: 'Please enter your password' });
	}

	const errorRes = { status: 400, errors: errors };
	if (errorRes.errors.length > 0) return errorRes;

	return axios
		.post(`${API_URL}/auth/login`, payload)
		.then((res) => res)
		.catch((e) => {
			if (e?.request?._response) {
				const obj = JSON.parse(e.request._response);
				const emailError = !!obj?.message?.includes('User');

				const errors = [];
				const error = {
					type: emailError ? 'Email' : 'Password',
					message: obj.message,
				};
				errors.push(error);
				const errorRes = { status: 400, errors: errors };
				return errorRes;
			}
		});
};

const registerNewUser = async (payload: any) => {
	const { password, username, email } = payload;

	const newUser = {
		email: email.trim().toLowerCase(),
		username: username.trim().toLowerCase(),
		password: password,
	};

	return axios
		.post(`${API_URL}/auth/register`, newUser)
		.then((res) => res)
		.catch((error) => error);
};

const refreshUser = async (token: CookieValueTypes) => {
	const body = { token };
	return axios
		.post(`${API_URL}/auth/refresh`, body)
		.then((res) => res)
		.catch((error) => error);
};

const updateUser = async (oldProfile: any, updatedProfile: any, token: string) => {
	return axios
		.put(`${API_URL}/user`, updatedProfile, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then(async (res) => {
			if (updatedProfile.avatar && updatedProfile.avatar !== oldProfile.avatar) {
				const final = await uploadProfileImage(oldProfile, updatedProfile, token);
				return final;
			}
			return res;
		})
		.catch((error) => error);
};

const deleteUser = async (token: string) => {
	return axios
		.delete(`${API_URL}/user`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const uploadProfileImage = async (profile: any, payload: any, token: string) => {
	const ts = new Date().getTime();
	const file: any = {
		uri: payload.avatar,
		name: `${profile.id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return axios({
		url: `${API_URL}/user/avatar`,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		data: formData,
		onUploadProgress: ({ total, loaded }: any) => {
			const progress = (loaded / total) * 100;
			const percentage = Math.round(progress);
			console.log(`Uploading User Avatar... ${percentage}%`);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const requestPasswordReset = async (body: any) => {
	return axios
		.post(`${API_URL}/auth/password/request`, body)
		.then((res) => res)
		.catch((error) => error);
};

const resetPassword = async (payload: any, token: string) => {
	return axios
		.post(`${API_URL}/auth/password/reset`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const updateConnectedEvent = async (body: any, token: string) => {
	return await axios
		.put(`${API_URL}/user/event`, body, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const userGetSelf = async (token: string) => {
	return axios
		.get(`${API_URL}/user`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const checkIfUsernameInUse = async (test: string, token: string) => {
	return axios
		.get(`${API_URL}/check/username/${test}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const checkIfEmailInUse = async (test: string, token: string) => {
	return axios
		.get(`${API_URL}/check/email/${test}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const AuthUserHTTP = {
	login,
	registerNewUser,
	refreshUser,
	updateUser,
	deleteUser,
	updateConnectedEvent,
	userGetSelf,
	checkIfUsernameInUse,
	checkIfEmailInUse,
	requestPasswordReset,
	resetPassword,
};

export default AuthUserHTTP;
