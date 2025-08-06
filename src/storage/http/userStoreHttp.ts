import axios from 'axios';
import AuthHTTP from '@/utilities/http/auth';
import type { AuthCredentials, NewUserCredentials } from '../../interfaces/Auth';
import type { UsersOrgRole } from '../../interfaces/UserRoles';
import { useEventStore } from '../stores/useEventStore';
import { useMediaStore } from '../stores/useMediaStore';
import { usePackagesStore } from '../stores/usePackagesStore';
import { useRolesStore } from '../stores/useRolesStore';
import { useSequencesStore } from '../stores/useSequencesStore';
import { useServerStore } from '../stores/useServerStore';
import { useSocketStore } from '../stores/useSocketStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useUserStore } from '../stores/useUserStore';

async function tryLogin(data: AuthCredentials) {
	const { setLoading, setTokens, setError } = useUserStore.getState();
	setLoading(true);
	setError(null);

	// console.log('tryLogin: Star	t', { data });

	let errorMsg = '';
	try {
		const response = await AuthHTTP.login(data);
		// console.log('tryLogin: Response', { response });
		if (response.status === 201 && response.data) {
			setTokens(response.data);
			UserStoreHttp.getUserProfile();

			// console.log('tryLogin: Response', { tokens: response.data });
		} else {
			const msg = response?.errors?.[0]?.message || 'Incorrect credentials';
			setError(msg);
			errorMsg = msg;
			// console.log('tryLogin: Error 1', { err: response, msg });
			return msg || 'Error';
		}
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		setError(msg);
		errorMsg = msg;
		// console.log('tryLogin: Error', { err });
	} finally {
		setLoading(false);
		// console.log('tryLogin: Complete');
		// if (errorMsg && errorMsg?.trim() !== '') {
		// 	Toast.show(ToastError('Oops!', errorMsg));
		// } else {
		// 	Toast.show(ToastGeneral('Login Successful'));
		// }
	}
}

async function trySignUp(data: NewUserCredentials) {
	const { setLoading, setTokens, setError } = useUserStore.getState();
	setLoading(true);
	setError(null);

	let errorMsg = '';

	// console.log('trySignUp: Start', { data });
	try {
		const res: any = await AuthHTTP.registerNewUser(data);
		if (res.status === 201 && res.data) {
			setTokens(res.data);
			UserStoreHttp.getUserProfile();

			// console.log('trySignUp: Response', { tokens: res.data });
		} else {
			const msg = res?.response?.data?.message;
			setError(msg);
			errorMsg = msg;
			// console.log('trySignUp: Error 1', { err: res, msg });
			return msg || 'Error';
		}
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		setError(msg);
		errorMsg = msg;
		// console.log('trySignUp: Error Catch', { err, msg });
		return msg;
	} finally {
		setLoading(false);
		// console.log('trySignUp: Complete');
		// if (errorMsg.trim() !== '') {
		// 	Toast.show(ToastError('Oops!', errorMsg));
		// } else {
		// 	Toast.show(ToastGeneral('Welcome To Meddly'));
		// }
	}
}

async function resetAllStores() {
	const { resetUserStore } = useUserStore.getState();
	const { resetEvents } = useEventStore.getState();
	const { resetMedia } = useMediaStore.getState();
	const { resetPackages } = usePackagesStore.getState();
	const { resetRoles } = useRolesStore.getState();
	const { resetSequences } = useSequencesStore.getState();
	const { resetServer } = useServerStore.getState();
	const { resetSocket } = useSocketStore.getState();
	const { resetTheme } = useThemeStore.getState();

	// console.log('resetAllStores');

	resetUserStore();
	resetEvents();
	resetMedia();
	resetPackages();
	resetRoles();
	resetSequences();
	resetServer();
	resetSocket();
	resetTheme();
}

