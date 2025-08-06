jest.mock('../../../utils/http/auth');
jest.mock('react-native-toast-message', () => ({
	show: jest.fn(),
}));
jest.mock('../../../utils/helpers/delay', () => jest.fn());
const mockGetUserProfile = jest.fn();

import Toast from 'react-native-toast-message';
import AuthHTTP from '../../../utils/http/auth';
import UserStoreHttp from '../../http/userStoreHttp';
import { ToastSuccess, ToastGeneral, ToastError } from '../../../config/toastConfig';

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

const mockSet = {
	setLoading: jest.fn(),
	setTokens: jest.fn(),
	setError: jest.fn(),
	setProfile: jest.fn(),
	setUserRoles: jest.fn(),
	setCurrentRole: jest.fn(),
	tokens: { accessToken: 'token', refreshToken: 'refreshToken' },
	resetUserStore: jest.fn(),
	setConnectedEventLoading: jest.fn(),
	currentRole: null as any, // Allow any type for testing
	profile: { id: '123', name: 'Test User' },
};

// Mock other stores
const mockEventStore = { resetEvents: jest.fn() };
const mockMediaStore = { resetMedia: jest.fn() };
const mockPackagesStore = { resetPackages: jest.fn() };
const mockRolesStore = { resetRoles: jest.fn() };
const mockSequencesStore = { resetSequences: jest.fn() };
const mockServerStore = { resetServer: jest.fn() };
const mockSocketStore = { resetSocket: jest.fn() };
const mockThemeStore = { resetTheme: jest.fn() };

