jest.mock('../../../utils/http/admin/organization');
jest.mock('../../../utils/http/user/organization');
jest.mock('../../http/userStoreHttp');
jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

import Toast from 'react-native-toast-message';
import OrganizationHttp from '../../../utils/http/admin/organization';
import UserOrganizationHttp from '../../../utils/http/user/organization';
import UserStoreHttp from '../../http/userStoreHttp';
import OrgStoreHttp from '../../http/orgStoreHttp';
import { ToastSuccess, ToastError } from '../../../config/toastConfig';

// Add type for Toast mock
const mockToast = Toast as unknown as { show: jest.Mock };

// Add global type declaration for Jest environment
declare const global: any;

// Mock setTimeout to execute immediately
jest.useFakeTimers();
const originalSetTimeout = global.setTimeout;
global.setTimeout = jest.fn((callback: any, delay: number) => {
	if (delay === 500 || delay === 1200) {
		// timeout.auth or timeout.toast
		// Execute immediately for tests
		callback();
		return {} as any;
	}
	return originalSetTimeout(callback, delay);
});

const mockUserStore = {
	tokens: { accessToken: 'token', refreshToken: 'refreshToken' },
};

const mockOrgStore = {
	loadingOrg: false,
	setLoadingOrg: jest.fn(),
	setViewOrg: jest.fn(),
	setOrgError: jest.fn(),
};

// Mock the stores
jest.mock('../../stores/useUserStore', () => ({
	useUserStore: {
		getState: jest.fn().mockReturnValue(mockUserStore),
	},
}));

jest.mock('../../stores/useOrgStore', () => ({
	useOrgStore: {
		getState: jest.fn().mockReturnValue(mockOrgStore),
	},
}));

