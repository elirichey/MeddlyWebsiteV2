import Toast from 'react-native-toast-message';
import { ToastError, ToastSuccess } from '../../config/toastConfig';
import OrganizationHttp from '../../utils/http/admin/organization';
import UserStoreHttp from './userStoreHttp';
import { useUserStore } from '../stores/useUserStore';
import { useOrgStore } from '../stores/useOrgStore';
import { timeout } from '../../config/variables';
import delay from '../../utils/helpers/delay';

export async function getOrganization(id: string, retryCount = 0) {
	const { tokens } = useUserStore.getState();
	const { setViewOrg, loadingOrg, setLoadingOrg } = useOrgStore.getState();
	const accessToken = tokens?.accessToken || '';

	const maxRetries = 1;

	if (!loadingOrg) setLoadingOrg(true);

	try {
		const response = await OrganizationHttp.getOrgData({ id, token: accessToken });
		if (response.status === 200) {
			await delay(timeout.auth);
			setViewOrg(response.data);
			return response.data;
		}
		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrganization(id, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			return;
		}

		Toast.show(ToastError('Oops!', 'Failed to get organization'));
		// console.log('getOrganization: Error 1', { response });
		return;
	} catch (err) {
		Toast.show(ToastError('An unexpected error occurred'));
		// console.log('getOrganization: Error', { err });
		return;
	} finally {
		setLoadingOrg(false);
	}
}

export async function updateOrganization(id: string, data: any, retryCount = 0) {
	const { tokens } = useUserStore.getState();
	const { loadingOrg, setLoadingOrg } = useOrgStore.getState();
	if (!loadingOrg) setLoadingOrg(true);

	const accessToken = tokens?.accessToken || '';
	const maxRetries = 1;

	const payload = {
		id,
		data,
		token: accessToken,
	};

	try {
		const response = await OrganizationHttp.updateOrg(payload);

		if (response && (response.status === 200 || response.status === 201)) {
			// console.log('updateOrganization: Success', { response });
			await UserStoreHttp.getUserProfile();
			Toast.show(ToastSuccess('Success', 'Organization Updated'));
			await getOrganization(id);
			setLoadingOrg(false);
			return;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateOrganization(id, data, retryCount + 1);
			}

			setLoadingOrg(false);
			await UserStoreHttp.tryLogout();
			setLoadingOrg(false);
			return;
		}

		// console.log('updateOrganization: Error 1', { response });
		Toast.show(ToastError('Oops!', `Failed to update organization: ${response.response.data.message}`));
		setLoadingOrg(false);
		return;
	} catch (e) {
		// console.log('updateOrganization: Error 2', { e });
		Toast.show(ToastError('An unexpected error occurred'));
		setLoadingOrg(false);
		return;
	}
}

const OrgStoreHttp = {
	getOrganization,
	updateOrganization,
};

export default OrgStoreHttp;
