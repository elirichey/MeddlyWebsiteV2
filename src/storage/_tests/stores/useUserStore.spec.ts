import { renderHook, act } from '@testing-library/react-hooks';
import { useUserStore } from '../../stores/useUserStore';
import type { AuthTokens, Profile, UserSelectedRole } from '../../../interfaces/Auth';
import type { MeddlyConnectedEvent } from '../../../interfaces/Event';
import type { Venue } from '../../../interfaces/Venue';
import type { Organization } from '../../../interfaces/Organization';

// Mock console.log to test the conditional logging
const originalConsoleLog = console.log;
const mockConsoleLog = jest.fn();

describe('useUserStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useUserStore.setState({
				loading: false,
				error: null,
				profile: null,
				tokens: null,
				userRoles: [],
				currentRole: null,
				loadingCurrentRole: false,
				connectedEventLoading: false,
			});
		});
		// Reset console.log mock
		mockConsoleLog.mockClear();
	});

	afterAll(() => {
		// Restore original console.log
		console.log = originalConsoleLog;
	});

	describe('loading and error states', () => {
		it('should update loading state', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setLoading(true);
			});

			expect(result.current.loading).toBe(true);

			act(() => {
				result.current.setLoading(false);
			});

			expect(result.current.loading).toBe(false);
		});

		it('should update error state', () => {
			const { result } = renderHook(() => useUserStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setError(testError);
			});

			expect(result.current.error).toBe(testError);

			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBeNull();
		});

		it('should handle different error types', () => {
			const { result } = renderHook(() => useUserStore());

			// Test string error
			act(() => {
				result.current.setError('String error');
			});
			expect(result.current.error).toBe('String error');

			// Test object error
			const objectError = { message: 'Object error', code: 500 };
			act(() => {
				result.current.setError(objectError);
			});
			expect(result.current.error).toEqual(objectError);

			// Test undefined error
			act(() => {
				result.current.setError(undefined);
			});
			expect(result.current.error).toBeUndefined();
		});
	});

	describe('auth state management', () => {
		const mockProfile: Profile = {
			id: '1',
			email: 'test@example.com',
			username: 'testuser',
			userRoles: [],
			updated: new Date(),
			created: new Date(),
		};

		const mockTokens: AuthTokens = {
			accessToken: 'test-access-token',
			refreshToken: 'test-refresh-token',
		};

		const mockOrganization: Organization = {
			id: '1',
			name: 'Test Org',
		};

		const mockRole: UserSelectedRole = {
			id: '1',
			role: 'admin',
			name: 'Admin Role',
			position: 'Manager',
			organization: {
				id: '1',
				name: 'Test Org',
				updated: new Date(),
			},
			created: new Date(),
			updated: new Date(),
		};

		it('should update profile', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setProfile(mockProfile);
			});

			expect(result.current.profile).toEqual(mockProfile);
		});

		it('should update profile to null', () => {
			const { result } = renderHook(() => useUserStore());

			// First set a profile
			act(() => {
				result.current.setProfile(mockProfile);
			});
			expect(result.current.profile).toEqual(mockProfile);

			// Then set it to null
			act(() => {
				result.current.setProfile(null);
			});
			expect(result.current.profile).toBeNull();
		});

		it('should update tokens', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setTokens(mockTokens);
			});

			expect(result.current.tokens).toEqual(mockTokens);
		});

		it('should update user roles', () => {
			const { result } = renderHook(() => useUserStore());
			const roles = [mockRole];

			act(() => {
				result.current.setUserRoles(roles);
			});

			expect(result.current.userRoles).toEqual(roles);
		});

		it('should update user roles to empty array', () => {
			const { result } = renderHook(() => useUserStore());
			const roles = [mockRole];

			// First set some roles
			act(() => {
				result.current.setUserRoles(roles);
			});
			expect(result.current.userRoles).toEqual(roles);

			// Then set to empty array
			act(() => {
				result.current.setUserRoles([]);
			});
			expect(result.current.userRoles).toEqual([]);
		});

		it('should update current role', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setCurrentRole(mockRole);
			});

			expect(result.current.currentRole).toEqual(mockRole);
		});

		it('should update current role to null', () => {
			const { result } = renderHook(() => useUserStore());

			// First set a role
			act(() => {
				result.current.setCurrentRole(mockRole);
			});
			expect(result.current.currentRole).toEqual(mockRole);

			// Then set it to null
			act(() => {
				result.current.setCurrentRole(null);
			});
			expect(result.current.currentRole).toBeNull();
		});

		it('should update loading current role state', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setLoadingCurrentRole(true);
			});

			expect(result.current.loadingCurrentRole).toBe(true);

			act(() => {
				result.current.setLoadingCurrentRole(false);
			});

			expect(result.current.loadingCurrentRole).toBe(false);
		});
	});

	describe('connected event management', () => {
		const mockVenue: Venue = {
			id: '1',
			name: 'Test Venue',
			type: 'venue',
			isOperating: true,
			addressStreet1: '123 Test St',
			addressCity: 'Test City',
			addressRegion: 'Test Region',
			addressCountry: 'Test Country',
			addressZipCode: '12345',
			locale: 'en-US',
			timezone: 'UTC',
			latitude: '0',
			longitude: '0',
		};

		const mockOrganization: Organization = {
			id: '1',
			name: 'Test Org',
		};

		const mockConnectedEvent: MeddlyConnectedEvent = {
			id: '1',
			title: 'Test Event',
			status: 'active',
			dateTime: new Date().toISOString(),
			type: 'test',
			venue: mockVenue,
			orgOwner: mockOrganization,
			managerId: '1',
		};

		it('should update connected event loading state', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setConnectedEventLoading(true);
			});

			expect(result.current.connectedEventLoading).toBe(true);

			act(() => {
				result.current.setConnectedEventLoading(false);
			});

			expect(result.current.connectedEventLoading).toBe(false);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useUserStore());
			const mockProfile: Profile = {
				id: '1',
				email: 'test@example.com',
				username: 'testuser',
				userRoles: [],
				updated: new Date(),
				created: new Date(),
			};

			act(() => {
				result.current.setProfile(mockProfile);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useUserStore());

			// The state should be persisted
			expect(newResult.current.profile).toEqual(mockProfile);
		});

		it('should reset all user state to initial values', () => {
			const { result } = renderHook(() => useUserStore());

			// Set up some state
			const mockProfile: Profile = {
				id: '1',
				email: 'test@example.com',
				username: 'testuser',
				userRoles: [],
				updated: new Date(),
				created: new Date(),
			};
			const mockTokens: AuthTokens = {
				accessToken: 'test-access-token',
				refreshToken: 'test-refresh-token',
			};
			const mockRole: UserSelectedRole = {
				id: '1',
				role: 'admin',
				name: 'Admin Role',
				position: 'Manager',
				organization: {
					id: '1',
					name: 'Test Org',
					updated: new Date(),
				},
				created: new Date(),
				updated: new Date(),
			};

			act(() => {
				result.current.setProfile(mockProfile);
				result.current.setTokens(mockTokens);
				result.current.setUserRoles([mockRole]);
				result.current.setCurrentRole(mockRole);
				result.current.setLoading(true);
				result.current.setError(new Error('Test error'));
				result.current.setConnectedEventLoading(true);
				result.current.setLoadingCurrentRole(true);
			});

			// Reset the store
			act(() => {
				result.current.resetUserStore();
			});

			// Verify all state is reset to initial values
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.profile).toBeNull();
			expect(result.current.tokens).toBeNull();
			expect(result.current.userRoles).toEqual([]);
			expect(result.current.currentRole).toBeNull();
			expect(result.current.loadingCurrentRole).toBe(false);
			expect(result.current.connectedEventLoading).toBe(false);
		});
	});

	describe('store initialization and middleware', () => {
		it('should have all required methods and properties', () => {
			const { result } = renderHook(() => useUserStore());

			// Check all properties exist
			expect(result.current).toHaveProperty('loading');
			expect(result.current).toHaveProperty('error');
			expect(result.current).toHaveProperty('profile');
			expect(result.current).toHaveProperty('tokens');
			expect(result.current).toHaveProperty('userRoles');
			expect(result.current).toHaveProperty('currentRole');
			expect(result.current).toHaveProperty('loadingCurrentRole');
			expect(result.current).toHaveProperty('connectedEventLoading');

			// Check all methods exist
			expect(result.current).toHaveProperty('setLoading');
			expect(result.current).toHaveProperty('setError');
			expect(result.current).toHaveProperty('setProfile');
			expect(result.current).toHaveProperty('setTokens');
			expect(result.current).toHaveProperty('setUserRoles');
			expect(result.current).toHaveProperty('setCurrentRole');
			expect(result.current).toHaveProperty('setLoadingCurrentRole');
			expect(result.current).toHaveProperty('setConnectedEventLoading');
			expect(result.current).toHaveProperty('resetUserStore');

			// Check methods are functions
			expect(typeof result.current.setLoading).toBe('function');
			expect(typeof result.current.setError).toBe('function');
			expect(typeof result.current.setProfile).toBe('function');
			expect(typeof result.current.setTokens).toBe('function');
			expect(typeof result.current.setUserRoles).toBe('function');
			expect(typeof result.current.setCurrentRole).toBe('function');
			expect(typeof result.current.setLoadingCurrentRole).toBe('function');
			expect(typeof result.current.setConnectedEventLoading).toBe('function');
			expect(typeof result.current.resetUserStore).toBe('function');
		});

		it('should have correct initial state values', () => {
			const { result } = renderHook(() => useUserStore());

			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.profile).toBeNull();
			expect(result.current.tokens).toBeNull();
			expect(result.current.userRoles).toEqual([]);
			expect(result.current.currentRole).toBeNull();
			expect(result.current.loadingCurrentRole).toBe(false);
			expect(result.current.connectedEventLoading).toBe(false);
		});
	});

	describe('conditional logging (when tests are enabled)', () => {
		it('should log state changes when test config is enabled', () => {
			// Mock console.log to capture logs
			console.log = mockConsoleLog;

			// Mock the TestConfig to enable user store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						user: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useUserStore: freshStore } = require('../../stores/useUserStore');

			// Trigger a state change
			act(() => {
				freshStore.setState({ loading: true });
			});

			// Check if console.log was called
			expect(mockConsoleLog).toHaveBeenCalled();
		});

		it('should not log state changes when test config is disabled', () => {
			// Mock console.log to capture logs
			console.log = mockConsoleLog;

			// Mock the TestConfig to disable user store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						user: false,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useUserStore: freshStore } = require('../../stores/useUserStore');

			// Trigger a state change
			act(() => {
				freshStore.setState({ loading: true });
			});

			// Check if console.log was not called
			expect(mockConsoleLog).not.toHaveBeenCalled();
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle multiple rapid state changes', () => {
			const { result } = renderHook(() => useUserStore());

			act(() => {
				result.current.setLoading(true);
				result.current.setError('Error 1');
				result.current.setLoading(false);
				result.current.setError('Error 2');
			});

			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBe('Error 2');
		});

		it('should handle setting the same value multiple times', () => {
			const { result } = renderHook(() => useUserStore());
			const mockProfile: Profile = {
				id: '1',
				email: 'test@example.com',
				username: 'testuser',
				userRoles: [],
				updated: new Date(),
				created: new Date(),
			};

			act(() => {
				result.current.setProfile(mockProfile);
				result.current.setProfile(mockProfile);
				result.current.setProfile(mockProfile);
			});

			expect(result.current.profile).toEqual(mockProfile);
		});

		it('should handle complex nested objects in state', () => {
			const { result } = renderHook(() => useUserStore());
			const complexRole: UserSelectedRole = {
				id: '1',
				role: 'admin',
				name: 'Complex Admin Role',
				position: 'Senior Manager',
				organization: {
					id: '1',
					name: 'Complex Organization',
					updated: new Date('2023-01-01'),
				},
				created: new Date('2023-01-01'),
				updated: new Date('2023-01-02'),
			};

			act(() => {
				result.current.setCurrentRole(complexRole);
			});

			expect(result.current.currentRole).toEqual(complexRole);
		});
	});
});
