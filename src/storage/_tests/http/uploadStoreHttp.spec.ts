import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import UploadStoreHttp from '../../http/uploadStoreHttp';
import { useUploadsStore } from '../../stores/useUploadsStore';
import { useUserStore } from '../../stores/useUserStore';
import { useEventStore } from '../../stores/useEventStore';
import CameraHttp from '../../../utils/http/camera';
import UserStoreHttp from '../../http/userStoreHttp';
import EventPostHTTP from '../../../utils/http/admin/event-posts';
import FileAction from '../../../utils/helpers/file-actions';
import delay from '../../../utils/helpers/delay';
import { timeout } from '../../../config/variables';
import type { CameraUploadPayload } from '../../../interfaces/Camera';
import type { UploadPayload } from '../../../interfaces/Upload';

// Mock all dependencies
jest.mock('react-native', () => ({
	Alert: {
		alert: jest.fn(),
	},
	Platform: {
		OS: 'ios',
	},
}));

jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));

jest.mock('../../../config/toastConfig', () => ({
	ToastSuccess: jest.fn((text1, text2) => ({
		type: 'Success',
		text1,
		text2,
		visibilityTime: 3000,
	})),
	ToastError: jest.fn((text1, text2) => ({
		type: 'Error',
		text1,
		text2,
		visibilityTime: 3000,
	})),
}));

jest.mock('../../stores/useUploadsStore');
jest.mock('../../stores/useUserStore');
jest.mock('../../stores/useEventStore');
jest.mock('../../../utils/http/camera');
jest.mock('../../http/userStoreHttp');
jest.mock('../../../utils/http/admin/event-posts');
jest.mock('../../../utils/helpers/file-actions');
jest.mock('../../../utils/helpers/delay');
jest.mock('../../../config/variables', () => ({
	timeout: {
		fetch: 1000,
		auth: 2000,
		xlong: 5000,
	},
}));

// Mock stores
const mockUseUploadsStore = useUploadsStore as jest.Mocked<typeof useUploadsStore>;
const mockUseUserStore = useUserStore as jest.Mocked<typeof useUserStore>;
const mockUseEventStore = useEventStore as jest.Mocked<typeof useEventStore>;

// Mock HTTP modules
const mockCameraHttp = CameraHttp as jest.Mocked<typeof CameraHttp>;
const mockUserStoreHttp = UserStoreHttp as jest.Mocked<typeof UserStoreHttp>;
const mockEventPostHTTP = EventPostHTTP as jest.Mocked<typeof EventPostHTTP>;

// Mock utility modules
const mockFileAction = FileAction as jest.Mocked<typeof FileAction>;
const mockDelay = delay as jest.MockedFunction<typeof delay>;

