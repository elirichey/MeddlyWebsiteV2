import AuthHTTP from '@/utilities/http/auth';
import { deleteCookie, setCookie } from 'cookies-next/client';
import type { AuthCredentials, NewUserCredentials } from '../../interfaces/Auth';
import type { UsersOrgRole } from '../../interfaces/UserRoles';
import { useEventStore } from '../stores/useEventStore';
import { useMediaStore } from '../stores/useMediaStore';
import { usePackagesStore } from '../stores/usePackagesStore';
import { useRolesStore } from '../stores/useRolesStore';
import { useSequencesStore } from '../stores/useSequencesStore';
import { useServerStore } from '../stores/useServerStore';
import { useSnackbarStore } from '../stores/useSnackbarStore';
import { useSocketStore } from '../stores/useSocketStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useUserStore } from '../stores/useUserStore';
import delay from '../../utilities/helpers/delay';
import { timeout } from '../../config/variables';
import { getCookieValue } from '../cookies';

async function tryLogin(data: AuthCredentials): Promise<boolean> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setLoading, setError } = useUserStore.getState();

	setLoading(true);
	setError(null);

	try {
		const response = await AuthHTTP.login(data);

		console.log('tryLogin: Response', { response });
		if (response.status === 201 && response.data) {
			console.log('tryLogin: Response 201', { response });
			await UserStoreHttp.getUserProfile();
			console.log('tryLogin: User Profile Done');
			// setSnackbar({ title: 'Success', description: 'Login Successful', type: 'success', duration: 3000, show: true });
			return true;
		}
		const msg = response?.errors?.[0]?.message || 'Incorrect credentials';
		setError(msg);
		setSnackbar({
			title: 'Error',
			description: msg,
			type: 'error',
			duration: 3000,
			show: true,
		});
		console.log('tryLogin: Error', { msg });
		return false;
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		setError(msg);
		setSnackbar({
			title: 'Error',
			description: msg,
			type: 'error',
			duration: 3000,
			show: true,
		});
		console.log('tryLogin: Error Catch', { msg });
		return false;
	} finally {
		await delay(timeout.auth);
		setLoading(false);
	}
}