async function tryLogout(): Promise<void> {
	const { loading, setLoading, tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	if (!loading) setLoading(true);
	let errorMsg = '';
	let logoutSuccessful = false;

	// console.log('tryLogout: Start', { hasAccessToken: !!accessToken, accessTokenLength: accessToken.length });

	try {
		// Only attempt server logout if we have a valid access token
		if (accessToken && accessToken.length > 0) {
			const res: any = await AuthHTTP.signOut(accessToken);
			if (res?.status === 200) {
				logoutSuccessful = true;
				// console.log('tryLogout: Server logout successful');
				// setTimeout(() => {
				// 	Toast.show(ToastGeneral('Logged Out', 'See you soon!'));
				// }, timeout.auth);
			} else {
				const msg = res?.response?.data?.message || 'Logout failed';
				errorMsg = msg;
				// console.log('tryLogout: Server logout failed', { err: res, msg });
			}
			// } else {
			// 	console.log('tryLogout: No access token, skipping server logout');
		}
	} catch (err: any) {
		const msg = err?.message || 'Logout failed';
		errorMsg = msg;
		// console.log('tryLogout: Error Catch', { err, msg, status: err?.response?.status });

		// If it's a 403 error (invalid token), don't show error to user
		if (err?.response?.status === 403) {
			errorMsg = '';
			// console.log('tryLogout: 403 error - token already invalid, proceeding with local logout');
		}
	} finally {
		// Always reset stores regardless of server response
		// console.log('tryLogout: Resetting stores');
		await resetAllStores();

		// if (errorMsg.trim() !== '') {
		// 	Toast.show(ToastError('Oops!', errorMsg));
		// }

		setLoading(false);
	}
}

// Global flag to prevent concurrent refresh attempts
let isRefreshing = false;

async function refreshUser(): Promise<void> {
	// Prevent concurrent refresh attempts
	if (isRefreshing) {
		// console.log('refreshUser: Already refreshing, skipping');
		return;
	}

	isRefreshing = true;

	// Add a small delay to prevent rapid successive calls
	// await delay(100);

	try {
		const { tokens, setTokens } = useUserStore.getState();

		if (!tokens?.refreshToken) {
			// Toast.show(ToastError('Session expired', 'Please log in again.'));
			// console.log('refreshUser: Logout - No refresh token');
			await tryLogout();
			return;
		}

		// console.log('refreshUser: Refresh Token', { tokens });

		const res: any = await AuthHTTP.refreshUser(tokens.refreshToken);
		// console.log('refreshUser: Response', { res });

		// Check if response contains error data despite 201 status
		if (res?.status === 201) {
			// Check if the response contains a Prisma error despite 201 status
			if (res.data?.name === 'PrismaClientKnownRequestError') {
				// console.log('refreshUser: Prisma error in response despite 201 status', { error: res.data });
				const msg = 'Database error during token refresh';
				// console.log('refreshUser: Error from Prisma', { msg });
				await tryLogout();
				return;
			}

			// Check if the response has the expected token structure
			if (res.data?.accessToken && res.data?.refreshToken) {
				setTokens(res.data);
				// console.log('refreshUser: Tokens updated successfully');
				return;
			}
			// console.log('refreshUser: Invalid token response structure', { data: res.data });
			const msg = 'Invalid token response from server';
			// console.log('refreshUser: Error - Invalid structure', { msg });
			await tryLogout();
			return;
		}
		const msg = res?.response?.data?.message || 'Failed to refresh session';
		// console.log('refreshUser: Error', { msg });
		await tryLogout();
		return;
	} catch (err: any) {
		// console.log('refreshUser: Error Catch 2', { err });
		const msg = err?.message || 'Failed to refresh session';
		console.error('refreshUser: Catch Error', { error: msg });
		await tryLogout();
		return;
	} finally {
		isRefreshing = false;
	}
}

async function getUserProfile(retryCount = 0) {
	const { setLoading, setProfile, setUserRoles, tokens, currentRole, setCurrentRole } = useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	if (!tokens?.accessToken) {
		const msg = 'Failed to get user profile';
		// Toast.show(ToastError('Oops!', msg));
		return msg;
	}

	try {
		const res: any = await AuthHTTP.userGetSelf(tokens.accessToken);
		if (res?.status === 200 && res?.data) {
			setProfile(res.data);
			setUserRoles(res.data.userRoles);
			if (currentRole) {
				const updatedRole = res.data.userRoles.find((role: UsersOrgRole) => role.id === currentRole.id);
				if (updatedRole) {
					setCurrentRole(updatedRole);
				}
			}
			return null;
		}
		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				// await delay(timeout.auth);
				return getUserProfile(retryCount + 1);
			}
		}

		const msg = res?.response?.data?.message || 'Failed to get user profile';
		errorMsg = msg;
		// console.log('getUserProfile: Error', { msg });
		return msg;
	} catch (err: any) {
		const msg = err?.message || 'Failed to get user profile';
		errorMsg = msg;
		// console.log('getUserProfile: Error Catch', { err, msg });
		return msg;
	} finally {
		setLoading(false);
		// console.log('getUserProfile: Complete');
		// if (errorMsg.trim() !== '') {
		// Toast.show(ToastError('Oops!', errorMsg));
		// }
	}
}

