// Mock modules before importing
jest.mock('../../../utils/http/admin/event-packages');
jest.mock('../../../utils/http/admin/event-posts');
jest.mock('../../http/userStoreHttp');
jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

import Toast from 'react-native-toast-message';
import EventPackageHTTP from '../../../utils/http/admin/event-packages';
import EventPostHTTP from '../../../utils/http/admin/event-posts';
import UserStoreHttp from '../../http/userStoreHttp';
import { ToastSuccess, ToastError } from '../../../config/toastConfig';
import { timeout } from '../../../config/variables';

// Add type for Toast mock
const mockToast = Toast as unknown as { show: jest.Mock };

// Mock the stores before importing the module
const mockPackagesStore = {
	setEventPosts: jest.fn(),
	setEventTotalPosts: jest.fn(),
	setLoadingEventPosts: jest.fn(),
	setViewPackage: jest.fn(),
	setEventPackages: jest.fn(),
	setEventTotalPackages: jest.fn(),
	setLoadingEventPackages: jest.fn(),
	setError: jest.fn(),
	eventPostsCurrentPage: 1,
	eventPackagesCurrentPage: 1,
};

const mockUserStore = {
	tokens: { accessToken: 'test-token', refreshToken: 'test-refresh' },
};

jest.mock('../../stores/usePackagesStore', () => ({
	usePackagesStore: {
		getState: jest.fn(() => mockPackagesStore),
	},
}));

jest.mock('../../stores/useUserStore', () => ({
	useUserStore: {
		getState: jest.fn(() => mockUserStore),
	},
}));

// Add global type declaration for Jest environment
declare const global: any;

// Mock setTimeout to execute immediately for specific delays
const originalSetTimeout = global.setTimeout;
global.setTimeout = jest.fn((callback: any, delay: number) => {
	if (delay === timeout.fetch || delay === timeout.auth || delay === timeout.toast) {
		// Execute immediately for tests
		callback();
		return {} as any;
	}
	return originalSetTimeout(callback, delay);
});

