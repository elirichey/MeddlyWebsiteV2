// import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { timeout } from '../../config/variables';
import delay from '../../utilities/helpers/delay';
import SupportHttp from '../../utilities/http/support';
import { useSupportStore } from '../stores/useSupportStore';
import UserStoreHttp from './userStoreHttp';
// import { ToastError } from '../../config/toastConfig';

export interface ApiResponse {
	status: number;
	data?: any;
	message?: string;
}

async function getUserOrgRequests(retryCount = 0) {
	const { setUserOrgRequests, setLoadingUserOrgRequests } = useSupportStore.getState();

	setUserOrgRequests([]);
	setLoadingUserOrgRequests(true);

	const maxRetries = 1;

	try {
		const response: ApiResponse = await SupportHttp.getUserOrgRequests();
		if (response.status === 200) {
			setUserOrgRequests(response.data);
			return;
		}

		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getUserOrgRequests(retryCount + 1);
			}
			await UserStoreHttp.tryLogout();
			return;
		}

		// Toast.show(ToastError('Error', 'Get User Org Requests'));
		return;
	} catch (error) {
		// console.log('getUserOrgRequests: Error', error);
		// Toast.show(ToastError('Caught Error', 'Get User Org Requests'));
	} finally {
		setLoadingUserOrgRequests(false);
	}
}

async function deleteUserOrgRequest(id: string, retryCount = 0) {
	const { setLoadingUserOrgRequests } = useSupportStore.getState();

	setLoadingUserOrgRequests(true);

	const maxRetries = 1;

	try {
		const response: ApiResponse = await SupportHttp.deleteUserOrgRequest({ id });
		if (response.status === 200) {
			await getUserOrgRequests();
			await delay(timeout.auth);
			return;
		}

		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return deleteUserOrgRequest(id, retryCount + 1);
			}
			await UserStoreHttp.tryLogout();
			return;
		}

		// Toast.show(ToastError('Error', 'Delete Organization Request'));
		return;
	} catch (error) {
		// console.log('deleteUserOrgRequest: Error', error);
		// Toast.show(ToastError('Caught Error', 'Delete Organization Request'));
	} finally {
		setLoadingUserOrgRequests(false);
	}
}

const SupportStoreHttp = {
	getUserOrgRequests,
	deleteUserOrgRequest,
};

export default SupportStoreHttp;
