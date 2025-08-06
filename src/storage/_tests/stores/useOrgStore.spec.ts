import { renderHook, act } from '@testing-library/react-hooks';
import { useOrgStore } from '../../stores/useOrgStore';
import type { Organization } from '../../../interfaces/Organization';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useOrgStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useOrgStore.getState().resetOrgs();
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
		it('should not log state when TestConfig.stores.org is false', () => {
			// TestConfig.stores.org is false by default
			const { result } = renderHook(() => useOrgStore());

			act(() => {
				result.current.setViewOrg({ id: '1', name: 'Test Org' });
			});

			// Should not have logged anything since TestConfig.stores.org is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.org is true', () => {
			// Mock the TestConfig to enable org store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						org: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useOrgStore: freshUseOrgStore } = require('../../stores/useOrgStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseOrgStore.setState({ viewOrg: { id: '1', name: 'Test Org' } });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Org State:',
				expect.objectContaining({
					viewOrg: { id: '1', name: 'Test Org' },
					loadingOrg: false,
					orgError: null,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useOrgStore());

			expect(result.current.viewOrg).toBeNull();
			expect(result.current.loadingOrg).toBe(false);
			expect(result.current.orgError).toBeNull();
		});
	});

	describe('organization management', () => {
		const mockOrganization: Organization = {
			id: '1',
			name: 'Test Organization',
			avatar: 'test-avatar.jpg',
			website: 'https://test-org.com',
			processingServer: {
				id: 'server-1',
				serverId: 1,
				serverName: 'Test Server',
				status: 'active',
				orgOwnerId: 'org-1',
			},
		};

		it('should set view organization with complete data', () => {
			const { result } = renderHook(() => useOrgStore());

			act(() => {
				result.current.setViewOrg(mockOrganization);
			});

			expect(result.current.viewOrg).toEqual(mockOrganization);
		});

		it('should set view organization with minimal data', () => {
			const { result } = renderHook(() => useOrgStore());
			const minimalOrg: Organization = {
				id: '1',
				name: 'Minimal Org',
			};

			act(() => {
				result.current.setViewOrg(minimalOrg);
			});

			expect(result.current.viewOrg).toEqual(minimalOrg);
		});

		it('should toggle loading state', () => {
			const { result } = renderHook(() => useOrgStore());

			// Initial state
			expect(result.current.loadingOrg).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingOrg(true);
			});
			expect(result.current.loadingOrg).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingOrg(false);
			});
			expect(result.current.loadingOrg).toBe(false);
		});

		it('should set organization error', () => {
			const { result } = renderHook(() => useOrgStore());
			const errorMessage = 'Failed to load organization';

			act(() => {
				result.current.setOrgError(errorMessage);
			});

			expect(result.current.orgError).toBe(errorMessage);
		});

		it('should clear organization error when set to null', () => {
			const { result } = renderHook(() => useOrgStore());

			// Set error first
			act(() => {
				result.current.setOrgError('Initial error');
			});
			expect(result.current.orgError).toBe('Initial error');

			// Clear error
			act(() => {
				result.current.setOrgError(null);
			});
			expect(result.current.orgError).toBeNull();
		});

		it('should set view organization to null', () => {
			const { result } = renderHook(() => useOrgStore());

			// Set initial organization
			act(() => {
				result.current.setViewOrg(mockOrganization);
			});
			expect(result.current.viewOrg).toEqual(mockOrganization);

			// Set to null
			act(() => {
				result.current.setViewOrg(null);
			});
			expect(result.current.viewOrg).toBeNull();
		});
	});

	describe('reset functionality', () => {
		it('should reset all organization state', () => {
			const { result } = renderHook(() => useOrgStore());
			const mockOrganization: Organization = {
				id: '1',
				name: 'Test Organization',
				avatar: 'test-avatar.jpg',
				website: 'https://test-org.com',
			};

			// Set some state
			act(() => {
				result.current.setViewOrg(mockOrganization);
				result.current.setLoadingOrg(true);
				result.current.setOrgError('Test error');
			});

			// Verify state was set
			expect(result.current.viewOrg).toEqual(mockOrganization);
			expect(result.current.loadingOrg).toBe(true);
			expect(result.current.orgError).toBe('Test error');

			// Reset state
			act(() => {
				result.current.resetOrgs();
			});

			// Verify state was reset
			expect(result.current.viewOrg).toBeNull();
			expect(result.current.loadingOrg).toBe(false);
			expect(result.current.orgError).toBeNull();
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useOrgStore());

			// Verify initial state
			expect(result.current.viewOrg).toBeNull();
			expect(result.current.loadingOrg).toBe(false);
			expect(result.current.orgError).toBeNull();

			// Reset the store
			act(() => {
				result.current.resetOrgs();
			});

			// Verify state remains at initial values
			expect(result.current.viewOrg).toBeNull();
			expect(result.current.loadingOrg).toBe(false);
			expect(result.current.orgError).toBeNull();
		});
	});

	describe('state persistence', () => {
		it('should persist state changes across store instances', () => {
			const { result } = renderHook(() => useOrgStore());
			const mockOrganization: Organization = {
				id: '1',
				name: 'Test Organization',
				avatar: 'test-avatar.jpg',
				website: 'https://test-org.com',
			};

			// Set state in first instance
			act(() => {
				result.current.setViewOrg(mockOrganization);
				result.current.setLoadingOrg(true);
				result.current.setOrgError('Test error');
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useOrgStore());

			// State should be persisted
			expect(newResult.current.viewOrg).toEqual(mockOrganization);
			expect(newResult.current.loadingOrg).toBe(true);
			expect(newResult.current.orgError).toBe('Test error');
		});

		it('should maintain state after multiple updates', () => {
			const { result } = renderHook(() => useOrgStore());
			const mockOrg1: Organization = {
				id: '1',
				name: 'First Organization',
			};
			const mockOrg2: Organization = {
				id: '2',
				name: 'Second Organization',
			};

			// Set initial state
			act(() => {
				result.current.setViewOrg(mockOrg1);
			});

			// Update state
			act(() => {
				result.current.setViewOrg(mockOrg2);
			});

			// Create new instance
			const { result: newResult } = renderHook(() => useOrgStore());

			// Should have latest state
			expect(newResult.current.viewOrg).toEqual(mockOrg2);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useOrgStore());

			expect(typeof result.current.setViewOrg).toBe('function');
			expect(typeof result.current.setLoadingOrg).toBe('function');
			expect(typeof result.current.setOrgError).toBe('function');
			expect(typeof result.current.resetOrgs).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useOrgStore());

			expect(result.current.viewOrg).toBeDefined();
			expect(typeof result.current.loadingOrg).toBe('boolean');
			expect(result.current.orgError).toBeDefined();
		});
	});

	describe('edge cases', () => {
		it('should handle empty string error', () => {
			const { result } = renderHook(() => useOrgStore());

			act(() => {
				result.current.setOrgError('');
			});

			expect(result.current.orgError).toBe('');
		});

		it('should handle very long error messages', () => {
			const { result } = renderHook(() => useOrgStore());
			const longErrorMessage = 'A'.repeat(1000);

			act(() => {
				result.current.setOrgError(longErrorMessage);
			});

			expect(result.current.orgError).toBe(longErrorMessage);
		});

		it('should handle organization with all optional fields', () => {
			const { result } = renderHook(() => useOrgStore());
			const completeOrg: Organization = {
				id: '1',
				name: 'Complete Organization',
				avatar: 'avatar.jpg',
				website: 'https://example.com',
				processingServer: {
					id: 'server-1',
					serverId: 1,
					serverName: 'Server Name',
					status: 'active',
					orgOwnerId: 'owner-1',
				},
			};

			act(() => {
				result.current.setViewOrg(completeOrg);
			});

			expect(result.current.viewOrg).toEqual(completeOrg);
		});

		it('should handle rapid state changes', () => {
			const { result } = renderHook(() => useOrgStore());
			const org1: Organization = { id: '1', name: 'Org 1' };
			const org2: Organization = { id: '2', name: 'Org 2' };

			act(() => {
				result.current.setViewOrg(org1);
				result.current.setViewOrg(org2);
				result.current.setLoadingOrg(true);
				result.current.setLoadingOrg(false);
				result.current.setOrgError('Error 1');
				result.current.setOrgError('Error 2');
			});

			expect(result.current.viewOrg).toEqual(org2);
			expect(result.current.loadingOrg).toBe(false);
			expect(result.current.orgError).toBe('Error 2');
		});

		it('should handle boolean edge cases for loading state', () => {
			const { result } = renderHook(() => useOrgStore());

			// Test with explicit boolean values
			act(() => {
				result.current.setLoadingOrg(Boolean(true));
			});
			expect(result.current.loadingOrg).toBe(true);

			act(() => {
				result.current.setLoadingOrg(Boolean(false));
			});
			expect(result.current.loadingOrg).toBe(false);
		});
	});
});
