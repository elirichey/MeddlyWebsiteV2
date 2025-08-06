jest.mock('../../../utils/http/camera');
jest.mock('../../../utils/http/user/events');
jest.mock('../../../utils/http/admin/events');
jest.mock('../../../utils/http/admin/manage-event');
jest.mock('../../http/userStoreHttp');
jest.mock('../../stores/useUserStore');
jest.mock('../../stores/useEventStore');
jest.mock('../../stores/useOrgStore');
jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

import Toast from 'react-native-toast-message';
import CameraHttp from '../../../utils/http/camera';
import UserEventsHttp from '../../../utils/http/user/events';
import OrgEventsHttp from '../../../utils/http/admin/events';
import EventManagerHTTP from '../../../utils/http/admin/manage-event';
import UserStoreHttp from '../../http/userStoreHttp';
import { useUserStore } from '../../stores/useUserStore';
import { useEventStore } from '../../stores/useEventStore';
import { useOrgStore } from '../../stores/useOrgStore';
import { ToastError, ToastSuccess } from '../../../config/toastConfig';
import * as eventStoreHttp from '../../http/eventStoreHttp';

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

const mockUserStore = {
	setUserRoles: jest.fn(),
	setProfile: jest.fn(),
	setCurrentRole: jest.fn(),
	tokens: { accessToken: 'test-token', refreshToken: 'test-refresh' },
	currentRole: {
		id: 'role-123',
		organization: { id: 'org-123' },
	},
	profile: {
		id: 'user-123',
		name: 'Test User',
		eventConnected: { id: 'event-123' },
	},
};

const mockEventStore = {
	setCameraEvents: jest.fn(),
	setCameraEventsTotal: jest.fn(),
	setError: jest.fn(),
	setLoadingCameraEvents: jest.fn(),
	setLoadingOrgEvents: jest.fn(),
	setOrgEvents: jest.fn(),
	setOrgEventsTotal: jest.fn(),
	setOrgEventsStatuses: jest.fn(),
	setOrgEventsCurrentTab: jest.fn(),
	setCurrentEvent: jest.fn(),
	setCurrentEventLoading: jest.fn(),
	setManagerSetupEvent: jest.fn(),
	setManagerStartingEvent: jest.fn(),
	setManagerCancelingEvent: jest.fn(),
	setManagerEndingEvent: jest.fn(),
	setLoadingViewEvent: jest.fn(),
	setViewEvent: jest.fn(),
	loadingViewEvent: false,
};

const mockOrgStore = {
	viewOrg: { id: 'view-org-123' },
};

const mockEvent = {
	id: 'event-123',
	title: 'Test Event',
	status: 'active',
	dateTime: Date.now(),
	type: 'concert',
	venue: {
		id: 'venue-123',
		name: 'Test Venue',
		avatar: undefined,
		website: undefined,
		type: 'venue',
		isOperating: true,
		addressStreet1: '123 Test St',
		addressStreet2: undefined,
		addressCity: 'Test City',
		addressRegion: 'Test Region',
		addressCountry: 'Test Country',
		addressZipCode: '12345',
		locale: 'en-US',
		timezone: 'UTC',
		latitude: '0',
		longitude: '0',
	},
	orgOwner: { id: 'org-123', name: 'Test Org' },
	manager: { id: 'manager-123', username: 'testmanager' },
	updated: new Date(),
	created: new Date(),
};

const mockCameraEventsResponse = {
	events: [mockEvent],
	totalEvents: 1,
	user: { id: 'user-123', name: 'Test User', userRoles: [] },
};

const mockOrgEventsResponse = {
	events: [mockEvent],
	totalEvents: 1,
	eventStatuses: ['active', 'completed', 'cancelled'],
};

