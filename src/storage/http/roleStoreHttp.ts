// import Toast from 'react-native-toast-message';
// import { ToastError } from '../../config/toastConfig';
import { timeout } from '../../config/variables';
import delay from '../../utilities/helpers/delay';
import OrgRolesHttp from '../../utilities/http/admin/roles';
import { useRolesStore } from '../stores/useRolesStore';
import { useUserStore } from '../stores/useUserStore';
import UserStoreHttp from './userStoreHttp';

export interface ApiResponse {
	status: number;
	data?: any;
	message?: string;
}

export async function getOrgRoles(retryCount = 0) {
	const { setLoadingRoles, setOrgRoles, setOrgTotalRoles, setError, orgRolesCurrentPage } = useRolesStore.getState();
	const { tokens, currentRole } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingRoles(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		id: currentRole?.organization?.id || '',
		token: accessToken,
		page: orgRolesCurrentPage,
	};

	try {
		const response: ApiResponse = await OrgRolesHttp.getOrgRoles(data);
		if (response.status === 200) {
			const order = ['admin', 'editor', 'contributor'];
			const orderedData = [...response.data.userRoles].sort(
				(a, b) => order.indexOf(a.role.toLowerCase()) - order.indexOf(b.role.toLowerCase()),
			);

			setOrgRoles(orderedData);
			setOrgTotalRoles(response.data.totalUserRoles);
			return orderedData;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgRoles(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get roles';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingRoles(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getOrgRole(id: string, retryCount = 0) {
	const { setLoadingRole, setViewRole, setError } = useRolesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingRole(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = { id, token: accessToken };

	try {
		const response: ApiResponse = await OrgRolesHttp.getOrgRole(data);
		await delay(timeout.auth);
		if (response.status === 200) {
			setViewRole(response.data);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgRole(id, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get role';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingRole(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getOrgManagerRoles(retryCount = 0) {
	const { setLoadingRoles, setOrgRoles, setOrgTotalRoles, setError, orgRolesCurrentPage } = useRolesStore.getState();
	const { tokens, currentRole } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingRoles(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = { id: currentRole?.organization?.id || '', token: accessToken, page: orgRolesCurrentPage };

	try {
		const response: ApiResponse = await OrgRolesHttp.getOrgEventManagers(data);
		await delay(timeout.auth);
		if (response.status === 200) {
			const order = ['admin', 'editor'];
			const orderedData = [...response.data.userRoles].sort(
				(a, b) => order.indexOf(a.role.toLowerCase()) - order.indexOf(b.role.toLowerCase()),
			);

			setOrgRoles(orderedData);
			setOrgTotalRoles(response.data.totalUserRoles);
			return null;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgManagerRoles(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		}

		setError(response);
		errorMsg = 'Failed to get manager roles';
		return;
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingRoles(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function createOrgRole(data: any, retryCount = 0) {
	const { setError, setLoadingRole, loadingRole } = useRolesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	if (!loadingRole) setLoadingRole(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const payload = { id: data?.organizationId, payload: data, token: accessToken };

	try {
		const response: ApiResponse = await OrgRolesHttp.createUserRole(payload);
		await delay(timeout.auth);
		if (response.status === 200 || response.status === 201) {
			return getOrgRoles();
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return createOrgRole(data, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		}
		setError(response);
		errorMsg = 'Failed to create role';
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}

		setLoadingRole(false);
	}
}

export async function updateOrgRole(data: any, retryCount = 0) {
	const { setError } = useRolesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	const { loadingRole, setLoadingRole } = useRolesStore.getState();

	if (!loadingRole) setLoadingRole(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const id = data?.id;
	if (id) data.id = undefined;

	const payload = { id, payload: data, token: accessToken };

	try {
		const response: ApiResponse = await OrgRolesHttp.updateUserRole(payload);
		await delay(timeout.auth);
		if (response.status === 200) {
			await getOrgRoles();
			return;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateOrgRole(data, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to update role';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}

		setLoadingRole(false);
	}
}

export async function deleteOrgRole(id: string, retryCount = 0) {
	const { setError } = useRolesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	const { loadingRole, setLoadingRole } = useRolesStore.getState();

	if (!loadingRole) setLoadingRole(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = { id, token: accessToken };

	try {
		const response: ApiResponse = await OrgRolesHttp.deleteUserRole(data);
		await delay(timeout.auth);
		if (response.status === 200) {
			return getOrgRoles();
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return deleteOrgRole(id, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to delete role';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingRole(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

const RoleStoreHttp = {
	getOrgRoles,
	getOrgRole,
	getOrgManagerRoles,
	createOrgRole,
	updateOrgRole,
	deleteOrgRole,
};

export default RoleStoreHttp;
