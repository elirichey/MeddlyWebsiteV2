import axios, { type AxiosResponse } from 'axios';
import validator from 'validator';
import type { AuthCredentials, NewUserCredentials } from '../../interfaces/Auth';
import type { Error as ErrorType, ResponseError } from '../../interfaces/General';
import API from './_url';
import { getCookie, setCookie } from 'cookies-next';
import { setSecureRefreshCookie, setSecureAuthCookie } from '@/storage/cookies';
import type { UserRole } from '@/interfaces/UserRoles';

interface UpdatePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

interface UpdateUserPayload {
	profile: any;
	data: any;
}

interface UpdateUserConnectedEventPayload {
	eventConnectedId: string | null;
}

interface ValidateIfInUsePayload {
	test: string;
}

// *************** Auth *************** //

async function registerNewUser(payload: NewUserCredentials): Promise<AxiosResponse> {
	const { password, username, email } = payload;

	const newUser = {
		email: email.trim().toLowerCase(),
		username: username.trim().toLowerCase(),
		password: password,
	};

	const res = await axios
		.post(`${API.url}/auth/register`, newUser)
		.then((res) => res)
		.catch((error) => error);

	console.log('registerNewUser: Response', { res: res?.data });
	if (res?.data?.accessToken) {
		setSecureAuthCookie('accessToken', res?.data?.accessToken);
	}
	if (res?.data?.refreshToken) {
		setSecureRefreshCookie('refreshToken', res?.data?.refreshToken);
	}

	return res;
}

async function login(payload: AuthCredentials): Promise<AxiosResponse | any> {
	const { email, password } = payload;
	const errors: Array<ErrorType> = [];

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

	const res: any = await axios
		.post(`${API.url}/auth/login`, payload)
		.then((res) => res)
		.catch((e) => {
			if (e.request?._response) {
				const obj = JSON.parse(e.request._response);
				const error = {
					type: 'Authentication',
					message: obj.message,
				};
				errors.push(error);
				const eResponse: ResponseError = { status: 400, errors: errors };
				return eResponse;
			}
		});

	console.log('login: Response', { res });
	if (res?.data?.accessToken) {
		setSecureAuthCookie('accessToken', res?.data?.accessToken);
	}
	if (res?.data?.refreshToken) {
		setSecureRefreshCookie('refreshToken', res?.data?.refreshToken);
	}

	return res;
}

async function signOut(): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/auth/signout`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);
}

async function refreshUser(): Promise<AxiosResponse> {
	const token = getCookie('refreshToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	if (!token || typeof token !== 'string' || token.trim() === '') {
		return Promise.reject(new Error('Invalid refresh token'));
	}

	const payload = { token };
	const res = await axios
		.post(`${API.url}/auth/refresh`, payload)
		.then((res) => res)
		.catch((error) => error);

	console.log('refreshUser: Response', { res: res?.data });
	if (res?.data?.accessToken) {
		setSecureAuthCookie('accessToken', res?.data?.accessToken);
	}
	if (res?.data?.refreshToken) {
		setSecureRefreshCookie('refreshToken', res?.data?.refreshToken);
	}

	return res;
}

async function requestPasswordReset(body: any): Promise<AxiosResponse> {
	return new Promise((resolve) => {
		axios
			.post(`${API.url}/auth/password/request`, body)
			.then((res) => resolve(res))
			.catch((error) => resolve(error));
	});
}

async function updateUserPassword(payload: UpdatePasswordPayload): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const { oldPassword, newPassword } = payload;
	const body = { oldPassword, newPassword };
	return axios
		.post(`${API.url}/auth/password/update`, body, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);
}

// *************** Profile *************** //

async function userGetSelf(): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	const currentRoleCookie = await getCookie('currentRole');
	const currentRole = currentRoleCookie ? JSON.parse(currentRoleCookie) : null;

	if (!token) {
		console.error('userGetSelf: No token found');
		return Promise.reject(new Error('No token found'));
	}

	const res = await axios
		.get(`${API.url}/user`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);

	const profile = res?.data;

	if (profile) {
		// Use the custom cookieStorage which handles JSON serialization properly
		const user = {
			id: profile.id,
			name: profile.name,
			username: profile.username,
			avatar: profile.avatar,
		};

		setCookie('profile', user);
		setCookie('roles', profile.userRoles);

		if (currentRole) {
			const updatedRole = profile.userRoles.find((role: UserRole) => role.id === currentRole?.id);
			if (updatedRole) {
				setCookie('currentRole', updatedRole);
			}
		}

		console.log('userGetSelf: Cookie set successfully using cookieStorage');
	} else {
		console.log('userGetSelf: No profile data to set cookie');
	}

	return res;
}

async function updateUser(payload: UpdateUserPayload): Promise<AxiosResponse> {
	const { profile, data } = payload;
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const currentAvatar = profile?.avatar;
	const newAvatar = data?.avatar;

	return axios
		.put(`${API.url}/user`, data, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then(async (res) => {
			if (newAvatar && newAvatar !== currentAvatar) {
				const final = await uploadProfileImage(profile?.id, newAvatar);
				return final;
			}
			return res;
		})
		.catch((error) => error);
}

async function uploadProfileImage(profileId: string, newAvatar: string): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const ts = new Date().getTime();
	const file: any = {
		uri: newAvatar,
		name: `${profileId}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return axios({
		url: `${API.url}/user/avatar`,
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'content-type': 'multipart/form-data' },
		data: formData,
		onUploadProgress: ({ total, loaded }) => {
			const totalVal = total ? total : 1;
			const progress = (loaded / totalVal) * 100;
			const percentage = Math.round(progress);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
}

async function deleteUser(): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.delete(`${API.url}/user`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
		.then((res) => res)
		.catch((error) => error);
}

// *************** Utilities *************** //

async function checkIfEmailInUse(test: string): Promise<AxiosResponse> {
	return axios
		.get(`${API.url}/check/email/${test}`)
		.then((res) => res)
		.catch((error) => error);
}

async function userCheckIfEmailInUse(payload: ValidateIfInUsePayload): Promise<AxiosResponse> {
	const { test } = payload;
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.post(`${API.url}/check/email/${test}`, null, {
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
		})
		.then((res) => res)
		.catch((error) => error);

	//return axios
	//  .post(`${API.url}/check/email/${test}`, {
	//    headers: {Authorization: `Bearer ${token}`},
	//  })
	//  .then(res => res)
	//  .catch(error => error);
}

async function checkIfUsernameInUse(test: string): Promise<AxiosResponse> {
	return axios
		.get(`${API.url}/check/username/${test}`)
		.then((res) => res)
		.catch((error) => error);
}

async function userCheckIfUsernameInUse(payload: ValidateIfInUsePayload): Promise<AxiosResponse> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const { test } = payload;
	return axios
		.post(`${API.url}/check/username/${test}`, null, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

const resetPassword = async (payload: any) => {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.post(`${API.url}/auth/password/reset`, payload, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const AuthHTTP = {
	registerNewUser,
	login,
	signOut,
	refreshUser,
	requestPasswordReset,
	updateUserPassword,
	deleteUser,
	// Profile
	userGetSelf,
	updateUser,
	uploadProfileImage,
	// Utilities
	checkIfEmailInUse,
	userCheckIfEmailInUse,
	checkIfUsernameInUse,
	userCheckIfUsernameInUse,
	// Reset Password
	resetPassword,
};

export default AuthHTTP;
