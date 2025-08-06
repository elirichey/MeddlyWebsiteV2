// Mock the stores first, before any imports
jest.mock('../../stores/useSupportStore', () => ({
	useSupportStore: {
		getState: jest.fn(),
	},
}));

jest.mock('../../stores/useUserStore', () => ({
	useUserStore: {
		getState: jest.fn(),
	},
}));

// Mock the HTTP modules
jest.mock('../../../utils/http/support');
jest.mock('../../http/userStoreHttp', () => ({
	refreshUser: jest.fn(),
	tryLogout: jest.fn(),
}));

// Mock Toast with correct import path
jest.mock('react-native-toast-message/lib/src/Toast', () => ({
	Toast: {
		show: jest.fn(),
	},
}));

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import SupportHttp from '../../../utils/http/support';
import UserStoreHttp from '../../http/userStoreHttp';
import SupportStoreHttp from '../../http/supportStoreHttp';
import { ToastError } from '../../../config/toastConfig';
import { useSupportStore } from '../../stores/useSupportStore';
import { useUserStore } from '../../stores/useUserStore';

// Add type for Toast mock
const mockToast = Toast as unknown as { show: jest.Mock };

// Add global type declaration for Jest environment
declare const global: any;

// Mock setTimeout to execute immediately
jest.useFakeTimers();
const originalSetTimeout = global.setTimeout;
global.setTimeout = jest.fn((callback: any, delay: number) => {
	if (delay === 500 || delay === 1200 || delay === 3000) {
		// timeout.auth, timeout.toast, or other common delays
		// Execute immediately for tests
		callback();
		return {} as any;
	}
	return originalSetTimeout(callback, delay);
});

const mockSupportStore = {
	setUserOrgRequests: jest.fn(),
	setLoadingUserOrgRequests: jest.fn(),
};

const mockUserStore = {
	tokens: { accessToken: 'test-access-token', refreshToken: 'test-refresh-token' },
};

