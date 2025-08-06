import { renderHook, act } from '@testing-library/react-hooks';
import { useDeviceStore } from '../../stores/useDeviceStore';
import DeviceStoreHttp from '../../http/deviceStoreHttp';

describe('DeviceStoreHttp', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useDeviceStore.setState({
				userDevice: { name: '' },
				roleDevices: [],
			});
		});
	});

	describe('updateUserDeviceInfo', () => {
		it('should update user device information', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const newUserDevice = { name: 'Test Device' };

			await act(async () => {
				await DeviceStoreHttp.updateUserDeviceInfo(newUserDevice);
			});

			expect(result.current.userDevice).toEqual(newUserDevice);
		});

		it('should handle empty device name', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const emptyDevice = { name: '' };

			await act(async () => {
				await DeviceStoreHttp.updateUserDeviceInfo(emptyDevice);
			});

			expect(result.current.userDevice).toEqual(emptyDevice);
		});

		it('should handle multiple device name updates', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const firstDevice = { name: 'First Device' };
			const secondDevice = { name: 'Second Device' };

			await act(async () => {
				await DeviceStoreHttp.updateUserDeviceInfo(firstDevice);
			});

			expect(result.current.userDevice).toEqual(firstDevice);

			await act(async () => {
				await DeviceStoreHttp.updateUserDeviceInfo(secondDevice);
			});

			expect(result.current.userDevice).toEqual(secondDevice);
		});
	});

	describe('updateOrgDeviceInfo', () => {
		it('should add new org device when org does not exist', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const newOrgDevice = { orgId: 'org1', name: 'Org Device 1' };

			await act(async () => {
				await DeviceStoreHttp.updateOrgDeviceInfo(newOrgDevice);
			});

			expect(result.current.roleDevices).toHaveLength(1);
			expect(result.current.roleDevices[0]).toEqual(newOrgDevice);
		});

		it('should update existing org device', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const initialOrgDevice = { orgId: 'org1', name: 'Initial Device' };
			const updatedOrgDevice = { orgId: 'org1', name: 'Updated Device' };

			// First add the initial device
			await act(async () => {
				await DeviceStoreHttp.updateOrgDeviceInfo(initialOrgDevice);
			});

			// Then update it
			await act(async () => {
				await DeviceStoreHttp.updateOrgDeviceInfo(updatedOrgDevice);
			});

			expect(result.current.roleDevices).toHaveLength(1);
			expect(result.current.roleDevices[0]).toEqual(updatedOrgDevice);
		});

		it('should handle multiple org devices', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const orgDevice1 = { orgId: 'org1', name: 'Org Device 1' };
			const orgDevice2 = { orgId: 'org2', name: 'Org Device 2' };

			await act(async () => {
				await DeviceStoreHttp.updateOrgDeviceInfo(orgDevice1);
				await DeviceStoreHttp.updateOrgDeviceInfo(orgDevice2);
			});

			expect(result.current.roleDevices).toHaveLength(2);
			expect(result.current.roleDevices).toContainEqual(orgDevice1);
			expect(result.current.roleDevices).toContainEqual(orgDevice2);
		});

		it('should handle empty device name for org device', async () => {
			const { result } = renderHook(() => useDeviceStore());
			const emptyOrgDevice = { orgId: 'org1', name: '' };

			await act(async () => {
				await DeviceStoreHttp.updateOrgDeviceInfo(emptyOrgDevice);
			});

			expect(result.current.roleDevices).toHaveLength(1);
			expect(result.current.roleDevices[0]).toEqual(emptyOrgDevice);
		});
	});
});
