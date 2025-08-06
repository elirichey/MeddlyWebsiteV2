import { renderHook, act } from '@testing-library/react-hooks';
import { useSupportStore } from '../../stores/useSupportStore';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useSupportStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useSupportStore.setState({
				userOrgRequests: [],
				loadingUserOrgRequests: false,
			});
		});

		// Setup console.log spy
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	});

	afterEach(() => {
		// Restore console.log
		consoleLogSpy.mockRestore();
	});

	afterAll(() => {
		console.log = originalConsoleLog;
	});

	describe('test configuration', () => {
		it('should not log state when TestConfig.stores.support is false', () => {
			// TestConfig.stores.support is false by default
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setUserOrgRequests([{ id: '1' }]);
			});

			// Should not have logged anything since TestConfig.stores.support is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.support is true', () => {
			// Mock the TestConfig to enable support store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						support: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useSupportStore: freshUseSupportStore } = require('../../stores/useSupportStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseSupportStore.setState({ userOrgRequests: [{ id: '1' }] });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Support State:',
				expect.objectContaining({
					userOrgRequests: [{ id: '1' }],
					loadingUserOrgRequests: false,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should have correct initial state', () => {
			const { result } = renderHook(() => useSupportStore());

			expect(result.current.userOrgRequests).toEqual([]);
			expect(result.current.loadingUserOrgRequests).toBe(false);
		});
	});

	describe('user organization requests management', () => {
		const mockUserOrgRequests = [
			{
				id: '1',
				userId: 'user1',
				orgId: 'org1',
				status: 'pending',
				requestedAt: new Date().toISOString(),
			},
			{
				id: '2',
				userId: 'user2',
				orgId: 'org2',
				status: 'approved',
				requestedAt: new Date().toISOString(),
			},
		];

		it('should update user organization requests', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setUserOrgRequests(mockUserOrgRequests);
			});

			expect(result.current.userOrgRequests).toEqual(mockUserOrgRequests);
		});

		it('should handle empty user organization requests array', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setUserOrgRequests([]);
			});

			expect(result.current.userOrgRequests).toEqual([]);
		});

		it('should handle single user organization request', () => {
			const { result } = renderHook(() => useSupportStore());
			const singleRequest = [mockUserOrgRequests[0]];

			act(() => {
				result.current.setUserOrgRequests(singleRequest);
			});

			expect(result.current.userOrgRequests).toEqual(singleRequest);
		});

		it('should replace existing user organization requests', () => {
			const { result } = renderHook(() => useSupportStore());

			// Set initial requests
			act(() => {
				result.current.setUserOrgRequests([mockUserOrgRequests[0]]);
			});

			expect(result.current.userOrgRequests).toEqual([mockUserOrgRequests[0]]);

			// Replace with new requests
			act(() => {
				result.current.setUserOrgRequests([mockUserOrgRequests[1]]);
			});

			expect(result.current.userOrgRequests).toEqual([mockUserOrgRequests[1]]);
		});
	});

	describe('loading state management', () => {
		it('should update loading user organization requests state to true', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setLoadingUserOrgRequests(true);
			});

			expect(result.current.loadingUserOrgRequests).toBe(true);
		});

		it('should update loading user organization requests state to false', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setLoadingUserOrgRequests(false);
			});

			expect(result.current.loadingUserOrgRequests).toBe(false);
		});

		it('should toggle loading user organization requests state', () => {
			const { result } = renderHook(() => useSupportStore());

			// Start with false
			expect(result.current.loadingUserOrgRequests).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingUserOrgRequests(true);
			});

			expect(result.current.loadingUserOrgRequests).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingUserOrgRequests(false);
			});

			expect(result.current.loadingUserOrgRequests).toBe(false);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useSupportStore());
			const mockUserOrgRequests = [
				{
					id: '1',
					userId: 'user1',
					orgId: 'org1',
					status: 'pending',
					requestedAt: new Date().toISOString(),
				},
			];

			act(() => {
				result.current.setUserOrgRequests(mockUserOrgRequests);
				result.current.setLoadingUserOrgRequests(true);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useSupportStore());

			// The state should be persisted
			expect(newResult.current.userOrgRequests).toEqual(mockUserOrgRequests);
			expect(newResult.current.loadingUserOrgRequests).toBe(true);
		});
	});

	describe('reset functionality', () => {
		it('should reset all support state to initial values', () => {
			const { result } = renderHook(() => useSupportStore());
			const mockUserOrgRequests = [
				{
					id: '1',
					userId: 'user1',
					orgId: 'org1',
					status: 'pending',
					requestedAt: new Date().toISOString(),
				},
			];

			// Set up some state
			act(() => {
				result.current.setUserOrgRequests(mockUserOrgRequests);
				result.current.setLoadingUserOrgRequests(true);
			});

			// Verify state was set
			expect(result.current.userOrgRequests).toEqual(mockUserOrgRequests);
			expect(result.current.loadingUserOrgRequests).toBe(true);

			// Reset the store
			act(() => {
				result.current.resetSupport();
			});

			// Verify all state is reset to initial values
			expect(result.current.userOrgRequests).toEqual([]);
			expect(result.current.loadingUserOrgRequests).toBe(false);
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useSupportStore());

			// Verify initial state
			expect(result.current.userOrgRequests).toEqual([]);
			expect(result.current.loadingUserOrgRequests).toBe(false);

			// Reset the store
			act(() => {
				result.current.resetSupport();
			});

			// Verify state remains at initial values
			expect(result.current.userOrgRequests).toEqual([]);
			expect(result.current.loadingUserOrgRequests).toBe(false);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useSupportStore());

			expect(typeof result.current.setUserOrgRequests).toBe('function');
			expect(typeof result.current.setLoadingUserOrgRequests).toBe('function');
			expect(typeof result.current.resetSupport).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useSupportStore());

			expect(Array.isArray(result.current.userOrgRequests)).toBe(true);
			expect(typeof result.current.loadingUserOrgRequests).toBe('boolean');
		});
	});

	describe('edge cases', () => {
		it('should handle null user organization requests', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setUserOrgRequests(null as any);
			});

			expect(result.current.userOrgRequests).toBeNull();
		});

		it('should handle undefined user organization requests', () => {
			const { result } = renderHook(() => useSupportStore());

			act(() => {
				result.current.setUserOrgRequests(undefined as any);
			});

			expect(result.current.userOrgRequests).toBeUndefined();
		});

		it('should handle large arrays of user organization requests', () => {
			const { result } = renderHook(() => useSupportStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				id: `request-${index}`,
				userId: `user-${index}`,
				orgId: `org-${index}`,
				status: 'pending',
				requestedAt: new Date().toISOString(),
			}));

			act(() => {
				result.current.setUserOrgRequests(largeArray);
			});

			expect(result.current.userOrgRequests).toEqual(largeArray);
			expect(result.current.userOrgRequests).toHaveLength(1000);
		});
	});
});
