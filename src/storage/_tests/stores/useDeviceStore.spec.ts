import { renderHook, act } from '@testing-library/react-hooks';
import { useDeviceStore } from '../../stores/useDeviceStore';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useDeviceStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useDeviceStore.setState({
				userDevice: { name: '' },
				roleDevices: [],
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
		it('should not log state when TestConfig.stores.device is false', () => {
			// TestConfig.stores.device is false by default
			const { result } = renderHook(() => useDeviceStore());

			act(() => {
				result.current.setUserDevice({ name: 'Test User' });
			});

			// Should not have logged anything since TestConfig.stores.device is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.device is true', () => {
			// Mock the TestConfig to enable device store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						device: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useDeviceStore: freshUseDeviceStore } = require('../../stores/useDeviceStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseDeviceStore.setState({ userDevice: { name: 'Test User' } });
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Device State:',
				expect.objectContaining({
					userDevice: { name: 'Test User' },
					roleDevices: [],
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useDeviceStore());

			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);
		});
	});

	describe('user management', () => {
		it('should update user information', () => {
			const { result } = renderHook(() => useDeviceStore());
			const newUser = { name: 'Test User' };

			act(() => {
				result.current.setUserDevice(newUser);
			});

			expect(result.current.userDevice).toEqual(newUser);
		});

		it('should handle empty user name', () => {
			const { result } = renderHook(() => useDeviceStore());
			const emptyUser = { name: '' };

			act(() => {
				result.current.setUserDevice(emptyUser);
			});

			expect(result.current.userDevice).toEqual(emptyUser);
		});

		it('should handle multiple user name updates', () => {
			const { result } = renderHook(() => useDeviceStore());
			const firstUser = { name: 'First User' };
			const secondUser = { name: 'Second User' };

			act(() => {
				result.current.setUserDevice(firstUser);
			});

			expect(result.current.userDevice).toEqual(firstUser);

			act(() => {
				result.current.setUserDevice(secondUser);
			});

			expect(result.current.userDevice).toEqual(secondUser);
		});

		it('should replace existing user device', () => {
			const { result } = renderHook(() => useDeviceStore());
			const firstUser = { name: 'First User' };
			const secondUser = { name: 'Second User' };

			// Set initial user
			act(() => {
				result.current.setUserDevice(firstUser);
			});

			expect(result.current.userDevice).toEqual(firstUser);

			// Replace with new user
			act(() => {
				result.current.setUserDevice(secondUser);
			});

			expect(result.current.userDevice).toEqual(secondUser);
		});
	});

	describe('roles management', () => {
		it('should update roles', () => {
			const { result } = renderHook(() => useDeviceStore());
			const newRoles = [
				{ orgId: 'org1', name: 'Role 1' },
				{ orgId: 'org2', name: 'Role 2' },
			];

			act(() => {
				result.current.setRoleDevices(newRoles);
			});

			expect(result.current.roleDevices).toEqual(newRoles);
		});

		it('should handle empty roles array', () => {
			const { result } = renderHook(() => useDeviceStore());
			const emptyRoles: [] = [];

			act(() => {
				result.current.setRoleDevices(emptyRoles);
			});

			expect(result.current.roleDevices).toEqual(emptyRoles);
		});

		it('should handle single role device', () => {
			const { result } = renderHook(() => useDeviceStore());
			const singleRole = [{ orgId: 'org1', name: 'Single Role' }];

			act(() => {
				result.current.setRoleDevices(singleRole);
			});

			expect(result.current.roleDevices).toEqual(singleRole);
		});

		it('should handle multiple role devices', () => {
			const { result } = renderHook(() => useDeviceStore());
			const multipleRoles = [
				{ orgId: 'org1', name: 'Role 1' },
				{ orgId: 'org2', name: 'Role 2' },
				{ orgId: 'org3', name: 'Role 3' },
			];

			act(() => {
				result.current.setRoleDevices(multipleRoles);
			});

			expect(result.current.roleDevices).toEqual(multipleRoles);
		});

		it('should handle role devices with empty strings', () => {
			const { result } = renderHook(() => useDeviceStore());
			const rolesWithEmptyStrings = [
				{ orgId: '', name: '' },
				{ orgId: 'org1', name: '' },
				{ orgId: '', name: 'Role Name' },
			];

			act(() => {
				result.current.setRoleDevices(rolesWithEmptyStrings);
			});

			expect(result.current.roleDevices).toEqual(rolesWithEmptyStrings);
		});

		it('should replace existing role devices', () => {
			const { result } = renderHook(() => useDeviceStore());
			const firstRoles = [{ orgId: 'org1', name: 'Role 1' }];
			const secondRoles = [{ orgId: 'org2', name: 'Role 2' }];

			// Set initial roles
			act(() => {
				result.current.setRoleDevices(firstRoles);
			});

			expect(result.current.roleDevices).toEqual(firstRoles);

			// Replace with new roles
			act(() => {
				result.current.setRoleDevices(secondRoles);
			});

			expect(result.current.roleDevices).toEqual(secondRoles);
		});
	});

	describe('reset functionality', () => {
		it('should reset device info to default values', () => {
			const { result } = renderHook(() => useDeviceStore());

			// Set some initial state
			const initialUser = { name: 'Test User' };
			const initialRoles = [
				{ orgId: 'org1', name: 'Role 1' },
				{ orgId: 'org2', name: 'Role 2' },
			];

			act(() => {
				result.current.setUserDevice(initialUser);
				result.current.setRoleDevices(initialRoles);
			});

			// Verify initial state is set
			expect(result.current.userDevice).toEqual(initialUser);
			expect(result.current.roleDevices).toEqual(initialRoles);

			// Reset the device info
			act(() => {
				result.current.resetDeviceInfo();
			});

			// Verify reset to default values
			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);
		});

		it('should reset device info when already at default values', () => {
			const { result } = renderHook(() => useDeviceStore());

			// Verify initial state is already default
			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);

			// Reset the device info
			act(() => {
				result.current.resetDeviceInfo();
			});

			// Verify still at default values
			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);
		});

		it('should reset device info multiple times', () => {
			const { result } = renderHook(() => useDeviceStore());

			// Set initial state
			const initialUser = { name: 'Test User' };
			const initialRoles = [{ orgId: 'org1', name: 'Role 1' }];

			act(() => {
				result.current.setUserDevice(initialUser);
				result.current.setRoleDevices(initialRoles);
			});

			// First reset
			act(() => {
				result.current.resetDeviceInfo();
			});

			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);

			// Set state again
			const secondUser = { name: 'Second User' };
			const secondRoles = [{ orgId: 'org2', name: 'Role 2' }];

			act(() => {
				result.current.setUserDevice(secondUser);
				result.current.setRoleDevices(secondRoles);
			});

			// Second reset
			act(() => {
				result.current.resetDeviceInfo();
			});

			expect(result.current.userDevice).toEqual({ name: '' });
			expect(result.current.roleDevices).toEqual([]);
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useDeviceStore());
			const newUser = { name: 'Test User' };
			const newRoles = [{ orgId: 'org1', name: 'Role 1' }];

			act(() => {
				result.current.setUserDevice(newUser);
				result.current.setRoleDevices(newRoles);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useDeviceStore());

			// State should be persisted
			expect(newResult.current.userDevice).toEqual(newUser);
			expect(newResult.current.roleDevices).toEqual(newRoles);
		});

		it('should persist reset state', () => {
			const { result } = renderHook(() => useDeviceStore());

			// Set some state
			const initialUser = { name: 'Test User' };
			const initialRoles = [{ orgId: 'org1', name: 'Role 1' }];

			act(() => {
				result.current.setUserDevice(initialUser);
				result.current.setRoleDevices(initialRoles);
			});

			// Reset the state
			act(() => {
				result.current.resetDeviceInfo();
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useDeviceStore());

			// Reset state should be persisted
			expect(newResult.current.userDevice).toEqual({ name: '' });
			expect(newResult.current.roleDevices).toEqual([]);
		});
	});

	describe('store interface', () => {
		it('should have all required methods', () => {
			const { result } = renderHook(() => useDeviceStore());

			expect(typeof result.current.setUserDevice).toBe('function');
			expect(typeof result.current.setRoleDevices).toBe('function');
			expect(typeof result.current.resetDeviceInfo).toBe('function');
		});

		it('should have correct state structure', () => {
			const { result } = renderHook(() => useDeviceStore());

			expect(result.current).toHaveProperty('userDevice');
			expect(result.current).toHaveProperty('roleDevices');
			expect(result.current).toHaveProperty('setUserDevice');
			expect(result.current).toHaveProperty('setRoleDevices');
			expect(result.current).toHaveProperty('resetDeviceInfo');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useDeviceStore());

			expect(typeof result.current.userDevice).toBe('object');
			expect(Array.isArray(result.current.roleDevices)).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle null user device', () => {
			const { result } = renderHook(() => useDeviceStore());

			act(() => {
				result.current.setUserDevice(null as any);
			});

			expect(result.current.userDevice).toBeNull();
		});

		it('should handle undefined user device', () => {
			const { result } = renderHook(() => useDeviceStore());

			act(() => {
				result.current.setUserDevice(undefined as any);
			});

			expect(result.current.userDevice).toBeUndefined();
		});

		it('should handle null role devices', () => {
			const { result } = renderHook(() => useDeviceStore());

			act(() => {
				result.current.setRoleDevices(null as any);
			});

			expect(result.current.roleDevices).toBeNull();
		});

		it('should handle undefined role devices', () => {
			const { result } = renderHook(() => useDeviceStore());

			act(() => {
				result.current.setRoleDevices(undefined as any);
			});

			expect(result.current.roleDevices).toBeUndefined();
		});

		it('should handle large arrays of role devices', () => {
			const { result } = renderHook(() => useDeviceStore());
			const largeArray = Array.from({ length: 1000 }, (_, index) => ({
				orgId: `org-${index}`,
				name: `Role ${index}`,
			}));

			act(() => {
				result.current.setRoleDevices(largeArray);
			});

			expect(result.current.roleDevices).toEqual(largeArray);
			expect(result.current.roleDevices).toHaveLength(1000);
		});

		it('should handle user device with very long name', () => {
			const { result } = renderHook(() => useDeviceStore());
			const longName = 'A'.repeat(10000);

			act(() => {
				result.current.setUserDevice({ name: longName });
			});

			expect(result.current.userDevice).toEqual({ name: longName });
		});

		it('should handle role devices with very long names and orgIds', () => {
			const { result } = renderHook(() => useDeviceStore());
			const longString = 'A'.repeat(1000);
			const roleWithLongStrings = [{ orgId: longString, name: longString }];

			act(() => {
				result.current.setRoleDevices(roleWithLongStrings);
			});

			expect(result.current.roleDevices).toEqual(roleWithLongStrings);
		});
	});
});