describe('OrgStoreHttp', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Reset the mock return values
		const useUserStore = require('../../stores/useUserStore').useUserStore;
		const useOrgStore = require('../../stores/useOrgStore').useOrgStore;

		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);
		(useOrgStore.getState as jest.Mock).mockReturnValue(mockOrgStore);
	});

	describe('getOrganization', () => {
		it('should get organization successfully', async () => {
			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Test Org' },
			};
			(OrganizationHttp.getOrgData as jest.Mock).mockResolvedValue(mockResponse);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(OrganizationHttp.getOrgData).toHaveBeenCalledWith({
				token: 'token',
				id: '123',
			});
			expect(mockOrgStore.setViewOrg).toHaveBeenCalledWith({ id: '123', name: 'Test Org' });
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toEqual({ id: '123', name: 'Test Org' });
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(OrganizationHttp.getOrgData as jest.Mock)
				.mockResolvedValueOnce(mockResponse)
				.mockResolvedValueOnce({ status: 200, data: { id: '123', name: 'Test Org' } });
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(OrganizationHttp.getOrgData).toHaveBeenCalledTimes(2);
			expect(mockOrgStore.setViewOrg).toHaveBeenCalledWith({ id: '123', name: 'Test Org' });
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toEqual({ id: '123', name: 'Test Org' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(OrganizationHttp.getOrgData as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
			(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should handle other errors with toast message', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};
			(OrganizationHttp.getOrgData as jest.Mock).mockResolvedValue(mockResponse);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get organization'));
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should handle caught errors', async () => {
			(OrganizationHttp.getOrgData as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should handle missing access token', async () => {
			const useUserStore = require('../../stores/useUserStore').useUserStore;
			(useUserStore.getState as jest.Mock).mockReturnValue({
				tokens: { accessToken: '', refreshToken: 'refreshToken' },
			});

			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Test Org' },
			};
			(OrganizationHttp.getOrgData as jest.Mock).mockResolvedValue(mockResponse);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(OrganizationHttp.getOrgData).toHaveBeenCalledWith({
				token: '',
				id: '123',
			});
			expect(mockOrgStore.setViewOrg).toHaveBeenCalledWith({ id: '123', name: 'Test Org' });
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toEqual({ id: '123', name: 'Test Org' });
		});

		it('should not set loading to true if already loading', async () => {
			const useOrgStore = require('../../stores/useOrgStore').useOrgStore;
			(useOrgStore.getState as jest.Mock).mockReturnValue({
				...mockOrgStore,
				loadingOrg: true,
			});

			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Test Org' },
			};
			(OrganizationHttp.getOrgData as jest.Mock).mockResolvedValue(mockResponse);

			const result = await OrgStoreHttp.getOrganization('123');

			expect(mockOrgStore.setLoadingOrg).not.toHaveBeenCalledWith(true);
			expect(mockOrgStore.setViewOrg).toHaveBeenCalledWith({ id: '123', name: 'Test Org' });
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
			expect(result).toEqual({ id: '123', name: 'Test Org' });
		});
	});

	describe('updateOrganization', () => {
		const mockOrgData = {
			name: 'Updated Org',
			description: 'Updated description',
		};

		it('should update organization successfully', async () => {
			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Updated Org' },
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.getUserProfile as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(true);
			expect(OrganizationHttp.updateOrg).toHaveBeenCalledWith({
				id: '123',
				data: mockOrgData,
				token: 'token',
			});
			expect(UserStoreHttp.getUserProfile).toHaveBeenCalled();
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Organization Updated'));
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should handle 201 status as success', async () => {
			const mockResponse = {
				status: 201,
				data: { id: '123', name: 'Updated Org' },
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.getUserProfile as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(UserStoreHttp.getUserProfile).toHaveBeenCalled();
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Organization Updated'));
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(OrganizationHttp.updateOrg as jest.Mock)
				.mockResolvedValueOnce(mockResponse)
				.mockResolvedValueOnce({ status: 200, data: { id: '123', name: 'Updated Org' } });
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
			(UserStoreHttp.getUserProfile as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(OrganizationHttp.updateOrg).toHaveBeenCalledTimes(2);
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Organization Updated'));
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
			(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should handle other errors with response message', async () => {
			const mockResponse = {
				status: 400,
				response: { data: { message: 'Invalid organization data' } },
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(mockToast.show).toHaveBeenCalledWith(
				ToastError('Oops!', 'Failed to update organization: Invalid organization data'),
			);
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should handle caught errors', async () => {
			(OrganizationHttp.updateOrg as jest.Mock).mockRejectedValue(new Error('Network error'));

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should not set loading if already loading', async () => {
			const useOrgStore = require('../../stores/useOrgStore').useOrgStore;
			(useOrgStore.getState as jest.Mock).mockReturnValue({
				...mockOrgStore,
				loadingOrg: true,
			});

			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Updated Org' },
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.getUserProfile as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(mockOrgStore.setLoadingOrg).not.toHaveBeenCalledWith(true);
			expect(mockOrgStore.setLoadingOrg).toHaveBeenCalledWith(false);
		});

		it('should handle missing access token', async () => {
			const useUserStore = require('../../stores/useUserStore').useUserStore;
			(useUserStore.getState as jest.Mock).mockReturnValue({
				tokens: { accessToken: '', refreshToken: 'refreshToken' },
			});

			const mockResponse = {
				status: 200,
				data: { id: '123', name: 'Updated Org' },
			};
			(OrganizationHttp.updateOrg as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.getUserProfile as jest.Mock).mockResolvedValue(undefined);

			await OrgStoreHttp.updateOrganization('123', mockOrgData);

			expect(OrganizationHttp.updateOrg).toHaveBeenCalledWith({
				id: '123',
				data: mockOrgData,
				token: '',
			});
		});
	});

	describe('OrgStoreHttp object', () => {
		it('should export getOrganization and updateOrganization functions', () => {
			expect(OrgStoreHttp.getOrganization).toBeDefined();
			expect(OrgStoreHttp.updateOrganization).toBeDefined();
			expect(typeof OrgStoreHttp.getOrganization).toBe('function');
			expect(typeof OrgStoreHttp.updateOrganization).toBe('function');
		});
	});
});