describe('PackagesStoreHttp', () => {
	let PackagesStoreHttp: any;

	beforeEach(() => {
		jest.clearAllMocks();

		// Reset the user store mock to return the correct tokens
		const useUserStore = require('../../stores/useUserStore').useUserStore;
		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);

		// Import the module after all mocks are set up
		PackagesStoreHttp = require('../../http/packagesStoreHttp').default;

		// Mock UserStoreHttp methods
		(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue(undefined);
		(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

		// Mock HTTP responses
		(EventPackageHTTP.orgGetEventPackages as jest.Mock).mockResolvedValue({
			status: 200,
			data: {
				packages: [
					{ id: '1', name: 'Package 1', isDefault: true },
					{ id: '2', name: 'Package 2', isDefault: false },
				],
				totalPackages: 2,
			},
		});
		(EventPackageHTTP.getEventPackage as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '1', name: 'Package 1' },
		});
		(EventPackageHTTP.createEventPackage as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '3', name: 'New Package' },
		});
		(EventPackageHTTP.updateEventPackage as jest.Mock).mockResolvedValue({
			status: 200,
			data: { id: '1', name: 'Updated Package' },
		});
		(EventPackageHTTP.deleteEventPackage as jest.Mock).mockResolvedValue({
			status: 200,
			data: { success: true },
		});
		(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
			status: 200,
			data: {
				posts: [{ id: '1', title: 'Video 1' }],
				totalPosts: 1,
			},
		});
		(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockResolvedValue({
			status: 200,
			data: { success: true, event: { id: 'event-123' } },
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('getAllEventVideos', () => {
		it('should successfully fetch event videos', async () => {
			const eventId = 'event-123';
			const result = await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(mockPackagesStore.setLoadingEventPosts).toHaveBeenCalledWith(true);
			expect(EventPostHTTP.editorGetEventPostsByType).toHaveBeenCalledWith({
				eventId,
				accessToken: 'test-token',
				type: 'video',
				page: 1,
			});
			expect(mockPackagesStore.setEventPosts).toHaveBeenCalledWith([{ id: '1', title: 'Video 1' }]);
			expect(mockPackagesStore.setEventTotalPosts).toHaveBeenCalledWith(1);
			expect(result).toEqual({
				posts: [{ id: '1', title: 'Video 1' }],
				totalPosts: 1,
			});
		});

		it('should handle 403 error and retry once', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: {
						posts: [{ id: '1', title: 'Video 1' }],
						totalPosts: 1,
					},
				});

			const result = await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPostHTTP.editorGetEventPostsByType).toHaveBeenCalledTimes(2);
			expect(result).toEqual({
				posts: [{ id: '1', title: 'Video 1' }],
				totalPosts: 1,
			});
		});

		it('should handle 403 error and logout after max retries', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event videos'));
		});

		it('should handle unexpected errors', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'An unexpected error occurred'));
		});

		it('should handle missing access token', async () => {
			// Temporarily update the mock to return null tokens
			const useUserStore = require('../../stores/useUserStore').useUserStore;
			(useUserStore.getState as jest.Mock).mockReturnValue({
				tokens: null,
			});

			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 200,
				data: { posts: [], totalPosts: 0 },
			});

			await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(EventPostHTTP.editorGetEventPostsByType).toHaveBeenCalledWith({
				eventId,
				accessToken: '',
				type: 'video',
				page: 1,
			});
		});
	});

	describe('getOrgEventPackages', () => {
		it('should successfully fetch event packages', async () => {
			const eventId = 'event-123';
			const result = await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(mockPackagesStore.setLoadingEventPackages).toHaveBeenCalledWith(true);
			expect(EventPackageHTTP.orgGetEventPackages).toHaveBeenCalledWith({
				id: eventId,
				token: 'test-token',
				page: 1,
			});
			expect(mockPackagesStore.setEventPackages).toHaveBeenCalledWith([
				{ id: '1', name: 'Package 1', isDefault: true },
				{ id: '2', name: 'Package 2', isDefault: false },
			]);
			expect(mockPackagesStore.setEventTotalPackages).toHaveBeenCalledWith(2);
			expect(mockPackagesStore.setViewPackage).toHaveBeenCalledWith({
				id: '1',
				name: 'Package 1',
				isDefault: true,
			});
			expect(result).toEqual({
				packages: [
					{ id: '1', name: 'Package 1', isDefault: true },
					{ id: '2', name: 'Package 2', isDefault: false },
				],
				totalPackages: 2,
			});
		});

		it('should handle case when no default package exists', async () => {
			const eventId = 'event-123';
			(EventPackageHTTP.orgGetEventPackages as jest.Mock).mockResolvedValue({
				status: 200,
				data: {
					packages: [
						{ id: '1', name: 'Package 1', isDefault: false },
						{ id: '2', name: 'Package 2', isDefault: false },
					],
					totalPackages: 2,
				},
			});

			await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(mockPackagesStore.setViewPackage).not.toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			const eventId = 'event-123';
			(EventPackageHTTP.orgGetEventPackages as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: {
						packages: [{ id: '1', name: 'Package 1', isDefault: true }],
						totalPackages: 1,
					},
				});

			const result = await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPackageHTTP.orgGetEventPackages).toHaveBeenCalledTimes(2);
			expect(result).toEqual({
				packages: [{ id: '1', name: 'Package 1', isDefault: true }],
				totalPackages: 1,
			});
		});

		it('should handle 403 error and logout after max retries', async () => {
			const eventId = 'event-123';
			(EventPackageHTTP.orgGetEventPackages as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const eventId = 'event-123';
			(EventPackageHTTP.orgGetEventPackages as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event packages'));
		});

		it('should handle unexpected errors', async () => {
			const eventId = 'event-123';
			(EventPackageHTTP.orgGetEventPackages as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.getOrgEventPackages(eventId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'An unexpected error occurred'));
		});
	});

	describe('getEventPackage', () => {
		it('should successfully fetch a single event package', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const trigger = jest.fn();
			const result = await PackagesStoreHttp.getEventPackage(eventId, packageId, trigger);

			expect(mockPackagesStore.setLoadingEventPackages).toHaveBeenCalledWith(true);
			expect(EventPackageHTTP.getEventPackage).toHaveBeenCalledWith({
				eventId,
				packageId,
				token: 'test-token',
			});
			expect(mockPackagesStore.setViewPackage).toHaveBeenCalledWith({
				id: '1',
				name: 'Package 1',
			});
			expect(trigger).toHaveBeenCalled();
			expect(result).toEqual({ id: '1', name: 'Package 1' });
		});

		it('should work without trigger function', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const result = await PackagesStoreHttp.getEventPackage(eventId, packageId);

			expect(mockPackagesStore.setViewPackage).toHaveBeenCalled();
			expect(result).toEqual({ id: '1', name: 'Package 1' });
		});

		it('should handle 403 error and retry once', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.getEventPackage as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { id: '1', name: 'Package 1' },
				});

			const result = await PackagesStoreHttp.getEventPackage(eventId, packageId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPackageHTTP.getEventPackage).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: '1', name: 'Package 1' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.getEventPackage as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.getEventPackage(eventId, packageId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.getEventPackage as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.getEventPackage(eventId, packageId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Failed to get event package'));
		});

		it('should handle unexpected errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.getEventPackage as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.getEventPackage(eventId, packageId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Error fetching event package'));
		});
	});

	describe('createEventPackage', () => {
		it('should successfully create an event package', async () => {
			const payload = { eventId: 'event-123', name: 'New Package' };
			const result = await PackagesStoreHttp.createEventPackage(payload);

			expect(EventPackageHTTP.createEventPackage).toHaveBeenCalledWith({
				payload,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Created'));
			expect(result).toEqual({ id: '3', name: 'New Package' });
		});

		it('should handle 403 error and retry once', async () => {
			const payload = { eventId: 'event-123', name: 'New Package' };
			(EventPackageHTTP.createEventPackage as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { id: '3', name: 'New Package' },
				});

			const result = await PackagesStoreHttp.createEventPackage(payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPackageHTTP.createEventPackage).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: '3', name: 'New Package' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const payload = { eventId: 'event-123', name: 'New Package' };
			(EventPackageHTTP.createEventPackage as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.createEventPackage(payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const payload = { eventId: 'event-123', name: 'New Package' };
			(EventPackageHTTP.createEventPackage as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.createEventPackage(payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to create package'));
		});

		it('should handle unexpected errors', async () => {
			const payload = { eventId: 'event-123', name: 'New Package' };
			(EventPackageHTTP.createEventPackage as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.createEventPackage(payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
		});
	});

	describe('updateEventPackage', () => {
		it('should successfully update an event package', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const payload = { name: 'Updated Package' };
			const result = await PackagesStoreHttp.updateEventPackage(eventId, packageId, payload);

			expect(EventPackageHTTP.updateEventPackage).toHaveBeenCalledWith({
				eventId,
				packageId,
				payload,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Updated'));
			expect(result).toEqual({ id: '1', name: 'Updated Package' });
		});

		it('should handle 403 error and retry once', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const payload = { name: 'Updated Package' };
			(EventPackageHTTP.updateEventPackage as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { id: '1', name: 'Updated Package' },
				});

			const result = await PackagesStoreHttp.updateEventPackage(eventId, packageId, payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPackageHTTP.updateEventPackage).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: '1', name: 'Updated Package' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const payload = { name: 'Updated Package' };
			(EventPackageHTTP.updateEventPackage as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.updateEventPackage(eventId, packageId, payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const payload = { name: 'Updated Package' };
			(EventPackageHTTP.updateEventPackage as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.updateEventPackage(eventId, packageId, payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Failed to update package'));
		});

		it('should handle unexpected errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const payload = { name: 'Updated Package' };
			(EventPackageHTTP.updateEventPackage as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.updateEventPackage(eventId, packageId, payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'An unexpected error occurred'));
		});
	});

	describe('updateEventPackageMedia', () => {
		it('should successfully update package media with status 200', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(EventPostHTTP.editorBulkAddPosts).toHaveBeenCalledWith({
				packageId,
				payload: { media: ['media1', 'media2'] },
				accessToken: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Media Updated'));
			expect(result).toEqual({
				success: true,
				event: { id: 'event-123' },
			});
		});

		it('should successfully update package media with status 201', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					success: true,
					event: { id: 'event-123' },
				},
			});

			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Media Updated'));
			expect(result).toEqual({ success: true, event: { id: 'event-123' } });
		});

		it('should handle 403 error and retry once', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { success: true, event: { id: 'event-123' } },
				});

			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPostHTTP.editorBulkAddPosts).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ success: true, event: { id: 'event-123' } });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors with non-empty response', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to update package media'));
		});

		it('should handle empty response as success', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockResolvedValue({});

			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Media Updated'));
			expect(result).toBeUndefined();
		});

		it('should handle unexpected errors with non-empty error', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(null);
			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
		});

		it('should handle empty error as success', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockRejectedValue({});

			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Media Updated'));
		});

		it('should handle unexpected errors with non-empty error', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(null);
			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
		});

		it('should handle empty error as success', async () => {
			const packageId = 'package-123';
			const payload = { payload: { media: ['media1', 'media2'] } };
			(EventPostHTTP.editorBulkAddPosts as jest.Mock).mockRejectedValue({});

			const result = await PackagesStoreHttp.updateEventPackageMedia(packageId, payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Media Updated'));
		});
	});

	describe('deleteEventPackage', () => {
		it('should successfully delete an event package', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const dismiss = jest.fn();
			const result = await PackagesStoreHttp.deleteEventPackage(eventId, packageId, dismiss);

			expect(EventPackageHTTP.deleteEventPackage).toHaveBeenCalledWith({
				eventId,
				packageId,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Deleted'));
			expect(dismiss).toHaveBeenCalled();
			expect(result).toEqual({ success: true });
		});

		it('should work without dismiss function', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			const result = await PackagesStoreHttp.deleteEventPackage(eventId, packageId);

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Package Deleted'));
			expect(result).toEqual({ success: true });
		});

		it('should handle 403 error and retry once', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.deleteEventPackage as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { success: true },
				});

			const result = await PackagesStoreHttp.deleteEventPackage(eventId, packageId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(EventPackageHTTP.deleteEventPackage).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ success: true });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.deleteEventPackage as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.deleteEventPackage(eventId, packageId);

			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.deleteEventPackage as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await PackagesStoreHttp.deleteEventPackage(eventId, packageId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith({
				status: 500,
				message: 'Internal Server Error',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete package'));
		});

		it('should handle unexpected errors', async () => {
			const eventId = 'event-123';
			const packageId = 'package-123';
			(EventPackageHTTP.deleteEventPackage as jest.Mock).mockRejectedValue(new Error('Network error'));

			await PackagesStoreHttp.deleteEventPackage(eventId, packageId);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(new Error('Network error'));
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
		});
	});

	describe('retry mechanism', () => {
		it('should not retry when retryCount is already at max', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await PackagesStoreHttp.getAllEventVideos(eventId, 1); // Already at max retries

			expect(UserStoreHttp.refreshUser).not.toHaveBeenCalled();
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should clear error on first retry attempt', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 200,
				data: { posts: [], totalPosts: 0 },
			});

			await PackagesStoreHttp.getAllEventVideos(eventId, 0);

			expect(mockPackagesStore.setError).toHaveBeenCalledWith(null);
		});
	});

	describe('store state management', () => {
		it('should properly manage loading states', async () => {
			const eventId = 'event-123';
			(EventPostHTTP.editorGetEventPostsByType as jest.Mock).mockResolvedValue({
				status: 200,
				data: { posts: [], totalPosts: 0 },
			});

			await PackagesStoreHttp.getAllEventVideos(eventId);

			expect(mockPackagesStore.setLoadingEventPosts).toHaveBeenCalledWith(true);
			// Loading should be set to false in the finally block via setTimeout
		});
	});
});