async function updateUserProfile(data: any, retryCount = 0) {
	const { setLoading, profile, setProfile, tokens, currentRole, setCurrentRole, setUserRoles } =
		useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	const payload = {
		profile,
		data,
		token: tokens?.accessToken || '',
	};

	// console.log('updateUserProfile: Start', { payload });

	try {
		const res: any = await AuthHTTP.updateUser(payload);
		// console.log('updateUserProfile: Response', { res });
		if (res.status === 200 || res.status === 201) {
			setProfile(res.data);
			setUserRoles(res.data.userRoles);
			if (currentRole) {
				const updatedRole = res.data.userRoles.find((role: UsersOrgRole) => role.id === currentRole.id);
				if (updatedRole) {
					setCurrentRole(updatedRole);
				}
			}
			// console.log('updateUserProfile: Success', { res });
			return null;
		}

		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				await delay(timeout.auth);
				return updateUserProfile(data, retryCount + 1);
			}
		}

		const msg = res?.response?.data?.message || 'Failed to update user profile';
		errorMsg = msg;
		// console.log('updateUserProfile: Error', { msg });
		return msg;
	} catch (err: any) {
		const msg = err?.message || 'Failed to update user profile';
		errorMsg = msg;
		// console.log('updateUserProfile: Error Catch', { err, msg });
		Toast.show(ToastError('Oops!', msg));
		return msg;
	} finally {
		setLoading(false);
		// console.log('updateUserProfile: Complete');
		if (errorMsg && errorMsg.trim() !== '') {
			Toast.show(ToastError('Oops!', errorMsg));
		} else {
			Toast.show(ToastSuccess('Update Successful!'));
		}
	}
}

async function updateUserConnectedEvent(eventConnectedId: string | null, retryCount = 0) {
	const { setConnectedEventLoading, tokens, setProfile, setUserRoles } = useUserStore.getState();
	setConnectedEventLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	const payload = {
		eventConnectedId,
		token: tokens?.accessToken || '',
	};

	// console.log('updateUserConnectedEvent: Start', { payload });
	try {
		const res: any = await AuthHTTP.updateConnectedEvent(payload);
		// console.log('updateUserConnectedEvent: Response', { res });
		if (res.status === 200 || res.status === 201) {
			setProfile(res.data);
			setUserRoles(res.data.userRoles);
			return null;
		}

		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				await delay(timeout.auth);
				return updateUserConnectedEvent(eventConnectedId, retryCount + 1);
			}
		}
		const msg = res?.response?.data?.message;
		errorMsg = msg;
		// console.log('updateUserConnectedEvent: Error', { msg });
		return msg;
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		errorMsg = msg;
		// console.log('updateUserConnectedEvent: Error Catch', { err, msg });
		return msg;
	} finally {
		setConnectedEventLoading(false);
		// console.log('updateUserConnectedEvent: Complete');
		if (errorMsg && errorMsg.trim() !== '') {
			Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

async function updateUserPassword(data: { oldPassword: string; newPassword: string; token: string }, retryCount = 0) {
	const { setLoading } = useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 1;

	if (!data.token) {
		const msg = 'Password update failed';
		Toast.show(ToastError('Oops!', msg));
		return msg;
	}

	try {
		const res: any = await AuthHTTP.updateUserPassword(data);
		// console.log('updateUserPassword: Response', { res });
		if (res.status === 201) {
			Toast.show(ToastSuccess('Password Updated'));
			// console.log('updateUserPassword: Complete');
			return null;
		}

		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				await delay(timeout.auth);
				return updateUserPassword(data, retryCount + 1);
			}
		}

		const msg = res?.response?.data?.message || 'Password update failed';
		errorMsg = msg;
		// console.log('updateUserPassword: Error', { msg });
		return msg;
	} catch (err: any) {
		const msg = err?.message || 'Password update failed';
		errorMsg = msg;
		// console.log('updateUserPassword: Error', { msg });
		return msg;
	} finally {
		setLoading(false);
		if (errorMsg.trim() !== '') {
			Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

async function deleteUser(retryCount = 0) {
	const { setLoading, tokens } = useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	// console.log('deleteUser: Start');

	try {
		const res: any = await AuthHTTP.deleteUser(tokens?.accessToken || '');
		if (res.status === 200) {
			Toast.show(ToastGeneral('User Deleted', "We're sorry to see you go"));

			// console.log('deleteUser: Success');
			return setTimeout(() => {
				resetAllStores();
				return;
			}, timeout.toast);
		}
		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				await delay(timeout.auth);
				return deleteUser(retryCount + 1);
			}

			const defaultMsg = 'Failed to delete user. Please try again.';
			Toast.show(ToastError('Oops!', defaultMsg));
			return;
		}

		const msg = res?.response?.data?.message || 'Failed to delete user. Please try again.';
		errorMsg = msg;
		// console.log('deleteUser: Error', { msg });
		return msg;
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		errorMsg = msg;
		// console.log('deleteUser: Error Catch', { err, msg });
		return msg;
	} finally {
		setLoading(false);
		// console.log('deleteUser: Complete');
		if (errorMsg && errorMsg.trim() !== '') {
			Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

const UserStoreHttp = {
	tryLogin,
	trySignUp,
	tryLogout,
	refreshUser,
	getUserProfile,
	updateUserProfile,
	updateUserConnectedEvent,
	updateUserPassword,
	deleteUser,
};

export default UserStoreHttp;