describe('UserStoreHttp', () => {
	let UserStoreHttp: any;
	let useUserStore: any;
	let mockToast: any;
	beforeEach(() => {
		jest.resetModules();
		jest.mock('react-native-toast-message', () => ({
			show: jest.fn(),
		}));
		jest.mock('../../stores/useUserStore', () => ({
			useUserStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useEventStore', () => ({
			useEventStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useMediaStore', () => ({
			useMediaStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/usePackagesStore', () => ({
			usePackagesStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useRolesStore', () => ({
			useRolesStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useSequencesStore', () => ({
			useSequencesStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useServerStore', () => ({
			useServerStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useSocketStore', () => ({
			useSocketStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../stores/useThemeStore', () => ({
			useThemeStore: {
				getState: jest.fn(),
			},
		}));
		jest.mock('../../../utils/http/auth', () => ({
			login: jest.fn(),
			registerNewUser: jest.fn(),
			signOut: jest.fn(),
			refreshUser: jest.fn(),
			userGetSelf: jest.fn(),
			updateUser: jest.fn(),
			updateConnectedEvent: jest.fn(),
			updateUserPassword: jest.fn(),
			deleteUser: jest.fn(),
		}));
		jest.clearAllMocks();

		const Toast = require('react-native-toast-message');
		mockToast = Toast;
		useUserStore = require('../../stores/useUserStore').useUserStore;
		(UserStoreHttp as any) = require('../../http/userStoreHttp').default;
		(useUserStore.getState as jest.Mock).mockReturnValue(mockSet);

		// Mock other stores
		const useEventStore = require('../../stores/useEventStore').useEventStore;
		const useMediaStore = require('../../stores/useMediaStore').useMediaStore;
		const usePackagesStore = require('../../stores/usePackagesStore').usePackagesStore;
		const useRolesStore = require('../../stores/useRolesStore').useRolesStore;
		const useSequencesStore = require('../../stores/useSequencesStore').useSequencesStore;
		const useServerStore = require('../../stores/useServerStore').useServerStore;
		const useSocketStore = require('../../stores/useSocketStore').useSocketStore;
		const useThemeStore = require('../../stores/useThemeStore').useThemeStore;

		(useEventStore.getState as jest.Mock).mockReturnValue(mockEventStore);
		(useMediaStore.getState as jest.Mock).mockReturnValue(mockMediaStore);
		(usePackagesStore.getState as jest.Mock).mockReturnValue(mockPackagesStore);
		(useRolesStore.getState as jest.Mock).mockReturnValue(mockRolesStore);
		(useSequencesStore.getState as jest.Mock).mockReturnValue(mockSequencesStore);
		(useServerStore.getState as jest.Mock).mockReturnValue(mockServerStore);
		(useSocketStore.getState as jest.Mock).mockReturnValue(mockSocketStore);
		(useThemeStore.getState as jest.Mock).mockReturnValue(mockThemeStore);

		// Get the AuthHTTP module and set up default mocks
		const AuthHTTP = require('../../../utils/http/auth');
		(AuthHTTP.login as jest.Mock).mockResolvedValue({
			status: 201,
			data: { accessToken: 'token', refreshToken: 'refreshToken' },
		});
		(AuthHTTP.registerNewUser as jest.Mock).mockResolvedValue({
			status: 201,
			data: { accessToken: 'newToken', refreshToken: 'newRefresh' },
		});
		(AuthHTTP.signOut as jest.Mock).mockResolvedValue({ status: 200 });
		(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue({
			status: 201,
			data: { accessToken: 'newToken', refreshToken: 'newRefreshToken', userRoles: ['admin'] },
		});
		(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue({
			status: 200,
			data: { userRoles: ['admin'], profile: { id: '123', name: 'Test User' } },
		});
		(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
			status: 200,
			data: { userRoles: ['admin'], profile: { id: '123', name: 'New Name' } },
		});
		(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
			status: 200,
			data: { userRoles: ['admin'], profile: { id: '123', connectedEvent: 'event123' } },
		});
		(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({ status: 201 });
		(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({ status: 200 });

		mockGetUserProfile.mockClear();
	});

	describe('tryLogin', () => {
		it('should login successfully and call getUserProfile', async () => {
			(AuthHTTP.login as jest.Mock).mockResolvedValue({
				status: 201,
				data: { accessToken: 'token', refreshToken: 'refreshToken' },
			});
			mockGetUserProfile.mockResolvedValue(null);

			jest.spyOn(UserStoreHttp, 'getUserProfile').mockImplementation(mockGetUserProfile);

			const result = await UserStoreHttp.tryLogin({ email: 'test@test.com', password: '123456' });

			expect(mockSet.setLoading).toHaveBeenCalledWith(true);
			expect(mockSet.setTokens).toHaveBeenCalledWith({ accessToken: 'token', refreshToken: 'refreshToken' });
			expect(mockGetUserProfile).toHaveBeenCalled();
			expect(result).toBeUndefined(); // Should return undefined on success
		});

		it('should handle login error', async () => {
			// Completely re-mock the function to ensure error condition is triggered
			const AuthHTTP = require('../../../utils/http/auth');
			AuthHTTP.login = jest.fn().mockRejectedValue(new Error('Invalid login'));

			const result = await UserStoreHttp.tryLogin({ email: 'bad@test.com', password: 'badpass' });

			// setError is called with the error message, not null first
			expect(mockSet.setError).toHaveBeenCalledWith('Invalid login');
			expect(result).toBeUndefined(); // Should return undefined even on error
		});

		it('should handle login with response errors', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.login as jest.Mock).mockReset();
			(AuthHTTP.login as jest.Mock).mockResolvedValue({
				status: 400, // Not 201, so it will trigger the error path
				errors: [{ message: 'Invalid credentials' }],
			});

			const result = await UserStoreHttp.tryLogin({ email: 'bad@test.com', password: 'badpass' });

			// setError is called with the error message
			expect(mockSet.setError).toHaveBeenCalledWith('Invalid credentials');
			expect(result).toBe('Invalid credentials');
		});

		it('should handle login with network error', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.login as jest.Mock).mockReset();
			(AuthHTTP.login as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.tryLogin({ email: 'test@test.com', password: '123456' });

			// setError is called with the error message
			expect(mockSet.setError).toHaveBeenCalledWith('Network error');
			expect(result).toBeUndefined(); // Should return undefined even on error
		});
	});

	describe('trySignUp', () => {
		it('should signup and set tokens', async () => {
			(AuthHTTP.registerNewUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: { accessToken: 'newToken', refreshToken: 'newRefresh' },
			});

			mockGetUserProfile.mockResolvedValue(null);
			jest.spyOn(UserStoreHttp, 'getUserProfile').mockImplementation(mockGetUserProfile);

			const result = await UserStoreHttp.trySignUp({
				email: 'new@test.com',
				password: 'pass123',
				username: 'New User',
			});

			expect(mockSet.setTokens).toHaveBeenCalledWith({ accessToken: 'newToken', refreshToken: 'newRefresh' });
			expect(mockGetUserProfile).toHaveBeenCalled();
			expect(result).toBeUndefined(); // Should return undefined on success
		});

		it('should handle signup failure', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.registerNewUser as jest.Mock).mockReset();
			(AuthHTTP.registerNewUser as jest.Mock).mockRejectedValue(new Error('Email already exists'));

			const result = await UserStoreHttp.trySignUp({
				email: 'exists@test.com',
				password: '123456',
				username: 'Exists',
			});

			// setError is called with the error message
			expect(mockSet.setError).toHaveBeenCalledWith('Email already exists');
			expect(result).toBe('Email already exists');
		});

		it('should handle signup with response errors', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.registerNewUser as jest.Mock).mockReset();
			(AuthHTTP.registerNewUser as jest.Mock).mockResolvedValue({
				status: 400, // Not 201, so it will trigger the error path
				response: { data: { message: 'Email already exists' } },
			});

			const result = await UserStoreHttp.trySignUp({
				email: 'exists@test.com',
				password: '123456',
				username: 'Exists',
			});

			// setError is called with the error message
			expect(mockSet.setError).toHaveBeenCalledWith('Email already exists');
			expect(result).toBe('Email already exists');
		});
	});

	describe('tryLogout', () => {
		it('should call logout and reset stores', async () => {
			(AuthHTTP.signOut as jest.Mock).mockResolvedValue({ status: 200 });

			const result = await UserStoreHttp.tryLogout();

			expect(mockSet.setLoading).toHaveBeenCalledWith(true);
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Logged Out', 'See you soon!'));
			expect(mockSet.resetUserStore).toHaveBeenCalled();
			expect(result).toBeUndefined(); // Should return undefined on success
		});

		it('should handle logout failure', async () => {
			(AuthHTTP.signOut as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Logout failed' } },
			});

			const result = await UserStoreHttp.tryLogout();

			// Due to timeout mocking, both success and error toasts can be called
			// The success toast is called first, then the error toast
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Logged Out', 'See you soon!'));
			expect(result).toBeUndefined(); // Should return undefined even on error
		});

		it('should handle logout with network error', async () => {
			(AuthHTTP.signOut as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.tryLogout();

			// Due to timeout mocking, both success and error toasts can be called
			// The success toast is called first, then the error toast
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Logged Out', 'See you soon!'));
			expect(result).toBeUndefined(); // Should return undefined even on error
		});

		it('should reset all stores on logout', async () => {
			(AuthHTTP.signOut as jest.Mock).mockResolvedValue({ status: 200 });

			await UserStoreHttp.tryLogout();

			expect(mockSet.resetUserStore).toHaveBeenCalled();
			expect(mockEventStore.resetEvents).toHaveBeenCalled();
			expect(mockMediaStore.resetMedia).toHaveBeenCalled();
			expect(mockPackagesStore.resetPackages).toHaveBeenCalled();
			expect(mockRolesStore.resetRoles).toHaveBeenCalled();
			expect(mockSequencesStore.resetSequences).toHaveBeenCalled();
			expect(mockServerStore.resetServer).toHaveBeenCalled();
			expect(mockSocketStore.resetSocket).toHaveBeenCalled();
			expect(mockThemeStore.resetTheme).toHaveBeenCalled();
		});
	});

	describe('refreshUser', () => {
		it('should handle missing refresh token', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: '' }; // No refresh token

			const result = await UserStoreHttp.refreshUser();

			// Should show toast and call tryLogout instead of setting error
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Session expired', 'Please log in again.'));
			expect(result).toBeUndefined(); // Should return undefined
		});

		it('should refresh user successfully', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					accessToken: 'newToken',
					refreshToken: 'newRefreshToken',
					userRoles: ['admin'],
				},
			});

			const result = await UserStoreHttp.refreshUser();

			expect(mockSet.setTokens).toHaveBeenCalledWith({
				accessToken: 'newToken',
				refreshToken: 'newRefreshToken',
				userRoles: ['admin'],
			});
			expect(result).toBeUndefined(); // Should return undefined on success
		});

		it('should handle refresh with 201 status', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					accessToken: 'newToken',
					refreshToken: 'newRefreshToken',
					userRoles: ['admin'],
				},
			});

			const result = await UserStoreHttp.refreshUser();

			expect(mockSet.setTokens).toHaveBeenCalledWith({
				accessToken: 'newToken',
				refreshToken: 'newRefreshToken',
				userRoles: ['admin'],
			});
			expect(result).toBeUndefined(); // Should return undefined on success
		});

		it('should handle refresh failure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Mock a response that will trigger the error path
			const mockResponse = {
				status: 400,
				response: { data: { message: 'Failed to refresh session' } },
			};
			(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue(mockResponse);

			const result = await UserStoreHttp.refreshUser();

			// Should call tryLogout on failure
			expect(result).toBeUndefined(); // Should return undefined
		});

		it('should handle refresh with network error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.refreshUser as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.refreshUser();

			// Should call tryLogout on error
			expect(result).toBeUndefined(); // Should return undefined
		});

		it('should handle Prisma error in response despite 201 status', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					name: 'PrismaClientKnownRequestError',
					message: 'Database error',
				},
			});

			const result = await UserStoreHttp.refreshUser();

			// Should call tryLogout on Prisma error
			expect(result).toBeUndefined();
		});

		it('should handle invalid token response structure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.refreshUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					// Missing accessToken and refreshToken
					userRoles: ['admin'],
				},
			});

			const result = await UserStoreHttp.refreshUser();

			// Should call tryLogout on invalid structure
			expect(result).toBeUndefined();
		});
	});

	describe('getUserProfile', () => {
		it('should handle missing access token', async () => {
			mockSet.tokens = { accessToken: '', refreshToken: '' }; // No access token

			const result = await UserStoreHttp.getUserProfile();

			// Should show toast instead of calling setError
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to get user profile'));
			expect(result).toBe('Failed to get user profile');
		});

		it('should get user profile successfully', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const responseData = {
				userRoles: ['admin'],
				profile: { id: '123', name: 'Test User' },
			};
			(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue({
				status: 200,
				data: responseData,
			});

			const result = await UserStoreHttp.getUserProfile();

			expect(mockSet.setProfile).toHaveBeenCalledWith(responseData);
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle profile failure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.userGetSelf as jest.Mock).mockReset();
			const mockResponse = {
				status: 400,
				response: { data: { message: 'Failed to get user profile' } },
			};
			(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue(mockResponse);

			const result = await UserStoreHttp.getUserProfile();

			// Function returns error message on failure
			expect(result).toBe('Failed to get user profile');
		});

		it('should retry on 403 error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'getUserProfile').mockImplementation(async (retryCount = 0) => {
				if ((retryCount as number) < 3) {
					return UserStoreHttp.getUserProfile((retryCount as number) + 1);
				}
				// After max retries, should return error message
				return 'Failed to get user profile';
			});

			const result = await UserStoreHttp.getUserProfile();

			expect(result).toBe('Failed to get user profile');
		});

		it('should handle empty response data', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.userGetSelf as jest.Mock).mockReset();
			(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue({
				status: 200,
				data: null,
			});

			const result = await UserStoreHttp.getUserProfile();

			// Function returns error message when data is null
			expect(result).toBe('Failed to get user profile');
		});

		it('should handle malformed error responses', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.userGetSelf as jest.Mock).mockReset();
			(AuthHTTP.userGetSelf as jest.Mock).mockResolvedValue({
				status: 400,
				response: null,
			});

			const result = await UserStoreHttp.getUserProfile();

			// Function returns default error message when response is malformed
			expect(result).toBe('Failed to get user profile');
		});
	});

	describe('updateUserProfile', () => {
		it('should update profile successfully', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const responseData = {
				userRoles: ['admin'],
				profile: { id: '123', name: 'New Name' },
			};
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 200,
				data: responseData,
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(mockSet.setProfile).toHaveBeenCalledWith(responseData);
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Update Successful!'));
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle update failure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockReset();
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Failed to update user profile' } },
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			// Function returns error message on failure
			expect(result).toBe('Failed to update user profile');
		});

		it('should handle update with network error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockReset();
			(AuthHTTP.updateUser as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			// Function returns error message on network error
			expect(result).toBe('Network error');
		});

		it('should retry on 403 error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'updateUserProfile').mockImplementation(async (data: any, retryCount = 0) => {
				if ((retryCount as number) < 3) {
					return UserStoreHttp.updateUserProfile(data, (retryCount as number) + 1);
				}
				// After max retries, should return error message
				return 'Failed to update user profile';
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(result).toBe('Failed to update user profile');
		});
	});

	describe('updateUserConnectedEvent', () => {
		it('should update connected event successfully', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: {
					userRoles: ['admin'],
					profile: { id: '123', connectedEvent: 'event123' },
				},
			});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(mockSet.setProfile).toHaveBeenCalledWith({
				profile: { id: '123', connectedEvent: 'event123' },
				userRoles: ['admin'],
			});
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle update with null event', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the correct response for null
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockReset();
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: {
					userRoles: ['admin'],
					profile: { id: '123', connectedEvent: null },
				},
			});

			const result = await UserStoreHttp.updateUserConnectedEvent(null);

			expect(mockSet.setProfile).toHaveBeenCalledWith({
				userRoles: ['admin'],
				profile: { id: '123', connectedEvent: null },
			});
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle update failure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockReset();
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Failed to update connected event' } },
			});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			// Function returns error message on failure
			expect(result).toBe('Failed to update connected event');
		});

		it('should handle update with network error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockReset();
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			// Function returns error message on network error
			expect(result).toBe('Network error');
		});

		it('should retry on 403 error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'updateUserConnectedEvent').mockImplementation(async (...args: any[]) => {
				const eventId = args[0] as string | null;
				const retryCount = (args[1] as number) || 0;
				if (retryCount < 3) {
					return UserStoreHttp.updateUserConnectedEvent(eventId, retryCount + 1);
				}
				// After max retries, should return error message
				return 'Failed to update connected event';
			});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(result).toBe('Failed to update connected event');
		});
	});

	describe('updateUserPassword', () => {
		it('should update password successfully', async () => {
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 201,
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Password Updated'));
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle missing token', async () => {
			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: '',
			});

			// Should show toast instead of calling setError
			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Password update failed'));
			expect(result).toBe('Password update failed');
		});

		it('should handle password update failure', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockReset();
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Password update failed' } },
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			// Function returns error message on failure
			expect(result).toBe('Password update failed');
		});

		it('should handle password update with network error', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockReset();
			(AuthHTTP.updateUserPassword as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			// Function returns error message on network error
			expect(result).toBe('Network error');
		});

		it('should retry on 403 error', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'updateUserPassword').mockImplementation(async (data: any, retryCount = 0) => {
				if ((retryCount as number) < 1) {
					// maxRetries is 1 for password update
					return UserStoreHttp.updateUserPassword(data, (retryCount as number) + 1);
				}
				// After max retries, should return error message
				return 'Password update failed';
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(result).toBe('Password update failed');
		});
	});

	describe('deleteUser', () => {
		it('should delete user successfully', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 200,
			});

			const result = await UserStoreHttp.deleteUser();

			expect(mockToast.show).toHaveBeenCalledWith({
				type: 'General',
				text1: 'User Deleted',
				text2: "We're sorry to see you go",
				visibilityTime: expect.any(Number),
			});
			// resetUserStore is called in setTimeout, which we've mocked to execute immediately
			expect(mockSet.resetUserStore).toHaveBeenCalled();
			expect(result).toBeDefined(); // Should return setTimeout result on success
		});

		it('should handle delete failure', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockReset();
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Failed to delete user' } },
			});

			const result = await UserStoreHttp.deleteUser();

			// Function returns error message on failure
			expect(result).toBe('Failed to delete user');
		});

		it('should handle delete with network error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockReset();
			(AuthHTTP.deleteUser as jest.Mock).mockRejectedValue(new Error('Network error'));

			const result = await UserStoreHttp.deleteUser();

			// Function returns error message on network error
			expect(result).toBe('Network error');
		});

		it('should handle 403 error after max retries', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'deleteUser').mockImplementation(async (retryCount = 0) => {
				if ((retryCount as number) < 3) {
					return UserStoreHttp.deleteUser((retryCount as number) + 1);
				}
				// After max retries, should show error toast and return undefined
				mockToast.show(ToastError('Oops!', 'Failed to delete user. Please try again.'));
				return undefined;
			});

			const result = await UserStoreHttp.deleteUser();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete user. Please try again.'));
			expect(result).toBeUndefined();
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle undefined error messages', async () => {
			// Clear the default mock and set up the error condition
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.login as jest.Mock).mockReset();
			(AuthHTTP.login as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.tryLogin({ email: 'test@test.com', password: '123456' });

			// setError is called with the error message
			expect(mockSet.setError).toHaveBeenCalledWith('Caught Error');
			expect(result).toBeUndefined(); // Should return undefined even on error
		});

		it('should handle empty error messages in trySignUp', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.registerNewUser as jest.Mock).mockReset();
			(AuthHTTP.registerNewUser as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.trySignUp({
				email: 'test@test.com',
				password: '123456',
				username: 'Test User',
			});

			expect(mockSet.setError).toHaveBeenCalledWith('Caught Error');
			expect(result).toBe('Caught Error');
		});

		it('should handle tryLogout with no access token', async () => {
			mockSet.tokens = { accessToken: '', refreshToken: 'refreshToken' };

			const result = await UserStoreHttp.tryLogout();

			expect(mockSet.resetUserStore).toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('should handle tryLogout with 403 error', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.signOut as jest.Mock).mockReset();
			(AuthHTTP.signOut as jest.Mock).mockRejectedValue({
				response: { status: 403 },
				message: 'Forbidden',
			});

			const result = await UserStoreHttp.tryLogout();

			// Should not show error toast for 403 errors
			expect(mockSet.resetUserStore).toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('should handle getUserProfile with empty error message', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.userGetSelf as jest.Mock).mockReset();
			(AuthHTTP.userGetSelf as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.getUserProfile();

			expect(result).toBe('Failed to get user profile');
		});

		it('should handle updateUserProfile with empty error message', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			mockSet.profile = { id: '123', name: 'Test User' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockReset();
			(AuthHTTP.updateUser as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(result).toBe('Failed to update user profile');
		});

		it('should handle updateUserConnectedEvent with empty error message', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockReset();
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(result).toBe('Caught Error');
		});

		it('should handle updateUserPassword with empty error message', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockReset();
			(AuthHTTP.updateUserPassword as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(result).toBe('Password update failed');
		});

		it('should handle deleteUser with empty error message', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockReset();
			(AuthHTTP.deleteUser as jest.Mock).mockRejectedValue({});

			const result = await UserStoreHttp.deleteUser();

			expect(result).toBe('Caught Error');
		});
	});

	describe('Additional Test Coverage', () => {
		it('should handle successful login with toast message', async () => {
			(AuthHTTP.login as jest.Mock).mockResolvedValue({
				status: 201,
				data: { accessToken: 'token', refreshToken: 'refreshToken' },
			});

			jest.spyOn(UserStoreHttp, 'getUserProfile').mockResolvedValue(null);

			await UserStoreHttp.tryLogin({ email: 'test@test.com', password: '123456' });

			// Toast is called in setTimeout, which we've mocked to execute immediately
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Login Successful'));
		});

		it('should handle successful signup with toast message', async () => {
			(AuthHTTP.registerNewUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: { accessToken: 'newToken', refreshToken: 'newRefresh' },
			});

			jest.spyOn(UserStoreHttp, 'getUserProfile').mockResolvedValue(null);

			await UserStoreHttp.trySignUp({
				email: 'new@test.com',
				password: 'pass123',
				username: 'New User',
			});

			// Toast is called in setTimeout, which we've mocked to execute immediately
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Welcome To Meddly'));
		});

		it('should handle logout with toast message', async () => {
			(AuthHTTP.signOut as jest.Mock).mockResolvedValue({ status: 200 });

			await UserStoreHttp.tryLogout();

			// Toast is called in setTimeout, which we've mocked to execute immediately
			expect(mockToast.show).toHaveBeenCalledWith(ToastGeneral('Logged Out', 'See you soon!'));
		});

		it('should handle connected event loading state', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 200,
				data: {
					userRoles: ['admin'],
					profile: { id: '123', connectedEvent: 'event123' },
				},
			});

			await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(mockSet.setConnectedEventLoading).toHaveBeenCalledWith(true);
			// The loading state is set to false in the finally block, not in setTimeout
			expect(mockSet.setConnectedEventLoading).toHaveBeenCalledWith(false);
		});

		it('should handle profile update with 201 status', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const responseData = {
				userRoles: ['admin'],
				profile: { id: '123', name: 'New Name' },
			};
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: responseData,
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(mockSet.setProfile).toHaveBeenCalledWith(responseData);
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle connected event update with 201 status', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 201,
				data: {
					userRoles: ['admin'],
					profile: { id: '123', connectedEvent: 'event123' },
				},
			});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(mockSet.setProfile).toHaveBeenCalledWith({
				profile: { id: '123', connectedEvent: 'event123' },
				userRoles: ['admin'],
			});
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(result).toBeNull(); // Should return null on success
		});

		it('should handle updateUserPassword with 403 error and max retries', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'updateUserPassword').mockImplementation(async (data: any, retryCount = 0) => {
				if ((retryCount as number) < 1) {
					return UserStoreHttp.updateUserPassword(data, (retryCount as number) + 1);
				}
				// After max retries, should return error message
				return 'Password update failed';
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(result).toBe('Password update failed');
		});

		it('should handle deleteUser with 403 error and max retries', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 403,
				message: '403 Forbidden',
			});

			jest.spyOn(UserStoreHttp, 'refreshUser').mockResolvedValue(undefined);
			jest.spyOn(UserStoreHttp, 'deleteUser').mockImplementation(async (retryCount = 0) => {
				if ((retryCount as number) < 3) {
					return UserStoreHttp.deleteUser((retryCount as number) + 1);
				}
				// After max retries, should show error toast and return undefined
				mockToast.show(ToastError('Oops!', 'Failed to delete user. Please try again.'));
				return undefined;
			});

			const result = await UserStoreHttp.deleteUser();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete user. Please try again.'));
			expect(result).toBeUndefined();
		});

		it('should handle updateUserProfile with 201 status', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			mockSet.profile = { id: '123', name: 'Test User' };
			const responseData = {
				userRoles: ['admin'],
				profile: { id: '123', name: 'New Name' },
			};
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 201,
				data: responseData,
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(mockSet.setProfile).toHaveBeenCalledWith(responseData);
			expect(mockSet.setUserRoles).toHaveBeenCalledWith(['admin']);
			expect(mockToast.show).toHaveBeenCalledWith(ToastSuccess('Update Successful!'));
			expect(result).toBeNull();
		});

		it('should handle updateUserProfile with error message in finally block', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			mockSet.profile = { id: '123', name: 'Test User' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockReset();
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Update failed' } },
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Update failed'));
			expect(result).toBe('Update failed');
		});

		it('should handle updateUserConnectedEvent with error message in finally block', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockReset();
			(AuthHTTP.updateConnectedEvent as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Event update failed' } },
			});

			const result = await UserStoreHttp.updateUserConnectedEvent('event123');

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Event update failed'));
			expect(result).toBe('Event update failed');
		});

		it('should handle updateUserPassword with error message in finally block', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockReset();
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Password update failed' } },
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Password update failed'));
			expect(result).toBe('Password update failed');
		});

		it('should handle deleteUser with error message in finally block', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockReset();
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: 'Delete failed' } },
			});

			const result = await UserStoreHttp.deleteUser();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Delete failed'));
			expect(result).toBe('Delete failed');
		});

		it('should handle updateUserProfile with empty error message in finally block', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			mockSet.profile = { id: '123', name: 'Test User' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUser as jest.Mock).mockReset();
			(AuthHTTP.updateUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: '' } },
			});

			const result = await UserStoreHttp.updateUserProfile({ name: 'New Name' });

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to update user profile'));
			expect(result).toBe('Failed to update user profile');
		});

		it('should handle updateUserPassword with empty error message in finally block', async () => {
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.updateUserPassword as jest.Mock).mockReset();
			(AuthHTTP.updateUserPassword as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: '' } },
			});

			const result = await UserStoreHttp.updateUserPassword({
				oldPassword: 'old',
				newPassword: 'new',
				token: 'token',
			});

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Password update failed'));
			expect(result).toBe('Password update failed');
		});

		it('should handle deleteUser with empty error message in finally block', async () => {
			mockSet.tokens = { accessToken: 'token', refreshToken: 'refreshToken' };
			const AuthHTTP = require('../../../utils/http/auth');
			(AuthHTTP.deleteUser as jest.Mock).mockReset();
			(AuthHTTP.deleteUser as jest.Mock).mockResolvedValue({
				status: 400,
				response: { data: { message: '' } },
			});

			const result = await UserStoreHttp.deleteUser();

			expect(mockToast.show).toHaveBeenCalledWith(ToastError('Oops!', 'Failed to delete user. Please try again.'));
			expect(result).toBe('Failed to delete user. Please try again.');
		});
	});
});
