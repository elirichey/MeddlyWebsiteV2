jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

jest.mock('../../../utils/http/admin/event-sequences');
jest.mock('../../../utils/http/user/event-sequences');
jest.mock('../../http/userStoreHttp');

import Toast from 'react-native-toast-message';
import { ToastError, ToastSuccess } from '../../../config/toastConfig';
import EventSequenceHTTP from '../../../utils/http/admin/event-sequences';
import UserEventSequencesHttp from '../../../utils/http/user/event-sequences';
import SequencesStoreHttp, {
	getEventSequencesAsUser,
	getOrgEventSequences,
	getEventSequence,
	createEventSequence,
	updateEventSequence,
	deleteEventSequence,
	type ApiResponse,
} from '../../http/sequencesStoreHttp';
import UserStoreHttp from '../../http/userStoreHttp';
import { useSequencesStore } from '../../stores/useSequencesStore';
import { useUserStore } from '../../stores/useUserStore';

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

// Helper function to create mock ApiResponse
const createMockApiResponse = (data: any, status = 200, message?: string): ApiResponse => ({
	status,
	data,
	message,
});

// Mock the stores
const mockSequencesStore = {
	setUserEventSequences: jest.fn(),
	setLoadingUserEventSequences: jest.fn(),
	setOrgEventSequences: jest.fn(),
	setLoadingOrgEventSequences: jest.fn(),
	setCurrentSequence: jest.fn(),
	setLoadingCurrentSequence: jest.fn(),
	setEventSequences: jest.fn(),
	setLoadingEventSequences: jest.fn(),
	setError: jest.fn(),
	loadingEventSequences: false,
};

const mockUserStore = {
	tokens: { accessToken: 'test-token', refreshToken: 'test-refresh-token' },
};

// Mock Toast
const mockToast = Toast as unknown as { show: jest.Mock };

// Mock HTTP modules
const mockEventSequenceHTTP = EventSequenceHTTP as jest.Mocked<typeof EventSequenceHTTP>;
const mockUserEventSequencesHttp = UserEventSequencesHttp as typeof UserEventSequencesHttp & {
	getEventSequencesAsUser: jest.Mock<Promise<ApiResponse>, any>;
};
const mockUserStoreHttp = UserStoreHttp as jest.Mocked<typeof UserStoreHttp>;

