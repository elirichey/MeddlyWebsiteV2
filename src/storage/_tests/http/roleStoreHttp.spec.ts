import { jest } from '@jest/globals';
import Toast from 'react-native-toast-message';
import { ToastError } from '../../../config/toastConfig';
import OrgRolesHttp from '../../../utils/http/admin/roles';
import { timeout } from '../../../config/variables';
import { useRolesStore } from '../../stores/useRolesStore';
import { useUserStore } from '../../stores/useUserStore';
import UserStoreHttp from '../../http/userStoreHttp';
import RoleStoreHttp from '../../http/roleStoreHttp';

// Mock dependencies
jest.mock('react-native-toast-message');
jest.mock('../../../config/toastConfig');
jest.mock('../../../utils/http/admin/roles');
jest.mock('../../../config/variables');
jest.mock('../../stores/useRolesStore');
jest.mock('../../stores/useUserStore');
jest.mock('../../http/userStoreHttp');

// Add global type declaration for Jest environment
declare const global: any;

describe('RoleStoreHttp', () => {
	let mockRolesStore: any;
	let mockUserStore: any;
	let mockOrgRolesHttp: any;
	let mockUserStoreHttp: any;
	let mockToast: any;
	let mockToastError: any;

	beforeEach(() => {
		jest.clearAllMocks();
		// Enable fake timers to control all timer-based operations
		jest.useFakeTimers();

		// Mock setTimeout to execute immediately for all delays
		const originalSetTimeout = global.setTimeout;
		global.setTimeout = jest.fn((callback: any, delay: number) => {
			// Execute immediately for all delays in tests
			callback();
			return {} as any;
		});

		// Mock store states
		mockRolesStore = {
			setLoadingRoles: jest.fn(),
			setOrgRoles: jest.fn(),
			setOrgTotalRoles: jest.fn(),
			setError: jest.fn(),
			setLoadingRole: jest.fn(),
			setViewRole: jest.fn(),
			orgRolesCurrentPage: 0,
			loadingRole: false,
		};

		mockUserStore = {
			tokens: { accessToken: 'test-access-token' },
			currentRole: {
				organization: { id: 'test-org-id' },
			},
		};

		// Mock HTTP modules
		mockOrgRolesHttp = {
			getOrgRoles: jest.fn(),
			getOrgRole: jest.fn(),
			getOrgEventManagers: jest.fn(),
			createUserRole: jest.fn(),
			updateUserRole: jest.fn(),
			deleteUserRole: jest.fn(),
		};

		mockUserStoreHttp = {
			refreshUser: jest.fn(),
			tryLogout: jest.fn(),
		};

		// Mock toast
		mockToast = {
			show: jest.fn(),
		};

		// Fix the mockToastError to return the correct structure
		mockToastError = jest.fn((title: string, message: string) => ({
			type: 'Error',
			text1: title,
			text2: message,
			visibilityTime: 4000,
		}));

		// Setup mocks
		(useRolesStore.getState as jest.Mock).mockReturnValue(mockRolesStore);
		(useUserStore.getState as jest.Mock).mockReturnValue(mockUserStore);
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).getOrgRoles = mockOrgRolesHttp.getOrgRoles;
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).getOrgRole = mockOrgRolesHttp.getOrgRole;
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).getOrgEventManagers = mockOrgRolesHttp.getOrgEventManagers;
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).createUserRole = mockOrgRolesHttp.createUserRole;
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).updateUserRole = mockOrgRolesHttp.updateUserRole;
		(OrgRolesHttp as jest.Mocked<typeof OrgRolesHttp>).deleteUserRole = mockOrgRolesHttp.deleteUserRole;
		(UserStoreHttp as jest.Mocked<typeof UserStoreHttp>).refreshUser = mockUserStoreHttp.refreshUser;
		(UserStoreHttp as jest.Mocked<typeof UserStoreHttp>).tryLogout = mockUserStoreHttp.tryLogout;
		(Toast as jest.Mocked<typeof Toast>).show = mockToast.show;
		(ToastError as jest.MockedFunction<typeof ToastError>).mockImplementation(mockToastError);
		Object.defineProperty(timeout, 'auth', { value: 1000, writable: true });
		Object.defineProperty(timeout, 'fetch', { value: 2000, writable: true });
		Object.defineProperty(timeout, 'short', { value: 500, writable: true });
	});

	afterEach(() => {
		// Clear all timeouts to prevent async operations from hanging
		jest.clearAllTimers();
		// Restore real timers
		jest.useRealTimers();
	});

	describe('getOrgRoles', () => {
		it('should successfully fetch and sort organization roles', async () => {
			const mockResponse = {
				status: 200,
				data: {
					userRoles: [
						{ id: '1', role: 'contributor' },
						{ id: '2', role: 'admin' },
						{ id: '3', role: 'editor' },
					],
					totalUserRoles: 3,
				},
			};

			mockOrgRolesHttp.getOrgRoles.mockResolvedValue(mockResponse);

			const result = await RoleStoreHttp.getOrgRoles();

			expect(mockRolesStore.setLoadingRoles).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalledWith({
				id: 'test-org-id',
				token: 'test-access-token',
				page: 0,
			});

			// Check that roles are sorted correctly (admin, editor, contributor)
			const expectedSortedRoles = [
				{ id: '2', role: 'admin' },
				{ id: '3', role: 'editor' },
				{ id: '1', role: 'contributor' },
			];

			expect(mockRolesStore.setOrgRoles).toHaveBeenCalledWith(expectedSortedRoles);
			expect(mockRolesStore.setOrgTotalRoles).toHaveBeenCalledWith(3);
			expect(result).toEqual(expectedSortedRoles);
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgRoles.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: {
					userRoles: [{ id: '1', role: 'admin' }],
					totalUserRoles: 1,
				},
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			const result = await RoleStoreHttp.getOrgRoles();

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalledTimes(2);
			expect(result).toEqual([{ id: '1', role: 'admin' }]);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgRoles.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.getOrgRoles(1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// getOrgRoles doesn't show toast on 403 logout - it just logs out
			expect(mockToast.show).not.toHaveBeenCalled();
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};

			mockOrgRolesHttp.getOrgRoles.mockResolvedValue(mockResponse);

			await RoleStoreHttp.getOrgRoles();

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to get roles'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockError = new Error('Network error');
			mockOrgRolesHttp.getOrgRoles.mockRejectedValue(mockError);

			await RoleStoreHttp.getOrgRoles();

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});

		it('should handle missing organization id', async () => {
			mockUserStore.currentRole = null;

			const mockResponse = {
				status: 200,
				data: {
					userRoles: [{ id: '1', role: 'admin' }],
					totalUserRoles: 1,
				},
			};

			mockOrgRolesHttp.getOrgRoles.mockResolvedValue(mockResponse);

			await RoleStoreHttp.getOrgRoles();

			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalledWith({
				id: '',
				token: 'test-access-token',
				page: 0,
			});
		});
	});

	describe('getOrgRole', () => {
		it('should successfully fetch a specific role', async () => {
			const mockResponse = {
				status: 200,
				data: { id: 'role-1', name: 'Admin Role', role: 'admin' },
			};

			mockOrgRolesHttp.getOrgRole.mockResolvedValue(mockResponse);

			const result = await RoleStoreHttp.getOrgRole('role-1');

			expect(mockRolesStore.setLoadingRole).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.getOrgRole).toHaveBeenCalledWith({
				id: 'role-1',
				token: 'test-access-token',
			});
			expect(mockRolesStore.setViewRole).toHaveBeenCalledWith(mockResponse.data);
			expect(result).toEqual(mockResponse.data);
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgRole.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: { id: 'role-1', name: 'Admin Role' },
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			const result = await RoleStoreHttp.getOrgRole('role-1');

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.getOrgRole).toHaveBeenCalledTimes(2);
			expect(result).toEqual({ id: 'role-1', name: 'Admin Role' });
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgRole.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.getOrgRole('role-1', 1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// getOrgRole doesn't show toast on 403 logout - it just logs out
			expect(mockToast.show).not.toHaveBeenCalled();
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockResponse = {
				status: 404,
				message: 'Role not found',
			};

			mockOrgRolesHttp.getOrgRole.mockResolvedValue(mockResponse);

			await RoleStoreHttp.getOrgRole('role-1');

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to get role'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockError = new Error('Network error');
			mockOrgRolesHttp.getOrgRole.mockRejectedValue(mockError);

			await RoleStoreHttp.getOrgRole('role-1');

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});
	});

	describe('getOrgManagerRoles', () => {
		it('should successfully fetch and sort manager roles', async () => {
			const mockResponse = {
				status: 200,
				data: {
					userRoles: [
						{ id: '1', role: 'editor' },
						{ id: '2', role: 'admin' },
					],
					totalUserRoles: 2,
				},
			};

			mockOrgRolesHttp.getOrgEventManagers.mockResolvedValue(mockResponse);

			const result = await RoleStoreHttp.getOrgManagerRoles();

			expect(mockRolesStore.setLoadingRoles).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.getOrgEventManagers).toHaveBeenCalledWith({
				id: 'test-org-id',
				token: 'test-access-token',
				page: 0,
			});

			// Check that roles are sorted correctly (admin, editor)
			const expectedSortedRoles = [
				{ id: '2', role: 'admin' },
				{ id: '1', role: 'editor' },
			];

			expect(mockRolesStore.setOrgRoles).toHaveBeenCalledWith(expectedSortedRoles);
			expect(mockRolesStore.setOrgTotalRoles).toHaveBeenCalledWith(2);
			expect(result).toBeNull();
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgEventManagers.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: {
					userRoles: [{ id: '1', role: 'admin' }],
					totalUserRoles: 1,
				},
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			const result = await RoleStoreHttp.getOrgManagerRoles();

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.getOrgEventManagers).toHaveBeenCalledTimes(2);
			expect(result).toBeNull();
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.getOrgEventManagers.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.getOrgManagerRoles(1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// getOrgManagerRoles shows toast on 403 logout
			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to get manager roles'));
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockResponse = {
				status: 500,
				message: 'Internal Server Error',
			};

			mockOrgRolesHttp.getOrgEventManagers.mockResolvedValue(mockResponse);

			await RoleStoreHttp.getOrgManagerRoles();

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to get manager roles'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockError = new Error('Network error');
			mockOrgRolesHttp.getOrgEventManagers.mockRejectedValue(mockError);

			await RoleStoreHttp.getOrgManagerRoles();

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});
	});

	describe('createOrgRole', () => {
		it('should successfully create a role and refresh roles list', async () => {
			const mockRoleData = {
				organizationId: 'test-org-id',
				role: 'admin',
				userId: 'user-1',
			};

			const mockResponse = {
				status: 201,
				data: { id: 'new-role-1', role: 'admin' },
			};

			mockOrgRolesHttp.createUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: {
					userRoles: [{ id: 'new-role-1', role: 'admin' }],
					totalUserRoles: 1,
				},
			});

			await RoleStoreHttp.createOrgRole(mockRoleData);

			expect(mockRolesStore.setLoadingRole).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.createUserRole).toHaveBeenCalledWith({
				id: 'test-org-id',
				payload: mockRoleData,
				token: 'test-access-token',
			});
			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			const mockRoleData = { organizationId: 'test-org-id', role: 'admin' };
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.createUserRole.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 201,
				data: { id: 'new-role-1', role: 'admin' },
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.createOrgRole(mockRoleData);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.createUserRole).toHaveBeenCalledTimes(2);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockRoleData = { organizationId: 'test-org-id', role: 'admin' };
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.createUserRole.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.createOrgRole(mockRoleData, 1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// createOrgRole shows toast on 403 logout
			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to create role'));
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockRoleData = { organizationId: 'test-org-id', role: 'admin' };
			const mockResponse = {
				status: 400,
				message: 'Bad Request',
			};

			mockOrgRolesHttp.createUserRole.mockResolvedValue(mockResponse);

			await RoleStoreHttp.createOrgRole(mockRoleData);

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to create role'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockRoleData = { organizationId: 'test-org-id', role: 'admin' };
			const mockError = new Error('Network error');

			mockOrgRolesHttp.createUserRole.mockRejectedValue(mockError);

			await RoleStoreHttp.createOrgRole(mockRoleData);

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});

		it('should not set loading if already loading', async () => {
			mockRolesStore.loadingRole = true;
			const mockRoleData = { organizationId: 'test-org-id', role: 'admin' };

			const mockResponse = {
				status: 201,
				data: { id: 'new-role-1', role: 'admin' },
			};

			mockOrgRolesHttp.createUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.createOrgRole(mockRoleData);

			expect(mockRolesStore.setLoadingRole).not.toHaveBeenCalledWith(true);
		});
	});

	describe('updateOrgRole', () => {
		it('should successfully update a role and refresh roles list', async () => {
			const mockRoleData = {
				id: 'role-1',
				role: 'editor',
				userId: 'user-1',
			};

			const mockResponse = {
				status: 200,
				data: { id: 'role-1', role: 'editor' },
			};

			mockOrgRolesHttp.updateUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.updateOrgRole(mockRoleData);

			expect(mockRolesStore.setLoadingRole).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.updateUserRole).toHaveBeenCalledWith({
				id: 'role-1',
				payload: { role: 'editor', userId: 'user-1' }, // id should be removed
				token: 'test-access-token',
			});
			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			const mockRoleData = { id: 'role-1', role: 'editor' };
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.updateUserRole.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: { id: 'role-1', role: 'editor' },
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.updateOrgRole(mockRoleData);

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.updateUserRole).toHaveBeenCalledTimes(2);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockRoleData = { id: 'role-1', role: 'editor' };
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.updateUserRole.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.updateOrgRole(mockRoleData, 1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// updateOrgRole doesn't show toast on 403 logout - it just logs out
			expect(mockToast.show).not.toHaveBeenCalled();
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockRoleData = { id: 'role-1', role: 'editor' };
			const mockResponse = {
				status: 404,
				message: 'Role not found',
			};

			mockOrgRolesHttp.updateUserRole.mockResolvedValue(mockResponse);

			await RoleStoreHttp.updateOrgRole(mockRoleData);

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to update role'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockRoleData = { id: 'role-1', role: 'editor' };
			const mockError = new Error('Network error');

			mockOrgRolesHttp.updateUserRole.mockRejectedValue(mockError);

			await RoleStoreHttp.updateOrgRole(mockRoleData);

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});

		it('should not set loading if already loading', async () => {
			mockRolesStore.loadingRole = true;
			const mockRoleData = { id: 'role-1', role: 'editor' };

			const mockResponse = {
				status: 200,
				data: { id: 'role-1', role: 'editor' },
			};

			mockOrgRolesHttp.updateUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.updateOrgRole(mockRoleData);

			expect(mockRolesStore.setLoadingRole).not.toHaveBeenCalledWith(true);
		});
	});

	describe('deleteOrgRole', () => {
		it('should successfully delete a role and refresh roles list', async () => {
			const mockResponse = {
				status: 200,
				data: { success: true },
			};

			mockOrgRolesHttp.deleteUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.deleteOrgRole('role-1');

			expect(mockRolesStore.setLoadingRole).toHaveBeenCalledWith(true);
			expect(mockRolesStore.setError).toHaveBeenCalledWith(null);
			expect(mockOrgRolesHttp.deleteUserRole).toHaveBeenCalledWith({
				id: 'role-1',
				token: 'test-access-token',
			});
			expect(mockOrgRolesHttp.getOrgRoles).toHaveBeenCalled();
		});

		it('should handle 403 error and retry once', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.deleteUserRole.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
				status: 200,
				data: { success: true },
			});

			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.deleteOrgRole('role-1');

			expect(mockUserStoreHttp.refreshUser).toHaveBeenCalled();
			expect(mockOrgRolesHttp.deleteUserRole).toHaveBeenCalledTimes(2);
		});

		it('should handle 403 error and logout after max retries', async () => {
			const mockResponse = {
				status: 403,
				message: '403 Forbidden',
			};

			mockOrgRolesHttp.deleteUserRole.mockResolvedValue(mockResponse);
			mockUserStoreHttp.refreshUser.mockResolvedValue(undefined);

			await RoleStoreHttp.deleteOrgRole('role-1', 1); // Start with retryCount = 1

			expect(mockUserStoreHttp.refreshUser).not.toHaveBeenCalled();
			// deleteOrgRole doesn't show toast on 403 logout - it just logs out
			expect(mockToast.show).not.toHaveBeenCalled();
			expect(mockUserStoreHttp.tryLogout).toHaveBeenCalled();
		});

		it('should handle other errors', async () => {
			const mockResponse = {
				status: 404,
				message: 'Role not found',
			};

			mockOrgRolesHttp.deleteUserRole.mockResolvedValue(mockResponse);

			await RoleStoreHttp.deleteOrgRole('role-1');

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'Failed to delete role'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockResponse);
		});

		it('should handle exceptions', async () => {
			const mockError = new Error('Network error');

			mockOrgRolesHttp.deleteUserRole.mockRejectedValue(mockError);

			await RoleStoreHttp.deleteOrgRole('role-1');

			expect(mockToast.show).toHaveBeenCalledWith(mockToastError('Oops!', 'An unexpected error occurred'));
			expect(mockRolesStore.setError).toHaveBeenCalledWith(mockError);
		});

		it('should not set loading if already loading', async () => {
			mockRolesStore.loadingRole = true;

			const mockResponse = {
				status: 200,
				data: { success: true },
			};

			mockOrgRolesHttp.deleteUserRole.mockResolvedValue(mockResponse);
			mockOrgRolesHttp.getOrgRoles.mockResolvedValue({
				status: 200,
				data: { userRoles: [], totalUserRoles: 0 },
			});

			await RoleStoreHttp.deleteOrgRole('role-1');

			expect(mockRolesStore.setLoadingRole).not.toHaveBeenCalledWith(true);
		});
	});

	describe('RoleStoreHttp default export', () => {
		it('should export all functions', () => {
			expect(RoleStoreHttp.getOrgRoles).toBeDefined();
			expect(RoleStoreHttp.getOrgRole).toBeDefined();
			expect(RoleStoreHttp.getOrgManagerRoles).toBeDefined();
			expect(RoleStoreHttp.createOrgRole).toBeDefined();
			expect(RoleStoreHttp.updateOrgRole).toBeDefined();
			expect(RoleStoreHttp.deleteOrgRole).toBeDefined();
		});
	});
});
