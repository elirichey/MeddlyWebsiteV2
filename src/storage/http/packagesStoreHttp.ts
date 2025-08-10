// import Toast from 'react-native-toast-message';
// import { ToastError, ToastSuccess } from '../../config/toastConfig';
import EventPackageHTTP from '../../utilities/http/admin/event-packages';
import EventPostHTTP from '../../utilities/http/admin/event-posts';
import { timeout } from '../../config/variables';
import { usePackagesStore } from '../stores/usePackagesStore';
import UserStoreHttp from './userStoreHttp';
import delay from '../../utilities/helpers/delay';

export interface ApiResponse {
	status: number;
	data?: any;
	message?: string;
}

export async function getAllEventVideos(eventId: string, retryCount = 0) {
	const { setEventPosts, setEventTotalPosts, setLoadingEventPosts, setError, eventPostsCurrentPage } =
		usePackagesStore.getState();

	setLoadingEventPosts(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		type: 'video',
		page: eventPostsCurrentPage,
	};

	try {
		const response: ApiResponse = await EventPostHTTP.editorGetEventPostsByType(data);
		await delay(timeout.fetch);
		if (response.status === 200) {
			setEventPosts(response.data.posts);
			setEventTotalPosts(response.data.totalPosts);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getAllEventVideos(eventId, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get event videos';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingEventPosts(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getOrgEventPackages(eventId: string, retryCount = 0) {
	const {
		setViewPackage,
		setEventPackages,
		setEventTotalPackages,
		setLoadingEventPackages,
		setError,
		eventPackagesCurrentPage,
	} = usePackagesStore.getState();

	setLoadingEventPackages(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		id: eventId,
		page: eventPackagesCurrentPage,
	};

	try {
		const response: ApiResponse = await EventPackageHTTP.orgGetEventPackages(data);
		// console.log('getOrgEventPackages: Response', response);
		if (response.status === 200) {
			setEventPackages(response.data.packages);
			setEventTotalPackages(response.data.totalPackages);
			const eventPrimaryPackage = response.data.packages.find((x: any) => x.isDefault);
			if (eventPrimaryPackage) {
				setViewPackage(eventPrimaryPackage);
			}
			await getAllEventVideos(eventId);
			return response.data;
		}

		// Check for 403 errors (authentication issues)
		if (response.message?.includes('403') || response.status === 403) {
			// console.log('getOrgEventPackages: 403 error detected, attempting token refresh');
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgEventPackages(eventId, retryCount + 1);
			}
			// console.log('getOrgEventPackages: Max retries reached, logging out');
			await UserStoreHttp.tryLogout();
			return;
		}
		setError(response);
		errorMsg = 'Failed to get event packages';
	} catch (e: any) {
		// console.log('getOrgEventPackages: Exception caught', { error: e, status: e?.response?.status });

		// Check if it's a 403 error in the exception
		if (e?.response?.status === 403) {
			// console.log('getOrgEventPackages: 403 error in exception, attempting token refresh');
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgEventPackages(eventId, retryCount + 1);
			}
			// console.log('getOrgEventPackages: Max retries reached, logging out');
			await UserStoreHttp.tryLogout();
			return;
		}

		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingEventPackages(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getEventPackage(eventId: string, packageId: string, trigger?: () => void, retryCount = 0) {
	const { setViewPackage, setLoadingEventPackages, setError } = usePackagesStore.getState();

	setLoadingEventPackages(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		packageId,
	};

	try {
		const response: ApiResponse = await EventPackageHTTP.getEventPackage(data);
		// console.log('getEventPackage: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200) {
			setViewPackage(response.data);
			if (trigger) await trigger();
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getEventPackage(eventId, packageId, trigger, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get event package';
		}
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError(e);
		errorMsg = 'Error fetching event package';
	} finally {
		setLoadingEventPackages(false);
		if (errorMsg) {
			// Toast.show(ToastError('Error', errorMsg));
		}
	}
}

export async function createEventPackage(payload: any, retryCount = 0) {
	const { setError } = usePackagesStore.getState();

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = { payload };

	try {
		const response: ApiResponse = await EventPackageHTTP.createEventPackage(data);
		// console.log('createEventPackage: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200) {
			// Toast.show(ToastSuccess('Success', 'Package Created'));
			await getOrgEventPackages(payload.eventId);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return createEventPackage(payload, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			// Toast.show(ToastError('Oops!', 'Failed to create package'));
			setError(response);
			errorMsg = 'Error creating package';
		}
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError(e);
		errorMsg = 'Error creating package';
	}
}

export async function updateEventPackage(eventId: string, packageId: string, payload: any, retryCount = 0) {
	const { setError } = usePackagesStore.getState();

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		packageId,
		payload,
	};

	try {
		const response: ApiResponse = await EventPackageHTTP.updateEventPackage(data);
		// console.log('updateEventPackage: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200) {
			// Toast.show(ToastSuccess('Success', 'Package Updated'));
			await getOrgEventPackages(eventId);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateEventPackage(eventId, packageId, payload, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to update package';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		if (errorMsg) {
			// Toast.show(ToastError('Error', errorMsg));
		}
	}
}

export async function updateEventPackageMedia(packageId: string, payload: any, retryCount = 0) {
	const { setError, setLoadingEventPackages, loadingEventPackages } = usePackagesStore.getState();

	if (retryCount === 0) setError(null);
	if (!loadingEventPackages) setLoadingEventPackages(true);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		packageId,
		payload: payload.payload,
	};

	try {
		const response: ApiResponse = await EventPostHTTP.editorBulkAddPosts(data);
		// console.log('updateEventPackageMedia: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200 || response.status === 201) {
			// Toast.show(ToastSuccess('Success', 'Package Media Updated'));

			await Promise.all([getOrgEventPackages(response.data.event.id, 0), getAllEventVideos(response.data.event.id, 0)]);

			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateEventPackageMedia(packageId, payload, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			const responseIsEmpty = !response || (typeof response === 'object' && Object.keys(response).length === 0);
			if (!responseIsEmpty) {
				// Toast.show(ToastError('Oops!', 'Failed to update package media'));
				setError(response);
				errorMsg = 'Error updating package media';
			} else {
				// Toast.show(ToastSuccess('Success', 'Package Media Updated'));
			}
		}
	} catch (e: any) {
		const responseIsEmpty = !e || (typeof e === 'object' && !(e instanceof Error) && Object.keys(e).length === 0);
		if (!responseIsEmpty) {
			// Toast.show(ToastError('An unexpected error occurred'));
			setError(e);
			errorMsg = 'Error updating package media';
		} else {
			// Toast.show(ToastSuccess('Success', 'Package Media Updated'));
		}
	} finally {
		setLoadingEventPackages(false);
	}
}

export async function deleteEventPackage(eventId: string, packageId: string, dismiss?: () => void, retryCount = 0) {
	const { setError } = usePackagesStore.getState();

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		packageId,
	};

	try {
		const response: ApiResponse = await EventPackageHTTP.deleteEventPackage(data);
		// console.log('deleteEventPackage: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200) {
			// Toast.show(ToastSuccess('Success', 'Package Deleted'));
			if (dismiss) await dismiss();
			await getOrgEventPackages(eventId);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return deleteEventPackage(eventId, packageId, dismiss, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			// Toast.show(ToastError('Oops!', 'Failed to delete package'));
			setError(response);
			errorMsg = 'Error deleting package';
		}
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError(e);
		errorMsg = 'Error deleting package';
	}
}

const PackagesStoreHttp = {
	getAllEventVideos,
	getOrgEventPackages,
	getEventPackage,
	createEventPackage,
	updateEventPackage,
	updateEventPackageMedia,
	deleteEventPackage,
};

export default PackagesStoreHttp;