describe('SequencesStoreHttp', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Mock store getState calls
		(useSequencesStore.getState as jest.Mock) = jest.fn().mockReturnValue(mockSequencesStore);
		(useUserStore.getState as jest.Mock) = jest.fn().mockReturnValue(mockUserStore);

		// Mock HTTP methods
		mockEventSequenceHTTP.orgGetEventSequences = jest.fn();
		mockEventSequenceHTTP.getEventSequence = jest.fn();
		mockEventSequenceHTTP.createEventSequence = jest.fn();
		mockEventSequenceHTTP.updateEventSequence = jest.fn();
		mockEventSequenceHTTP.deleteEventSequence = jest.fn();

		mockUserEventSequencesHttp.getEventSequencesAsUser = jest.fn();

		// Mock UserStoreHttp methods
		mockUserStoreHttp.refreshUser = jest.fn();
		mockUserStoreHttp.tryLogout = jest.fn();
	});

	describe('getEventSequencesAsUser', () => {
		const eventId = 'test-event-id';

		it('should successfully fetch event sequences as user', async () => {
			const mockResponse = createMockApiResponse([
				{ id: '1', name: 'Sequence 1' },
				{ id: '2', name: 'Sequence 2' },
			]);

			mockUserEventSequencesHttp.getEventSequencesAsUser.mockResolvedValue(mockResponse);

			await getEventSequencesAsUser(eventId);

			expect(mockSequencesStore.setLoadingUserEventSequences).toHaveBeenCalledWith(true);
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(null);
			expect(mockUserEventSequencesHttp.getEventSequencesAsUser).toHaveBeenCalledWith({
				eventId,
				token: 'test-token',
			});
			expect(mockSequencesStore.setUserEventSequences).toHaveBeenCalledWith(mockResponse.data);
			expect(mockSequencesStore.setLoadingUserEventSequences).toHaveBeenCalledWith(false);
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockUserEventSequencesHttp.getEventSequencesAsUser.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await getEventSequencesAsUser(eventId);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockUserEventSequencesHttp.getEventSequencesAsUser).toHaveBeenCalledTimes(2);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockUserEventSequencesHttp.getEventSequencesAsUser.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await getEventSequencesAsUser(eventId, 1); // Start with retryCount = 1

			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockUserEventSequencesHttp.getEventSequencesAsUser.mockResolvedValue(mockResponse);

			await getEventSequencesAsUser(eventId);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event sequences'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle caught exceptions', async () => {
			const mockError = new Error('Network error');
			mockUserEventSequencesHttp.getEventSequencesAsUser.mockRejectedValue(mockError);

			await getEventSequencesAsUser(eventId);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'An unexpected error occurred'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockError);
		});
	});

	describe('getOrgEventSequences', () => {
		const eventId = 'test-event-id';

		it('should successfully fetch org event sequences', async () => {
			const mockResponse = createMockApiResponse([{ id: '1', name: 'Org Sequence 1' }]);

			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(mockResponse);

			await getOrgEventSequences(eventId);

			expect(mockSequencesStore.setLoadingOrgEventSequences).toHaveBeenCalledWith(true);
			expect(mockEventSequenceHTTP.orgGetEventSequences).toHaveBeenCalledWith({
				eventId,
				token: 'test-token',
			});
			expect(mockSequencesStore.setOrgEventSequences).toHaveBeenCalledWith(mockResponse.data);
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await getOrgEventSequences(eventId);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.orgGetEventSequences).toHaveBeenCalledTimes(2);
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(mockResponse);

			await getOrgEventSequences(eventId);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event sequence'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});
	});

	describe('getEventSequence', () => {
		const sequenceId = 'test-sequence-id';
		const mockTrigger = jest.fn();

		it('should successfully fetch event sequence', async () => {
			const mockResponse = createMockApiResponse({
				id: sequenceId,
				name: 'Test Sequence',
			});

			mockEventSequenceHTTP.getEventSequence.mockResolvedValue(mockResponse);

			await getEventSequence(sequenceId, mockTrigger);

			expect(mockSequencesStore.setLoadingCurrentSequence).toHaveBeenCalledWith(true);
			expect(mockEventSequenceHTTP.getEventSequence).toHaveBeenCalledWith({
				sequenceId,
				token: 'test-token',
			});
			expect(mockSequencesStore.setCurrentSequence).toHaveBeenCalledWith(mockResponse.data);
			expect(mockTrigger).toHaveBeenCalled();
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockEventSequenceHTTP.getEventSequence.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await getEventSequence(sequenceId, mockTrigger);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.getEventSequence).toHaveBeenCalledTimes(2);
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockEventSequenceHTTP.getEventSequence.mockResolvedValue(mockResponse);

			await getEventSequence(sequenceId, mockTrigger);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get event sequence'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});
	});

	describe('createEventSequence', () => {
		const payload = {
			eventId: 'test-event-id',
			packageId: 'test-package-id',
			sequenceOptions: {
				orientation: 'landscape' as const,
				segmentLength: 'medium' as const,
			},
		};

		it('should successfully create event sequence', async () => {
			const mockResponse = createMockApiResponse({ id: 'new-sequence-id' }, 201, 'Created');

			mockEventSequenceHTTP.createEventSequence.mockResolvedValue(mockResponse);
			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(createMockApiResponse([]));

			await createEventSequence(payload);

			expect(mockSequencesStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventSequenceHTTP.createEventSequence).toHaveBeenCalledWith({
				payload,
				token: 'test-token',
			});
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Success', 'Sequence Generation Request Sent'));
			expect(mockEventSequenceHTTP.orgGetEventSequences).toHaveBeenCalled();
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockEventSequenceHTTP.createEventSequence.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await createEventSequence(payload);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.createEventSequence).toHaveBeenCalledTimes(2);
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockEventSequenceHTTP.createEventSequence.mockResolvedValue(mockResponse);

			await createEventSequence(payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to create sequence'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});
	});

	describe('updateEventSequence', () => {
		const sequenceId = 'test-sequence-id';
		const payload = {
			price: {
				attendee: 10,
				nonAttendee: 20,
			},
		};

		it('should successfully update event sequence', async () => {
			const mockResponse = createMockApiResponse({
				id: sequenceId,
				price: payload.price,
			});

			mockEventSequenceHTTP.updateEventSequence.mockResolvedValue(mockResponse);
			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(createMockApiResponse([]));

			await updateEventSequence(sequenceId, payload);

			expect(mockSequencesStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventSequenceHTTP.updateEventSequence).toHaveBeenCalledWith({
				sequenceId,
				payload: {
					price: {
						attendee: payload.price.attendee,
						nonAttendee: payload.price.nonAttendee,
					},
				},
				token: 'test-token',
			});
			expect(mockEventSequenceHTTP.orgGetEventSequences).toHaveBeenCalledWith({
				eventId: sequenceId,
				token: 'test-token',
			});
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockEventSequenceHTTP.updateEventSequence.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await updateEventSequence(sequenceId, payload);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.updateEventSequence).toHaveBeenCalledTimes(2);
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockEventSequenceHTTP.updateEventSequence.mockResolvedValue(mockResponse);

			await updateEventSequence(sequenceId, payload);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to update sequence'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});
	});

	describe('deleteEventSequence', () => {
		const eventId = 'test-event-id';
		const sequenceId = 'test-sequence-id';
		const mockDismiss = jest.fn();

		it('should successfully delete event sequence', async () => {
			const mockResponse = createMockApiResponse(
				{
					success: true,
				},
				201,
				'Created',
			);

			mockEventSequenceHTTP.deleteEventSequence.mockResolvedValue(mockResponse);
			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(createMockApiResponse([]));

			await deleteEventSequence(eventId, sequenceId, mockDismiss);

			expect(mockSequencesStore.setError).toHaveBeenCalledWith(null);
			expect(mockEventSequenceHTTP.deleteEventSequence).toHaveBeenCalledWith({
				eventId,
				sequenceId,
				dismiss: mockDismiss,
				token: 'test-token',
			});
			expect(mockDismiss).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.orgGetEventSequences).toHaveBeenCalledWith({
				eventId,
				token: 'test-token',
			});
		});

		it('should handle 403 error and retry with token refresh', async () => {
			const mockResponse = createMockApiResponse({ message: '403 Forbidden' }, 403, '403 Forbidden');

			mockEventSequenceHTTP.deleteEventSequence.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await deleteEventSequence(eventId, sequenceId, mockDismiss);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockEventSequenceHTTP.deleteEventSequence).toHaveBeenCalledTimes(2);
		});

		it('should handle other errors', async () => {
			const mockResponse = createMockApiResponse({ message: 'Internal Server Error' }, 500, 'Internal Server Error');

			mockEventSequenceHTTP.deleteEventSequence.mockResolvedValue(mockResponse);

			await deleteEventSequence(eventId, sequenceId, mockDismiss);

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete sequence'));
			expect(mockSequencesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should work without dismiss callback', async () => {
			const mockResponse = createMockApiResponse({
				success: true,
			});

			mockEventSequenceHTTP.deleteEventSequence.mockResolvedValue(mockResponse);
			mockEventSequenceHTTP.orgGetEventSequences.mockResolvedValue(createMockApiResponse([]));

			await deleteEventSequence(eventId, sequenceId);

			expect(mockEventSequenceHTTP.deleteEventSequence).toHaveBeenCalledWith({
				eventId,
				sequenceId,
				dismiss: undefined,
				token: 'test-token',
			});
		});
	});

	describe('SequencesStoreHttp default export', () => {
		it('should export all functions', () => {
			expect(SequencesStoreHttp).toEqual({
				getEventSequencesAsUser,
				getOrgEventSequences,
				getEventSequence,
				createEventSequence,
				updateEventSequence,
				deleteEventSequence,
			});
		});
	});
});