async function trySignUp(data: NewUserCredentials) {
	const { setLoading, setError } = useUserStore.getState();
	setLoading(true);
	setError(null);

	let errorMsg = '';

	// console.log('trySignUp: Start', { data });
	try {
		const res: any = await AuthHTTP.registerNewUser(data);
		if (res.status === 201 && res.data) {
			await UserStoreHttp.getUserProfile();
		} else {
			const msg = res?.response?.data?.message;
			// setError(msg);
			errorMsg = msg;
			// console.log('trySignUp: Error 1', { err: res, msg });
			return msg || 'Error';
		}
	} catch (err: any) {
		const msg = err?.message || 'Caught Error';
		// setError(msg);
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
	deleteCookie('profile');
	deleteCookie('roles');
	deleteCookie('currentRole');
	deleteCookie('accessToken');
	deleteCookie('refreshToken');

	const { resetEvents } = useEventStore.getState();
	const { resetMedia } = useMediaStore.getState();
	const { resetPackages } = usePackagesStore.getState();
	const { resetRoles } = useRolesStore.getState();
	const { resetSequences } = useSequencesStore.getState();
	const { resetServer } = useServerStore.getState();
	const { resetSocket } = useSocketStore.getState();
	const { resetTheme } = useThemeStore.getState();

	// console.log('resetAllStores');

	resetEvents();
	resetMedia();
	resetPackages();
	resetRoles();
	resetSequences();
	resetServer();
	resetSocket();
	resetTheme();
	resetUserStore();
}

async function tryLogout(): Promise<void> {
	const { loading, setLoading } = useUserStore.getState();

	if (!loading) setLoading(true);
	let errorMsg = '';
	let logoutSuccessful = false;

	// console.log('tryLogout: Start', { hasAccessToken: !!accessToken, accessTokenLength: accessToken.length });

	try {
		// Only attempt server logout if we have a valid access token
		const res: any = await AuthHTTP.signOut();
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
	await delay(100);

	try {
		const res: any = await AuthHTTP.refreshUser();
		// console.log('refreshUser: Response', { res });

		// Check if response contains error data despite 201 status
		if (res?.status === 201) {
			// Check if the response contains a Prisma error despite 201 status
			if (res.data?.name === 'PrismaClientKnownRequestError') {
				// console.log('refreshUser: Prisma error in response despite 201 status', { error: res.data });
				const msg = 'Database error during token refresh';
				await tryLogout();
				return;
			}

			// Check if the response has the expected token structure
			if (res.data?.accessToken && res.data?.refreshToken) {
				console.log('refreshUser: Success');
				return;
			}

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
	const { setLoading } = useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	console.log('getUserProfile: Start', { retryCount });
	try {
		const res: any = await AuthHTTP.userGetSelf();
		console.log('getUserProfile: Response', { res });
		if ((res?.status === 200 || res?.status === 201) && res?.data) {
			console.log('getUserProfile: Done');
			return null;
		}
		if (res?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await refreshUser();
				// await delay(timeout.auth);
				await getUserProfile(retryCount + 1);
				return;
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
		await delay(timeout.auth);
		setLoading(false);
		// console.log('getUserProfile: Complete');
		// if (errorMsg.trim() !== '') {
		// Toast.show(ToastError('Oops!', errorMsg));
		// }
	}
}

async function updateUserProfile(data: any, retryCount = 0) {
	const { setLoading } = useUserStore.getState();
	setLoading(true);

	const profileCookie = getCookieValue('profile');
	const currentRoleCookie = getCookieValue('currentRole');
	const profile = profileCookie ? JSON.parse(profileCookie) : null;
	const currentRole = currentRoleCookie ? JSON.parse(currentRoleCookie) : null;

	let errorMsg = '';
	const maxRetries = 3;

	const payload = {
		profile,
		data,
	};

	// console.log('updateUserProfile: Start', { payload });

	try {
		const res: any = await AuthHTTP.updateUser(payload);
		// console.log('updateUserProfile: Response', { res });
		if (res.status === 200 || res.status === 201) {
			if (currentRole) {
				const updatedRole = res.data.userRoles.find((role: UsersOrgRole) => role.id === currentRole.id);
				if (updatedRole) {
					setCookie('currentRole', updatedRole);
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
		// Toast.show(ToastError('Oops!', msg));
		return msg;
	} finally {
		setLoading(false);
		// console.log('updateUserProfile: Complete');
		if (errorMsg && errorMsg.trim() !== '') {
			// Toast.show(ToastError('Oops!', errorMsg));
		} else {
			// Toast.show(ToastSuccess('Update Successful!'));
		}
	}
}

async function updateUserPassword(data: { oldPassword: string; newPassword: string }, retryCount = 0) {
	const { setLoading } = useUserStore.getState();

	setLoading(true);

	let errorMsg = '';
	const maxRetries = 1;

	try {
		const res: any = await AuthHTTP.updateUserPassword(data);
		// console.log('updateUserPassword: Response', { res });
		if (res.status === 201) {
			// Toast.show(ToastSuccess('Password Updated'));
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
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

async function deleteUser(retryCount = 0) {
	const { setLoading } = useUserStore.getState();
	setLoading(true);

	let errorMsg = '';
	const maxRetries = 3;

	// console.log('deleteUser: Start');

	try {
		const res: any = await AuthHTTP.deleteUser();
		if (res.status === 200) {
			// Toast.show(ToastGeneral('User Deleted', "We're sorry to see you go"));

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
			// Toast.show(ToastError('Oops!', defaultMsg));
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
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

const UserStoreHttp = {
	tryLogin, // Good
	trySignUp, // Should be good
	tryLogout, // Should be good
	refreshUser, // Should be good
	getUserProfile, // Good
	updateUserProfile,
	updateUserPassword,
	deleteUser,
};

export default UserStoreHttp;
