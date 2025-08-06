import { renderHook, act } from '@testing-library/react-hooks';
import { useRolesStore } from '../../stores/useRolesStore';
import type { UserRole } from '../../../interfaces/UserRoles';
import type { UserSelectedRole } from '../../../interfaces/Auth';

// Mock console.log to capture subscription logs
const originalConsoleLog = console.log;
let consoleLogSpy: jest.SpyInstance;

describe('useRolesStore', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useRolesStore.getState().resetRoles();
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
		it('should not log state when TestConfig.stores.roles is false', () => {
			// TestConfig.stores.roles is false by default
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles([
					{
						id: '1',
						name: 'Admin Role',
						role: 'admin',
						position: 'Manager',
						notes: 'Test notes',
						user: {
							id: '1',
							name: 'Test User',
							username: 'testuser',
							phone: '1234567890',
							email: 'test@example.com',
							avatar: 'avatar.jpg',
						},
						organization: {
							id: '1',
							name: 'Test Org',
							updated: new Date(),
						},
						created: new Date(),
						updated: new Date(),
					},
				]);
			});

			// Should not have logged anything since TestConfig.stores.roles is false
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});

		it('should log state when TestConfig.stores.roles is true', () => {
			// Mock the TestConfig to enable roles store logging
			jest.doMock('../../../config/testing', () => ({
				__esModule: true,
				default: {
					stores: {
						roles: true,
					},
				},
			}));

			// Re-import the store to trigger the conditional logging
			jest.resetModules();
			const { useRolesStore: freshUseRolesStore } = require('../../stores/useRolesStore');

			// Trigger a state change directly on the store
			act(() => {
				freshUseRolesStore.setState({
					orgRoles: [
						{
							id: '1',
							name: 'Admin Role',
							role: 'admin',
							position: 'Manager',
							notes: 'Test notes',
							user: {
								id: '1',
								name: 'Test User',
								username: 'testuser',
								phone: '1234567890',
								email: 'test@example.com',
								avatar: 'avatar.jpg',
							},
							organization: {
								id: '1',
								name: 'Test Org',
								updated: new Date(),
							},
							created: new Date(),
							updated: new Date(),
						},
					],
					orgRolesCurrentPage: 1,
					orgTotalRoles: 10,
					loadingRoles: false,
					viewRole: null,
					loadingRole: false,
					error: null,
				});
			});

			// Should have logged the state change
			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Roles State:',
				expect.objectContaining({
					orgRoles: expect.arrayContaining([expect.objectContaining({ id: '1' })]),
					orgRolesCurrentPage: 1,
					orgTotalRoles: 10,
					loadingRoles: false,
					viewRole: null,
					loadingRole: false,
					error: null,
				}),
			);
		});
	});

	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useRolesStore());

			expect(result.current.orgRoles).toEqual([]);
			expect(result.current.orgRolesCurrentPage).toBe(0);
			expect(result.current.orgTotalRoles).toBe(0);
			expect(result.current.loadingRoles).toBe(false);
			expect(result.current.viewRole).toBeNull();
			expect(result.current.loadingRole).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('organization roles management', () => {
		const mockOrgRoles: UserRole[] = [
			{
				id: '1',
				name: 'Admin Role',
				role: 'admin',
				position: 'Manager',
				notes: 'Test notes',
				user: {
					id: '1',
					name: 'Test User',
					username: 'testuser',
					phone: '1234567890',
					email: 'test@example.com',
					avatar: 'avatar.jpg',
				},
				organization: {
					id: '1',
					name: 'Test Org',
					updated: new Date(),
				},
				created: new Date(),
				updated: new Date(),
			},
		];

		it('should update organization roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles(mockOrgRoles);
			});

			expect(result.current.orgRoles).toEqual(mockOrgRoles);
		});

		it('should handle empty organization roles array', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles([]);
			});

			expect(result.current.orgRoles).toEqual([]);
		});

		it('should handle single organization role', () => {
			const { result } = renderHook(() => useRolesStore());
			const singleRole = [mockOrgRoles[0]];

			act(() => {
				result.current.setOrgRoles(singleRole);
			});

			expect(result.current.orgRoles).toEqual(singleRole);
		});

		it('should replace existing organization roles', () => {
			const { result } = renderHook(() => useRolesStore());

			// Set initial roles
			act(() => {
				result.current.setOrgRoles([mockOrgRoles[0]]);
			});

			expect(result.current.orgRoles).toEqual([mockOrgRoles[0]]);

			// Replace with new roles
			const newRole: UserRole = {
				id: '2',
				name: 'User Role',
				role: 'user',
				position: 'Member',
				notes: 'New notes',
				user: {
					id: '2',
					name: 'New User',
					username: 'newuser',
					phone: '0987654321',
					email: 'new@example.com',
					avatar: 'new-avatar.jpg',
				},
				organization: {
					id: '1',
					name: 'Test Org',
					updated: new Date(),
				},
				created: new Date(),
				updated: new Date(),
			};

			act(() => {
				result.current.setOrgRoles([newRole]);
			});

			expect(result.current.orgRoles).toEqual([newRole]);
		});

		it('should handle large arrays of organization roles', () => {
			const { result } = renderHook(() => useRolesStore());
			const largeArray = Array.from({ length: 100 }, (_, index) => ({
				id: `role-${index}`,
				name: `Role ${index}`,
				role: 'user',
				position: 'Member',
				notes: `Notes for role ${index}`,
				user: {
					id: `user-${index}`,
					name: `User ${index}`,
					username: `user${index}`,
					phone: `123456789${index}`,
					email: `user${index}@example.com`,
					avatar: `avatar-${index}.jpg`,
				},
				organization: {
					id: '1',
					name: 'Test Org',
					updated: new Date(),
				},
				created: new Date(),
				updated: new Date(),
			}));

			act(() => {
				result.current.setOrgRoles(largeArray);
			});

			expect(result.current.orgRoles).toEqual(largeArray);
			expect(result.current.orgRoles).toHaveLength(100);
		});

		it('should update organization roles current page', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRolesCurrentPage(2);
			});

			expect(result.current.orgRolesCurrentPage).toBe(2);
		});

		it('should handle zero page number', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRolesCurrentPage(0);
			});

			expect(result.current.orgRolesCurrentPage).toBe(0);
		});

		it('should handle negative page number', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRolesCurrentPage(-1);
			});

			expect(result.current.orgRolesCurrentPage).toBe(-1);
		});

		it('should handle large page number', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRolesCurrentPage(999999);
			});

			expect(result.current.orgRolesCurrentPage).toBe(999999);
		});

		it('should update organization total roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgTotalRoles(50);
			});

			expect(result.current.orgTotalRoles).toBe(50);
		});

		it('should handle zero total roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgTotalRoles(0);
			});

			expect(result.current.orgTotalRoles).toBe(0);
		});

		it('should handle negative total roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgTotalRoles(-10);
			});

			expect(result.current.orgTotalRoles).toBe(-10);
		});

		it('should handle large total roles number', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgTotalRoles(999999);
			});

			expect(result.current.orgTotalRoles).toBe(999999);
		});

		it('should update loading roles state', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setLoadingRoles(true);
			});

			expect(result.current.loadingRoles).toBe(true);

			act(() => {
				result.current.setLoadingRoles(false);
			});

			expect(result.current.loadingRoles).toBe(false);
		});

		it('should toggle loading roles state', () => {
			const { result } = renderHook(() => useRolesStore());

			// Start with false
			expect(result.current.loadingRoles).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingRoles(true);
			});

			expect(result.current.loadingRoles).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingRoles(false);
			});

			expect(result.current.loadingRoles).toBe(false);
		});
	});

	describe('view role management', () => {
		const mockViewRole: UserSelectedRole = {
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

		it('should update view role', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setViewRole(mockViewRole);
			});

			expect(result.current.viewRole).toEqual(mockViewRole);
		});

		it('should set view role to null', () => {
			const { result } = renderHook(() => useRolesStore());

			// First set a role
			act(() => {
				result.current.setViewRole(mockViewRole);
			});

			expect(result.current.viewRole).toEqual(mockViewRole);

			// Then set to null
			act(() => {
				result.current.setViewRole(null);
			});

			expect(result.current.viewRole).toBeNull();
		});

		it('should replace existing view role', () => {
			const { result } = renderHook(() => useRolesStore());

			// Set initial role
			act(() => {
				result.current.setViewRole(mockViewRole);
			});

			expect(result.current.viewRole).toEqual(mockViewRole);

			// Replace with new role
			const newViewRole: UserSelectedRole = {
				id: '2',
				role: 'user',
				name: 'User Role',
				position: 'Member',
				organization: {
					id: '1',
					name: 'Test Org',
					updated: new Date(),
				},
				created: new Date(),
				updated: new Date(),
			};

			act(() => {
				result.current.setViewRole(newViewRole);
			});

			expect(result.current.viewRole).toEqual(newViewRole);
		});

		it('should update loading role state', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setLoadingRole(true);
			});

			expect(result.current.loadingRole).toBe(true);

			act(() => {
				result.current.setLoadingRole(false);
			});

			expect(result.current.loadingRole).toBe(false);
		});

		it('should toggle loading role state', () => {
			const { result } = renderHook(() => useRolesStore());

			// Start with false
			expect(result.current.loadingRole).toBe(false);

			// Set to true
			act(() => {
				result.current.setLoadingRole(true);
			});

			expect(result.current.loadingRole).toBe(true);

			// Set back to false
			act(() => {
				result.current.setLoadingRole(false);
			});

			expect(result.current.loadingRole).toBe(false);
		});
	});

	describe('error handling', () => {
		it('should update error state', () => {
			const { result } = renderHook(() => useRolesStore());
			const testError = new Error('Test error');

			act(() => {
				result.current.setError(testError);
			});

			expect(result.current.error).toEqual(testError);

			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBeNull();
		});

		it('should handle string error', () => {
			const { result } = renderHook(() => useRolesStore());
			const stringError = 'String error message';

			act(() => {
				result.current.setError(stringError);
			});

			expect(result.current.error).toEqual(stringError);
		});

		it('should handle object error', () => {
			const { result } = renderHook(() => useRolesStore());
			const objectError = { code: 500, message: 'Server error' };

			act(() => {
				result.current.setError(objectError);
			});

			expect(result.current.error).toEqual(objectError);
		});

		it('should handle undefined error', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setError(undefined);
			});

			expect(result.current.error).toBeUndefined();
		});

		it('should replace existing error', () => {
			const { result } = renderHook(() => useRolesStore());
			const firstError = new Error('First error');
			const secondError = new Error('Second error');

			act(() => {
				result.current.setError(firstError);
			});

			expect(result.current.error).toEqual(firstError);

			act(() => {
				result.current.setError(secondError);
			});

			expect(result.current.error).toEqual(secondError);
		});
	});

	describe('reset functionality', () => {
		it('should reset all states to initial values', () => {
			const { result } = renderHook(() => useRolesStore());

			// Set some values
			act(() => {
				result.current.setOrgRoles([
					{
						id: '1',
						name: 'Admin Role',
						role: 'admin',
						position: 'Manager',
						notes: 'Test notes',
						user: {
							id: '1',
							name: 'Test User',
							username: 'testuser',
							phone: '1234567890',
							email: 'test@example.com',
							avatar: 'avatar.jpg',
						},
						organization: {
							id: '1',
							name: 'Test Org',
							updated: new Date(),
						},
						created: new Date(),
						updated: new Date(),
					},
				]);
				result.current.setOrgRolesCurrentPage(2);
				result.current.setOrgTotalRoles(50);
				result.current.setLoadingRoles(true);
				result.current.setViewRole({
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
				});
				result.current.setLoadingRole(true);
				result.current.setError(new Error('Test error'));
			});

			// Reset the store
			act(() => {
				result.current.resetRoles();
			});

			// Verify all states are reset
			expect(result.current.orgRoles).toEqual([]);
			expect(result.current.orgRolesCurrentPage).toBe(0);
			expect(result.current.orgTotalRoles).toBe(0);
			expect(result.current.loadingRoles).toBe(false);
			expect(result.current.viewRole).toBeNull();
			expect(result.current.loadingRole).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it('should reset to initial state even when already at initial state', () => {
			const { result } = renderHook(() => useRolesStore());

			// Verify initial state
			expect(result.current.orgRoles).toEqual([]);
			expect(result.current.orgRolesCurrentPage).toBe(0);
			expect(result.current.orgTotalRoles).toBe(0);
			expect(result.current.loadingRoles).toBe(false);
			expect(result.current.viewRole).toBeNull();
			expect(result.current.loadingRole).toBe(false);
			expect(result.current.error).toBeNull();

			// Reset the store
			act(() => {
				result.current.resetRoles();
			});

			// Verify state remains at initial values
			expect(result.current.orgRoles).toEqual([]);
			expect(result.current.orgRolesCurrentPage).toBe(0);
			expect(result.current.orgTotalRoles).toBe(0);
			expect(result.current.loadingRoles).toBe(false);
			expect(result.current.viewRole).toBeNull();
			expect(result.current.loadingRole).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('state persistence', () => {
		it('should persist state changes', () => {
			const { result } = renderHook(() => useRolesStore());
			const mockOrgRoles: UserRole[] = [
				{
					id: '1',
					name: 'Admin Role',
					role: 'admin',
					position: 'Manager',
					notes: 'Test notes',
					user: {
						id: '1',
						name: 'Test User',
						username: 'testuser',
						phone: '1234567890',
						email: 'test@example.com',
						avatar: 'avatar.jpg',
					},
					organization: {
						id: '1',
						name: 'Test Org',
						updated: new Date(),
					},
					created: new Date(),
					updated: new Date(),
				},
			];

			act(() => {
				result.current.setOrgRoles(mockOrgRoles);
				result.current.setOrgRolesCurrentPage(2);
				result.current.setOrgTotalRoles(50);
			});

			// Create a new instance of the store
			const { result: newResult } = renderHook(() => useRolesStore());

			// State should be persisted
			expect(newResult.current.orgRoles).toEqual(mockOrgRoles);
			expect(newResult.current.orgRolesCurrentPage).toBe(2);
			expect(newResult.current.orgTotalRoles).toBe(50);
		});
	});

	describe('store interface', () => {
		it('should expose all required methods', () => {
			const { result } = renderHook(() => useRolesStore());

			expect(typeof result.current.setOrgRoles).toBe('function');
			expect(typeof result.current.setOrgRolesCurrentPage).toBe('function');
			expect(typeof result.current.setOrgTotalRoles).toBe('function');
			expect(typeof result.current.setLoadingRoles).toBe('function');
			expect(typeof result.current.setViewRole).toBe('function');
			expect(typeof result.current.setLoadingRole).toBe('function');
			expect(typeof result.current.setError).toBe('function');
			expect(typeof result.current.resetRoles).toBe('function');
		});

		it('should expose all required state properties', () => {
			const { result } = renderHook(() => useRolesStore());

			expect(Array.isArray(result.current.orgRoles)).toBe(true);
			expect(typeof result.current.orgRolesCurrentPage).toBe('number');
			expect(typeof result.current.orgTotalRoles).toBe('number');
			expect(typeof result.current.loadingRoles).toBe('boolean');
			expect(result.current.viewRole).toBeNull();
			expect(typeof result.current.loadingRole).toBe('boolean');
			expect(result.current.error).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should handle null organization roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles(null as any);
			});

			expect(result.current.orgRoles).toBeNull();
		});

		it('should handle undefined organization roles', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles(undefined as any);
			});

			expect(result.current.orgRoles).toBeUndefined();
		});

		it('should handle null view role', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setViewRole(null);
			});

			expect(result.current.viewRole).toBeNull();
		});

		it('should handle undefined view role', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setViewRole(undefined as any);
			});

			expect(result.current.viewRole).toBeUndefined();
		});

		it('should handle concurrent state updates', () => {
			const { result } = renderHook(() => useRolesStore());

			act(() => {
				result.current.setOrgRoles([
					{
						id: '1',
						name: 'Admin Role',
						role: 'admin',
						position: 'Manager',
						notes: 'Test notes',
						user: {
							id: '1',
							name: 'Test User',
							username: 'testuser',
							phone: '1234567890',
							email: 'test@example.com',
							avatar: 'avatar.jpg',
						},
						organization: {
							id: '1',
							name: 'Test Org',
							updated: new Date(),
						},
						created: new Date(),
						updated: new Date(),
					},
				]);
				result.current.setLoadingRoles(true);
				result.current.setOrgRolesCurrentPage(5);
				result.current.setOrgTotalRoles(100);
			});

			expect(result.current.orgRoles).toHaveLength(1);
			expect(result.current.loadingRoles).toBe(true);
			expect(result.current.orgRolesCurrentPage).toBe(5);
			expect(result.current.orgTotalRoles).toBe(100);
		});
	});
});
