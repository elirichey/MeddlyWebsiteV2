// Mock dependencies before importing
jest.mock('../../../utils/http/admin/venues');
jest.mock('../../http/userStoreHttp');
jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

import Toast from 'react-native-toast-message';
import VenuesHttp from '../../../utils/http/admin/venues';
import UserStoreHttp from '../../http/userStoreHttp';
import VenueStoreHttp from '../../http/venueStoreHttp';
import { ToastError } from '../../../config/toastConfig';

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

const mockVenueStore = {
	loadingVenues: false,
	setSearchVenues: jest.fn(),
	setLoadingVenues: jest.fn(),
	setVenuesError: jest.fn(),
};

// Mock the stores
jest.mock('../../stores/useUserStore', () => ({
	useUserStore: {
		getState: jest.fn().mockReturnValue(mockUserStore),
	},
}));

jest.mock('../../stores/useVenueStore', () => ({
	useVenueStore: {
		getState: jest.fn().mockReturnValue(mockVenueStore),
	},
}));

describe('VenueStoreHttp', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Reset the mock return values
		const useUserStore = require('../../stores/useUserStore').useUserStore;
		const useVenueStore = require('../../stores/useVenueStore').useVenueStore;

		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);
		(useVenueStore.getState as jest.Mock).mockReturnValue(mockVenueStore);
	});

	describe('searchVenues', () => {
		it('should search venues successfully', async () => {
			const mockVenues = [
				{ id: '1', name: 'Venue 1', city: 'City 1' },
				{ id: '2', name: 'Venue 2', city: 'City 2' },
			];

			const mockResponse = {
				status: 200,
				data: mockVenues,
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			const result = await VenueStoreHttp.searchVenues('test venue');

			expect(VenuesHttp.searchVenues).toHaveBeenCalledWith('test%20venue', 'token');
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(true);
			expect(mockVenueStore.setSearchVenues).toHaveBeenCalledWith(mockVenues);
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
			expect(mockVenueStore.setVenuesError).toHaveBeenCalledWith(null);
			expect(result).toEqual(mockVenues);
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			});
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);

			const result = await VenueStoreHttp.searchVenues('test venue');

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(VenuesHttp.searchVenues).toHaveBeenCalledTimes(2);
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
			expect(result).toEqual([{ id: '1', name: 'Venue 1' }]);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
			(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

			const result = await VenueStoreHttp.searchVenues('test venue');

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should handle other errors with toast message', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			const result = await VenueStoreHttp.searchVenues('test venue');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to search venues'));
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should handle caught errors', async () => {
			(VenuesHttp.searchVenues as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await VenueStoreHttp.searchVenues('test venue');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'An unexpected error occurred'));
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
			expect(result).toBeUndefined();
		});

		it('should not set loading state if already loading', async () => {
			const useVenueStore = require('../../stores/useVenueStore').useVenueStore;
			(useVenueStore.getState as jest.Mock).mockReturnValue({
				...mockVenueStore,
				loadingVenues: true,
			});

			const mockResponse = {
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			await VenueStoreHttp.searchVenues('test venue');

			expect(mockVenueStore.setLoadingVenues).not.toHaveBeenCalledWith(true);
			expect(mockVenueStore.setLoadingVenues).toHaveBeenCalledWith(false);
		});

		it('should clear error on first call', async () => {
			const mockResponse = {
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			await VenueStoreHttp.searchVenues('test venue');

			expect(mockVenueStore.setVenuesError).toHaveBeenCalledWith(null);
		});

		it('should not clear error on retry', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			});
			(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);

			await VenueStoreHttp.searchVenues('test venue', 1); // Start with retry count 1

			expect(mockVenueStore.setVenuesError).not.toHaveBeenCalled();
		});

		it('should handle missing access token', async () => {
			const useUserStore = require('../../stores/useUserStore').useUserStore;
			(useUserStore.getState as jest.Mock).mockReturnValue({
				tokens: { accessToken: '', refreshToken: 'refreshToken' },
			});

			const mockResponse = {
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			await VenueStoreHttp.searchVenues('test venue');

			expect(VenuesHttp.searchVenues).toHaveBeenCalledWith('test%20venue', '');
		});

		it('should handle null tokens', async () => {
			const useUserStore = require('../../stores/useUserStore').useUserStore;
			(useUserStore.getState as jest.Mock).mockReturnValue({
				tokens: null,
			});

			const mockResponse = {
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			await VenueStoreHttp.searchVenues('test venue');

			expect(VenuesHttp.searchVenues).toHaveBeenCalledWith('test%20venue', '');
		});

		it('should properly encode search terms', async () => {
			const mockResponse = {
				status: 200,
				data: [{ id: '1', name: 'Venue 1' }],
			};
			(VenuesHttp.searchVenues as jest.Mock).mockResolvedValue(mockResponse);

			await VenueStoreHttp.searchVenues('test & venue with spaces');

			expect(VenuesHttp.searchVenues).toHaveBeenCalledWith('test%20%26%20venue%20with%20spaces', 'token');
		});
	});

	describe('VenueStoreHttp object', () => {
		it('should export searchVenues function', () => {
			expect(VenueStoreHttp.searchVenues).toBeDefined();
			expect(typeof VenueStoreHttp.searchVenues).toBe('function');
		});
	});
});