describe('UploadStoreHttp', () => {
	// Mock store state
	const mockUploadsState = {
		uploadQueue: [],
		packageUploadQueue: [],
		uploadProgressArray: [],
		packageUploadProgressArray: [],
		uploadError: null,
		packageUploadError: null,
		setUploadQueue: jest.fn(),
		setPackageUploadQueue: jest.fn(),
		setUploadProgressArray: jest.fn(),
		setPackageUploadProgressArray: jest.fn(),
		clearUploadQueue: jest.fn(),
		setUploadError: jest.fn(),
		clearPackageUploadQueue: jest.fn(),
		setPackageUploadError: jest.fn(),
		resetUploads: jest.fn(),
	} as any;

	const mockUserState = {
		loading: false,
		setLoading: jest.fn(),
		profile: {
			id: 'user-123',
			eventConnected: {
				id: 'event-456',
			},
		},
		tokens: {
			accessToken: 'mock-access-token',
		},
		userRoles: [],
		currentRole: null,
		loadingCurrentRole: false,
		setProfile: jest.fn(),
		setTokens: jest.fn(),
		setUserRoles: jest.fn(),
		setCurrentRole: jest.fn(),
		setLoadingCurrentRole: jest.fn(),
		connectedEventLoading: false,
		setConnectedEventLoading: jest.fn(),
		error: null,
		setError: jest.fn(),
		resetUserStore: jest.fn(),
	} as any;

	const mockEventState = {
		viewEvent: {
			managerVideo: {
				id: 'post-789',
			},
		},
		loadingViewEvent: false,
		setViewEvent: jest.fn(),
		setLoadingViewEvent: jest.fn(),
		cameraEvents: [],
		cameraEventsTotal: 0,
		loadingCameraEvents: false,
		setCameraEvents: jest.fn(),
		setCameraEventsTotal: jest.fn(),
		setLoadingCameraEvents: jest.fn(),
		orgEventsCurrentTab: 'All',
		orgEventsStatuses: [],
		setOrgEventsCurrentTab: jest.fn(),
		setOrgEventsStatuses: jest.fn(),
		orgEvents: [],
		orgEventsCurrentPage: 0,
		orgEventsTotal: 0,
		loadingOrgEvents: false,
		setOrgEvents: jest.fn(),
		setOrgEventsCurrentPage: jest.fn(),
		setOrgEventsTotal: jest.fn(),
		setLoadingOrgEvents: jest.fn(),
		managerSetupEvent: false,
		managerStartingEvent: false,
		managerCancelingEvent: false,
		managerEndingEvent: false,
		setManagerSetupEvent: jest.fn(),
		setManagerStartingEvent: jest.fn(),
		setManagerCancelingEvent: jest.fn(),
		setManagerEndingEvent: jest.fn(),
		orgCompletedEvents: [],
		orgCompletedEventsCurrentPage: 0,
		orgCompletedEventsTotal: 0,
		loadingOrgCompletedEvents: false,
		setOrgCompletedEvents: jest.fn(),
		setOrgCompletedEventsCurrentPage: jest.fn(),
		setOrgCompletedEventsTotal: jest.fn(),
		setLoadingOrgCompletedEvents: jest.fn(),
		error: null,
		setError: jest.fn(),
		resetEvents: jest.fn(),
	} as any;

	// Test data
	const mockCameraUploadPayload: CameraUploadPayload = {
		eventId: 'event-123',
		media: {
			data: '/path/to/video.mp4',
			timestamp_start: 1000,
			timestamp_end: 2000,
			duration: 10,
			orientation: 'portrait',
			height: 1920,
			width: 1080,
		},
		type: 'video',
		deviceName: 'iPhone 14',
		isPrimary: true,
	};

	const mockUploadPayload: UploadPayload = {
		uri: '/path/to/video.mp4',
		name: 'video.mp4',
		type: 'video/mp4',
		timestampStart: 1000,
		timestampEnd: 2000,
		duration: 10,
		fps: 30,
		orientation: 'portrait',
		height: 1920,
		width: 1080,
		deviceName: 'iPhone 14',
		isPrimary: true,
		metadata: 'mock-metadata',
	};

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup store mocks
		mockUseUploadsStore.getState.mockReturnValue(mockUploadsState);
		mockUseUserStore.getState.mockReturnValue(mockUserState);
		mockUseEventStore.getState.mockReturnValue(mockEventState);

		// Setup default HTTP responses
		mockCameraHttp.uploadEventVideo.mockResolvedValue({ status: 200 });
		mockEventPostHTTP.generateAudioFileForPost.mockResolvedValue({ status: 200 });
		mockUserStoreHttp.refreshUser.mockResolvedValue();
		mockUserStoreHttp.tryLogout.mockResolvedValue();

		// Setup utility mocks
		mockFileAction.getVideoMetadata.mockResolvedValue({
			height: 1920,
			width: 1080,
			metadata: 'mock-metadata',
		});
		mockDelay.mockResolvedValue(undefined);
	});

	describe('uploadEventMedia', () => {
		it('should successfully upload event media', async () => {
			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: expect.objectContaining({
					uri: '/path/to/video.mp4',
					name: 'video.mp4',
					type: 'video/mp4',
				}),
				token: 'mock-access-token',
			});
			expect(mockDelay).toHaveBeenCalledWith(1000);
			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Success',
				}),
			);
		});

		it('should handle missing eventId', async () => {
			const payloadWithoutEventId = { ...mockCameraUploadPayload, eventId: '' };

			await UploadStoreHttp.uploadEventMedia(payloadWithoutEventId);

			expect(Alert.alert).toHaveBeenCalledWith('Upload Error', 'Missing Event ID');
			expect(mockCameraHttp.uploadEventVideo).not.toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			mockCameraHttp.uploadEventVideo
				.mockResolvedValueOnce({ status: 403, message: '403 Forbidden' })
				.mockResolvedValueOnce({ status: 200 });

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockDelay).toHaveBeenCalledWith(2000);
		});

		it('should handle 403 error and logout after max retries', async () => {
			mockCameraHttp.uploadEventVideo.mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other HTTP errors', async () => {
			mockCameraHttp.uploadEventVideo.mockResolvedValue({
				status: 500,
				message: 'Internal Server Error',
			});

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});

		it('should handle caught errors', async () => {
			const error = { message: 'Network error', code: 'NETWORK_ERROR' };
			mockCameraHttp.uploadEventVideo.mockRejectedValue(error);

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});

		it('should handle empty error objects', async () => {
			mockCameraHttp.uploadEventVideo.mockRejectedValue({});

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(Toast.show).not.toHaveBeenCalled();
		});

		it('should add item to upload queue if not already present', async () => {
			mockUploadsState.uploadQueue = [];

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockUploadsState.setUploadQueue).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						eventId: 'event-123',
						userId: 'user-123',
						status: 100,
					}),
				]),
			);
		});

		it('should not add duplicate items to upload queue', async () => {
			const existingItem = {
				id: 'existing-id',
				eventId: 'event-123',
				userId: 'user-123',
				payload: { ...mockUploadPayload, uri: '/path/to/video.mp4' },
				status: 100,
				error: null,
			};
			mockUploadsState.uploadQueue = [existingItem] as any;

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			// Should not call setUploadQueue when item already exists
			expect(mockUploadsState.setUploadQueue).not.toHaveBeenCalled();
		});
	});

	describe('retryUploadMedia', () => {
		const mockRetryData = {
			eventId: 'event-123',
			payload: mockUploadPayload,
		};

		it('should successfully retry upload', async () => {
			await UploadStoreHttp.retryUploadMedia(mockRetryData);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith({
				eventId: 'event-123',
				payload: mockUploadPayload,
				token: 'mock-access-token',
			});
			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Success',
				}),
			);
		});

		it('should handle missing eventId', async () => {
			const dataWithoutEventId = { ...mockRetryData, eventId: null };

			await UploadStoreHttp.retryUploadMedia(dataWithoutEventId);

			expect(Alert.alert).toHaveBeenCalledWith('Upload Error', 'Missing Event ID');
			expect(mockCameraHttp.uploadEventVideo).not.toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			mockCameraHttp.uploadEventVideo
				.mockResolvedValueOnce({ status: 403, message: '403 Forbidden' })
				.mockResolvedValueOnce({ status: 200 });

			await UploadStoreHttp.retryUploadMedia(mockRetryData);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
		});

		it('should handle 403 error and logout after max retries', async () => {
			mockCameraHttp.uploadEventVideo.mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await UploadStoreHttp.retryUploadMedia(mockRetryData);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle caught errors', async () => {
			const error = new Error('Network error');
			mockCameraHttp.uploadEventVideo.mockRejectedValue(error);

			await UploadStoreHttp.retryUploadMedia(mockRetryData);

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});
	});

	describe('uploadPackageMedia', () => {
		it('should successfully upload package media', async () => {
			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith({
				eventId: 'event-456', // Uses connected event ID
				payload: expect.objectContaining({
					uri: '/path/to/video.mp4',
					name: 'video.mp4',
					type: 'video/mp4',
				}),
				token: 'mock-access-token',
			});
			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Success',
				}),
			);
		});

		it('should handle missing eventId', async () => {
			const userStateWithoutEvent = {
				...mockUserState,
				profile: {
					...mockUserState.profile,
					eventConnected: null,
				},
			} as any;
			mockUseUserStore.getState.mockReturnValue(userStateWithoutEvent);

			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(Alert.alert).toHaveBeenCalledWith('Upload Error', 'Missing Event ID');
			expect(mockCameraHttp.uploadEventVideo).not.toHaveBeenCalled();
		});

		it('should handle 403 error', async () => {
			mockCameraHttp.uploadEventVideo.mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});

		it('should handle caught errors', async () => {
			const error = { message: 'Network error', code: 'NETWORK_ERROR' };
			mockCameraHttp.uploadEventVideo.mockRejectedValue(error);

			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});

		it('should handle empty error objects', async () => {
			mockCameraHttp.uploadEventVideo.mockRejectedValue({});

			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(Toast.show).not.toHaveBeenCalled();
		});

		it('should add item to package upload queue if not already present', async () => {
			mockUploadsState.packageUploadQueue = [];

			await UploadStoreHttp.uploadPackageMedia(mockCameraUploadPayload);

			expect(mockUploadsState.setPackageUploadQueue).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						eventId: 'event-456',
						userId: 'user-123',
						status: 100,
					}),
				]),
			);
		});
	});

	describe('generateAudioFileForPost', () => {
		it('should successfully generate audio file', async () => {
			await UploadStoreHttp.generateAudioFileForPost();

			expect(mockEventPostHTTP.generateAudioFileForPost).toHaveBeenCalledWith({
				postId: 'post-789',
				accessToken: 'mock-access-token',
			});
			expect(mockDelay).toHaveBeenCalledWith(5000);
			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Success',
				}),
			);
		});

		it('should handle missing postId', async () => {
			const eventStateWithoutPost = {
				...mockEventState,
				viewEvent: {
					...mockEventState.viewEvent,
					managerVideo: null,
				},
			} as any;
			mockUseEventStore.getState.mockReturnValue(eventStateWithoutPost);

			await UploadStoreHttp.generateAudioFileForPost();

			expect(Alert.alert).toHaveBeenCalledWith('Upload Error', 'Missing Post ID');
			expect(mockEventPostHTTP.generateAudioFileForPost).not.toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			mockEventPostHTTP.generateAudioFileForPost
				.mockResolvedValueOnce({ status: 403, message: '403 Forbidden' })
				.mockResolvedValueOnce({ status: 200 });

			await UploadStoreHttp.generateAudioFileForPost();

			expect(mockEventPostHTTP.generateAudioFileForPost).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockDelay).toHaveBeenCalledWith(2000);
		});

		it('should handle 403 error and logout after max retries', async () => {
			mockEventPostHTTP.generateAudioFileForPost.mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			await UploadStoreHttp.generateAudioFileForPost();

			expect(mockEventPostHTTP.generateAudioFileForPost).toHaveBeenCalledTimes(2);
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle caught errors', async () => {
			const error = new Error('Network error');
			mockEventPostHTTP.generateAudioFileForPost.mockRejectedValue(error);

			await UploadStoreHttp.generateAudioFileForPost();

			expect(Toast.show).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'Error',
				}),
			);
		});
	});

	describe('Platform-specific behavior', () => {
		it('should handle Android file paths correctly', async () => {
			// Mock Platform.OS for Android
			(Platform.OS as any) = 'android';

			const androidPayload = {
				...mockCameraUploadPayload,
				media: {
					...mockCameraUploadPayload.media,
					data: 'file:///path/to/video.mp4',
				},
			};

			await UploadStoreHttp.uploadEventMedia(androidPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						uri: '/path/to/video.mp4', // Should remove 'file://' prefix
					}),
				}),
			);
		});

		it('should handle iOS file paths correctly', async () => {
			// Mock Platform.OS for iOS
			(Platform.OS as any) = 'ios';

			const iosPayload = {
				...mockCameraUploadPayload,
				media: {
					...mockCameraUploadPayload.media,
					data: 'file:///path/to/video.mp4',
				},
			};

			await UploadStoreHttp.uploadEventMedia(iosPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						uri: 'file:///path/to/video.mp4', // Should keep 'file://' prefix
					}),
				}),
			);
		});
	});

	describe('File metadata handling', () => {
		it('should include metadata when available', async () => {
			mockFileAction.getVideoMetadata.mockResolvedValue({
				height: 1920,
				width: 1080,
				metadata: 'test-metadata',
			});

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						metadata: 'test-metadata',
					}),
				}),
			);
		});

		it('should handle missing metadata gracefully', async () => {
			mockFileAction.getVideoMetadata.mockResolvedValue(undefined);

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						metadata: '',
					}),
				}),
			);
		});

		it('should handle metadata object without metadata property', async () => {
			mockFileAction.getVideoMetadata.mockResolvedValue({
				height: 1920,
				width: 1080,
				someOtherProperty: 'value',
			} as any);

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						metadata: '',
					}),
				}),
			);
		});
	});

	describe('Error handling edge cases', () => {
		it('should handle undefined tokens', async () => {
			const userStateWithoutToken = {
				...mockUserState,
				tokens: null,
			} as any;
			mockUseUserStore.getState.mockReturnValue(userStateWithoutToken);

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalledWith(
				expect.objectContaining({
					token: '',
				}),
			);
		});

		it('should handle undefined profile', async () => {
			const userStateWithoutProfile = {
				...mockUserState,
				profile: null,
			} as any;
			mockUseUserStore.getState.mockReturnValue(userStateWithoutProfile);

			// Reset queue to ensure item gets added
			mockUploadsState.uploadQueue = [];

			await UploadStoreHttp.uploadEventMedia(mockCameraUploadPayload);

			expect(mockUploadsState.setUploadQueue).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						userId: '',
					}),
				]),
			);
		});

		it('should handle unsupported media types', async () => {
			const unsupportedPayload = {
				...mockCameraUploadPayload,
				type: 'image',
			};

			await UploadStoreHttp.uploadEventMedia(unsupportedPayload);

			// Should still attempt upload but with minimal payload
			expect(mockCameraHttp.uploadEventVideo).toHaveBeenCalled();
		});
	});
});