describe('SupportStoreHttp', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Set up the store mocks
		(useSupportStore.getState as jest.Mock).mockReturnValue(mockSupportStore);
		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);

		// Set up default SupportHttp mocks
		(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue({
			status: 200,
			data: [{ id: '1', name: 'Test Org Request' }],
		});
		(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue({
			status: 200,
		});

		// Set up default UserStoreHttp mocks
		(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
		(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

		// Reset the mock functions
		mockSupportStore.setUserOrgRequests.mockClear();
		mockSupportStore.setLoadingUserOrgRequests.mockClear();
		mockToast.show.mockClear();
	});

	describe('getUserOrgRequests', () => {
		it('should successfully fetch user org requests', async () => {
			const mockResponse = {
				status: 200,
				data: [
					{ id: '1', name: 'Test Org Request 1' },
					{ id: '2', name: 'Test Org Request 2' },
				],
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith([]);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(true);
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith(mockResponse.data);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error with retry and refresh token', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock)
				.mockResolvedValueOnce(mockResponse) // First call returns 403
				.mockResolvedValueOnce({ status: 200, data: [{ id: '1', name: 'Test Org Request' }] }); // Second call succeeds

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith([{ id: '1', name: 'Test Org Request' }]);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error with max retries exceeded and logout', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(2); // Initial call + 1 retry
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle non-403 error and show toast', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Get User Org Requests'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle network error and show toast', async () => {
			const mockError = new Error('Network error');

			(SupportHttp.getUserOrgRequests as jest.Mock).mockRejectedValue(mockError);

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Caught Error', 'Get User Org Requests'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle missing access token', async () => {
			const mockUserStoreWithoutToken = {
				tokens: {},
			};

			// Update the mock for this specific test
			(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStoreWithoutToken);

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle empty response data', async () => {
			const mockResponse = {
				status: 200,
				data: [],
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith([]);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle response without data property', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith(undefined);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error without message property', async () => {
			const mockResponse = {
				status: 403,
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(1); // No retry since message doesn't include '403'
			expect(UserStoreHttp.refreshUser).not.toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).not.toHaveBeenCalled();
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Get User Org Requests'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle refreshUser throwing an error', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.refreshUser as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(1); // No retry since refreshUser throws error
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).not.toHaveBeenCalled(); // Not called because error is caught by outer try-catch
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Caught Error', 'Get User Org Requests'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle tryLogout throwing an error', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.tryLogout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(2); // Initial call + 1 retry
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle custom retry count parameter', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.getUserOrgRequests as jest.Mock).mockResolvedValue(mockResponse);

			// Call with retry count of 1 (max retries already reached)
			await SupportStoreHttp.getUserOrgRequests(1);

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(1); // No retry since already at max
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle successful retry after refresh', async () => {
			const mockResponse403 = {
				status: 403,
				message: '403 Forbidden',
			};

			const mockResponse200 = {
				status: 200,
				data: [{ id: '1', name: 'Test Org Request' }],
			};

			(SupportHttp.getUserOrgRequests as jest.Mock)
				.mockResolvedValueOnce(mockResponse403) // First call returns 403
				.mockResolvedValueOnce(mockResponse200); // Second call succeeds

			await SupportStoreHttp.getUserOrgRequests();

			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockSupportStore.setUserOrgRequests).toHaveBeenCalledWith(mockResponse200.data);
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});
	});

	describe('deleteUserOrgRequest', () => {
		it('should successfully delete user org request', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(true);
			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: 'test-id',
			});
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error with retry and refresh token', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock)
				.mockResolvedValueOnce(mockResponse) // First call returns 403
				.mockResolvedValueOnce({ status: 200 }); // Second call succeeds

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error with max retries exceeded and logout', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(2); // Initial call + 1 retry
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle non-403 error and show toast', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: 'test-id',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Delete Organization Request'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle network error and show toast', async () => {
			const mockError = new Error('Network error');

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockRejectedValue(mockError);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: 'test-id',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Caught Error', 'Delete Organization Request'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle missing access token', async () => {
			const mockUserStoreWithoutToken = {
				tokens: {},
			};

			// Update the mock for this specific test
			(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStoreWithoutToken);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: '',
				id: 'test-id',
			});
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error without message property', async () => {
			const mockResponse = {
				status: 403,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(1); // No retry since message doesn't include '403'
			expect(UserStoreHttp.refreshUser).not.toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).not.toHaveBeenCalled();
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Delete Organization Request'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle refreshUser throwing an error', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.refreshUser as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(1); // No retry since refreshUser throws error
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).not.toHaveBeenCalled(); // Not called because error is caught by outer try-catch
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Caught Error', 'Delete Organization Request'));
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle tryLogout throwing an error', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.tryLogout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(2); // Initial call + 1 retry
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle custom retry count parameter', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Call with retry count of 1 (max retries already reached)
			await SupportStoreHttp.deleteUserOrgRequest('test-id', 1);

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(1); // No retry since already at max
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle successful retry after refresh', async () => {
			const mockResponse403 = {
				status: 403,
				message: '403 Forbidden',
			};

			const mockResponse200 = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock)
				.mockResolvedValueOnce(mockResponse403) // First call returns 403
				.mockResolvedValueOnce(mockResponse200); // Second call succeeds

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle different organization request IDs', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('different-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: 'different-id',
			});
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle getUserOrgRequests throwing an error after successful delete', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);
			(SupportHttp.getUserOrgRequests as jest.Mock).mockRejectedValue(new Error('Failed to refresh'));

			await SupportStoreHttp.deleteUserOrgRequest('test-id');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: 'test-id',
			});
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle empty string ID', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest('');

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: '',
			});
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});

		it('should handle null ID', async () => {
			const mockResponse = {
				status: 200,
			};

			(SupportHttp.deleteUserOrgRequest as jest.Mock).mockResolvedValue(mockResponse);

			await SupportStoreHttp.deleteUserOrgRequest(null as any);

			expect(SupportHttp.deleteUserOrgRequest).toHaveBeenCalledWith({
				token: 'test-access-token',
				id: null,
			});
			expect(SupportHttp.getUserOrgRequests).toHaveBeenCalledWith('test-access-token');
			expect(mockSupportStore.setLoadingUserOrgRequests).toHaveBeenCalledWith(false);
		});
	});

	describe('SupportStoreHttp object', () => {
		it('should export getUserOrgRequests function', () => {
			expect(SupportStoreHttp.getUserOrgRequests).toBeDefined();
			expect(typeof SupportStoreHttp.getUserOrgRequests).toBe('function');
		});

		it('should export deleteUserOrgRequest function', () => {
			expect(SupportStoreHttp.deleteUserOrgRequest).toBeDefined();
			expect(typeof SupportStoreHttp.deleteUserOrgRequest).toBe('function');
		});
	});
});