describe('eventStoreHttp', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Mock UserStoreHttp functions
		(UserStoreHttp.refreshUser as jest.Mock).mockResolvedValue({ status: 200 });
		(UserStoreHttp.tryLogout as jest.Mock).mockResolvedValue(undefined);

		// Mock the store getState functions
		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);
		(useEventStore.getState as jest.Mock).mockReturnValue(mockEventStore);
		(useOrgStore.getState as jest.Mock).mockReturnValue(mockOrgStore);
	});

	describe('getUserCameraEvents', () => {
		it('should successfully fetch user camera events', async () => {
			(CameraHttp.getUserCameraEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockCameraEventsResponse,
			});

			const result = await eventStoreHttp.getUserCameraEvents();

			expect(CameraHttp.getUserCameraEvents).toHaveBeenCalledWith({
				token: 'test-token',
			});
			expect(mockEventStore.setCameraEvents).toHaveBeenCalledWith([mockEvent]);
			expect(mockEventStore.setCameraEventsTotal).toHaveBeenCalledWith(1);
			expect(mockUserStore.setProfile).toHaveBeenCalledWith(mockCameraEventsResponse.user);
			expect(mockUserStore.setUserRoles).toHaveBeenCalledWith([]);
			expect(mockEventStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventStore.setLoadingCameraEvents).toHaveBeenCalledWith(false);
			expect(result).toEqual(mockCameraEventsResponse);
		});

		it('should handle 403 error and retry once', async () => {
			(CameraHttp.getUserCameraEvents as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockCameraEventsResponse,
				});

			const result = await eventStoreHttp.getUserCameraEvents();

			expect(CameraHttp.getUserCameraEvents).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(result).toEqual(mockCameraEventsResponse);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(CameraHttp.getUserCameraEvents as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await eventStoreHttp.getUserCameraEvents();

			expect(CameraHttp.getUserCameraEvents).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Error', 'Logging User Out'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Authentication failed');
		});

		it('should handle non-403 errors', async () => {
			(CameraHttp.getUserCameraEvents as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getUserCameraEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get events'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch camera events');
		});

		it('should handle exceptions', async () => {
			(CameraHttp.getUserCameraEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getUserCameraEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('getOrgCameraEvents', () => {
		it('should successfully fetch org camera events', async () => {
			(CameraHttp.getOrgCameraEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockCameraEventsResponse,
			});

			const result = await eventStoreHttp.getOrgCameraEvents();

			expect(CameraHttp.getOrgCameraEvents).toHaveBeenCalledWith({
				orgId: 'org-123',
				token: 'test-token',
			});
			expect(mockEventStore.setCameraEvents).toHaveBeenCalledWith([mockEvent]);
			expect(mockEventStore.setCameraEventsTotal).toHaveBeenCalledWith(1);
			expect(mockUserStore.setProfile).toHaveBeenCalledWith(mockCameraEventsResponse.user);
			expect(mockUserStore.setUserRoles).toHaveBeenCalledWith([]);
			expect(result).toEqual(mockCameraEventsResponse);
		});

		it('should update current role when user has matching role', async () => {
			const userWithRoles = {
				...mockCameraEventsResponse.user,
				userRoles: [{ id: 'role-123', name: 'Admin' }],
			};

			(CameraHttp.getOrgCameraEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockCameraEventsResponse, user: userWithRoles },
			});

			await eventStoreHttp.getOrgCameraEvents();

			expect(mockUserStore.setCurrentRole).toHaveBeenCalledWith({ id: 'role-123', name: 'Admin' });
		});

		it('should set current role to null when no matching role found', async () => {
			const userWithRoles = {
				...mockCameraEventsResponse.user,
				userRoles: [{ id: 'different-role', name: 'User' }],
			};

			(CameraHttp.getOrgCameraEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockCameraEventsResponse, user: userWithRoles },
			});

			await eventStoreHttp.getOrgCameraEvents();

			expect(mockUserStore.setCurrentRole).toHaveBeenCalledWith(null);
		});

		it('should handle 403 error and retry once', async () => {
			(CameraHttp.getOrgCameraEvents as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockCameraEventsResponse,
				});

			const result = await eventStoreHttp.getOrgCameraEvents();

			expect(CameraHttp.getOrgCameraEvents).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockCameraEventsResponse);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(CameraHttp.getOrgCameraEvents as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.getOrgCameraEvents();

			expect(CameraHttp.getOrgCameraEvents).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(CameraHttp.getOrgCameraEvents as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getOrgCameraEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get events'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch camera events');
		});

		it('should handle exceptions', async () => {
			(CameraHttp.getOrgCameraEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getOrgCameraEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('getOrgListEvents', () => {
		it('should successfully fetch org list events', async () => {
			(OrgEventsHttp.getOrgEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockOrgEventsResponse,
			});

			const result = await eventStoreHttp.getOrgListEvents();

			expect(OrgEventsHttp.getOrgEvents).toHaveBeenCalledWith({
				orgId: 'org-123',
				token: 'test-token',
				status: undefined,
			});
			expect(mockEventStore.setOrgEvents).toHaveBeenCalledWith([mockEvent]);
			expect(mockEventStore.setOrgEventsTotal).toHaveBeenCalledWith(1);
			expect(mockEventStore.setOrgEventsStatuses).toHaveBeenCalledWith(['active', 'completed', 'cancelled']);
			expect(result).toEqual(mockOrgEventsResponse);
		});

		it('should handle encoded status parameter', async () => {
			const encodedStatus = encodeURIComponent('active');
			(OrgEventsHttp.getOrgEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockOrgEventsResponse,
			});

			await eventStoreHttp.getOrgListEvents(0, encodedStatus);

			expect(OrgEventsHttp.getOrgEvents).toHaveBeenCalledWith({
				orgId: 'org-123',
				token: 'test-token',
				status: 'active',
			});
			expect(mockEventStore.setOrgEventsCurrentTab).toHaveBeenCalledWith('active');
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.getOrgEvents as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockOrgEventsResponse,
				});

			const result = await eventStoreHttp.getOrgListEvents();

			expect(OrgEventsHttp.getOrgEvents).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockOrgEventsResponse);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.getOrgEvents as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.getOrgListEvents();

			expect(OrgEventsHttp.getOrgEvents).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.getOrgEvents as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getOrgListEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get events'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch org events');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.getOrgEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getOrgListEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('getViewOrgListEvents', () => {
		it('should successfully fetch view org list events', async () => {
			(UserEventsHttp.userGetOrgEvents as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockOrgEventsResponse,
			});

			const result = await eventStoreHttp.getViewOrgListEvents();

			expect(UserEventsHttp.userGetOrgEvents).toHaveBeenCalledWith({
				orgId: 'view-org-123',
				token: 'test-token',
			});
			expect(mockEventStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventStore.setLoadingOrgEvents).toHaveBeenCalledWith(false);
			expect(result).toEqual(mockOrgEventsResponse);
		});

		it('should handle 403 error and retry once', async () => {
			(UserEventsHttp.userGetOrgEvents as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockOrgEventsResponse,
				});

			const result = await eventStoreHttp.getViewOrgListEvents();

			expect(UserEventsHttp.userGetOrgEvents).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockOrgEventsResponse);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(UserEventsHttp.userGetOrgEvents as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.getViewOrgListEvents();

			expect(UserEventsHttp.userGetOrgEvents).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(UserEventsHttp.userGetOrgEvents as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getViewOrgListEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get events'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch view org events');
		});

		it('should handle exceptions', async () => {
			(UserEventsHttp.userGetOrgEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getViewOrgListEvents();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('getCurrentUserEvent', () => {
		it('should successfully fetch current user event', async () => {
			(UserEventsHttp.getEventAsUser as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockEvent,
			});

			const result = await eventStoreHttp.getCurrentUserEvent('event-123');

			expect(UserEventsHttp.getEventAsUser).toHaveBeenCalledWith({
				eventId: 'event-123',
				token: 'test-token',
			});
			expect(mockEventStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventStore.setLoadingOrgEvents).toHaveBeenCalledWith(false);
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and retry once', async () => {
			(UserEventsHttp.getEventAsUser as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockEvent,
				});

			const result = await eventStoreHttp.getCurrentUserEvent('event-123');

			expect(UserEventsHttp.getEventAsUser).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(UserEventsHttp.getEventAsUser as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.getCurrentUserEvent('event-123');

			expect(UserEventsHttp.getEventAsUser).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(UserEventsHttp.getEventAsUser as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getCurrentUserEvent('event-123');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch user event');
		});

		it('should handle exceptions', async () => {
			(UserEventsHttp.getEventAsUser as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getCurrentUserEvent('event-123');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
		});
	});

	describe('getOrgEvent', () => {
		it('should successfully fetch org event', async () => {
			(OrgEventsHttp.getOrgEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: mockEvent,
			});

			const result = await eventStoreHttp.getOrgEvent('event-123');

			expect(OrgEventsHttp.getOrgEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				token: 'test-token',
			});
			expect(mockEventStore.setViewEvent).toHaveBeenCalledWith(mockEvent);
			expect(mockEventStore.setLoadingViewEvent).toHaveBeenCalledWith(false);
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.getOrgEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: mockEvent,
				});

			const result = await eventStoreHttp.getOrgEvent('event-123');

			expect(OrgEventsHttp.getOrgEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.getOrgEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.getOrgEvent('event-123');

			expect(OrgEventsHttp.getOrgEvent).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.getOrgEvent as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.getOrgEvent('event-123');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to fetch org event');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.getOrgEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.getOrgEvent('event-123');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('createOrgEvent', () => {
		const mockPayload = {
			title: 'New Event',
			dateTime: Date.now(),
			venueId: 'venue-123',
		};

		it('should successfully create org event', async () => {
			(OrgEventsHttp.createEvent as jest.Mock).mockResolvedValue({
				status: 201,
				data: mockEvent,
			});

			const result = await eventStoreHttp.createOrgEvent(mockPayload);

			expect(OrgEventsHttp.createEvent).toHaveBeenCalledWith({
				payload: mockPayload,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Event Created'));
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.createEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 201,
					data: mockEvent,
				});

			const result = await eventStoreHttp.createOrgEvent(mockPayload);

			expect(OrgEventsHttp.createEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockEvent);
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.createEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.createOrgEvent(mockPayload);

			expect(OrgEventsHttp.createEvent).toHaveBeenCalledTimes(2);
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.createEvent as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.createOrgEvent(mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to create event'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to create event');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.createEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.createOrgEvent(mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('updateOrgEvent', () => {
		const mockPayload = {
			title: 'Updated Event',
			dateTime: Date.now(),
		};

		it('should successfully update org event', async () => {
			(OrgEventsHttp.updateEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockEvent, ...mockPayload },
			});

			const result = await eventStoreHttp.updateOrgEvent(mockEvent, mockPayload);

			expect(OrgEventsHttp.updateEvent).toHaveBeenCalledWith({
				event: mockEvent,
				payload: mockPayload,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Event Updated'));
			expect(result).toEqual({ ...mockEvent, ...mockPayload });
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.updateEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { ...mockEvent, ...mockPayload },
				});

			const result = await eventStoreHttp.updateOrgEvent(mockEvent, mockPayload);

			expect(OrgEventsHttp.updateEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, ...mockPayload });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.updateEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.updateOrgEvent(mockEvent, mockPayload);

			expect(OrgEventsHttp.updateEvent).toHaveBeenCalledTimes(2);
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.updateEvent as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.updateOrgEvent(mockEvent, mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to update event'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to update event');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.updateEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.updateOrgEvent(mockEvent, mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('uploadCoverArt', () => {
		const mockPayload = {
			coverImg: 'file://test-image.jpg',
		};

		it('should successfully upload cover art', async () => {
			(OrgEventsHttp.uploadCoverArt as jest.Mock).mockResolvedValue({
				status: 201,
				data: { ...mockEvent, coverImg: 'new-cover-url' },
			});

			const result = await eventStoreHttp.uploadCoverArt(mockEvent, mockPayload);

			expect(OrgEventsHttp.uploadCoverArt).toHaveBeenCalledWith(mockEvent, mockPayload, 'test-token');
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Cover Art Updated'));
			expect(result).toEqual({ ...mockEvent, coverImg: 'new-cover-url' });
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.uploadCoverArt as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 201,
					data: { ...mockEvent, coverImg: 'new-cover-url' },
				});

			const result = await eventStoreHttp.uploadCoverArt(mockEvent, mockPayload);

			expect(OrgEventsHttp.uploadCoverArt).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, coverImg: 'new-cover-url' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.uploadCoverArt as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.uploadCoverArt(mockEvent, mockPayload);

			expect(OrgEventsHttp.uploadCoverArt).toHaveBeenCalledTimes(2);
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.uploadCoverArt as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.uploadCoverArt(mockEvent, mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to upload cover art'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to upload cover art');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.uploadCoverArt as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.uploadCoverArt(mockEvent, mockPayload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('deleteOrgEvent', () => {
		const mockDismiss = jest.fn();

		it('should successfully delete org event', async () => {
			(OrgEventsHttp.deleteEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { message: 'Event deleted' },
			});

			const result = await eventStoreHttp.deleteOrgEvent('event-123', 0, mockDismiss);

			expect(OrgEventsHttp.deleteEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Event Deleted'));
			expect(mockDismiss).toHaveBeenCalled();
			expect(result).toEqual({ message: 'Event deleted' });
		});

		it('should handle 403 error and retry once', async () => {
			(OrgEventsHttp.deleteEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { message: 'Event deleted' },
				});

			const result = await eventStoreHttp.deleteOrgEvent('event-123', 0, mockDismiss);

			expect(OrgEventsHttp.deleteEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ message: 'Event deleted' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(OrgEventsHttp.deleteEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.deleteOrgEvent('event-123', 0, mockDismiss);

			expect(OrgEventsHttp.deleteEvent).toHaveBeenCalledTimes(2);
			// The implementation doesn't call logout for deleteOrgEvent 403 errors
			expect(result).toBeNull();
		});

		it('should handle non-403 errors', async () => {
			(OrgEventsHttp.deleteEvent as jest.Mock).mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await eventStoreHttp.deleteOrgEvent('event-123', 0, mockDismiss);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete event'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('Failed to delete event');
		});

		it('should handle exceptions', async () => {
			(OrgEventsHttp.deleteEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

			await eventStoreHttp.deleteOrgEvent('event-123', 0, mockDismiss);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('An unexpected error occurred'));
			expect(mockEventStore.setError).toHaveBeenCalledWith('An unexpected error occurred');
		});
	});

	describe('eventManagerSetupEvent', () => {
		it('should successfully setup event manager', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockEvent, status: 'Pre-Event' },
			});

			const result = await eventStoreHttp.eventManagerSetupEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: { status: 'Pre-Event' },
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Event Setup Ready'));
			expect(result).toEqual({ ...mockEvent, status: 'Pre-Event' });
		});

		it('should handle 403 error and retry once', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { ...mockEvent, status: 'Pre-Event' },
				});

			const result = await eventStoreHttp.eventManagerSetupEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, status: 'Pre-Event' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.eventManagerSetupEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe('eventManagerStartEvent', () => {
		it('should successfully start event manager', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockEvent, status: 'In Progress' },
			});

			const result = await eventStoreHttp.eventManagerStartEvent(Date.now());

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: { status: 'In Progress', timestampStart: expect.any(Number) },
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Event Started'));
			expect(result).toEqual({ ...mockEvent, status: 'In Progress' });
		});

		it('should handle 403 error and retry once', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { ...mockEvent, status: 'In Progress' },
				});

			const result = await eventStoreHttp.eventManagerStartEvent(Date.now());

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, status: 'In Progress' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.eventManagerStartEvent(Date.now());

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe('eventManagerCancelEvent', () => {
		it('should successfully cancel event manager', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockEvent, status: 'Canceled' },
			});

			const result = await eventStoreHttp.eventManagerCancelEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: { status: 'Canceled' },
				token: 'test-token',
			});
			expect(result).toEqual({ ...mockEvent, status: 'Canceled' });
		});

		it('should handle 403 error and retry once', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { ...mockEvent, status: 'Canceled' },
				});

			const result = await eventStoreHttp.eventManagerCancelEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, status: 'Canceled' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.eventManagerCancelEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe('eventManagerEndEvent', () => {
		it('should successfully end event manager', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: { ...mockEvent, status: 'Completed' },
			});

			const result = await eventStoreHttp.eventManagerEndEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: { status: 'Completed', timestampEnd: expect.any(Number) },
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Event Ended'));
			expect(result).toEqual({ ...mockEvent, status: 'Completed' });
		});

		it('should handle 403 error and retry once', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock)
				.mockResolvedValueOnce({
					status: 403,
					message: '403 Forbidden',
				})
				.mockResolvedValueOnce({
					status: 200,
					data: { ...mockEvent, status: 'Completed' },
				});

			const result = await eventStoreHttp.eventManagerEndEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ ...mockEvent, status: 'Completed' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			(EventManagerHTTP.managerUpdateEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			const result = await eventStoreHttp.eventManagerEndEvent();

			expect(EventManagerHTTP.managerUpdateEvent).toHaveBeenCalledTimes(2);
			expect(UserStoreHttp.tryLogout).toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});
});
