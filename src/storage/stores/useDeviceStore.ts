import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface RoleDevice {
	orgId: string;
	name: string;
}

export interface DeviceState {
	// User
	userDevice: { name: string };
	setUserDevice: (user: { name: string }) => void;

	// Org
	roleDevices: RoleDevice[];
	setRoleDevices: (roles: RoleDevice[]) => void;

	// Reset
	resetDeviceInfo: () => void;
}

export const useDeviceStore = create<DeviceState>()(
	devtools(
		persist(
			(set) => ({
				// User
				userDevice: { name: '' },
				setUserDevice: (userDevice: { name: string }) => set({ userDevice }),

				// Org
				roleDevices: [] as RoleDevice[],
				setRoleDevices: (roleDevices: RoleDevice[]) => set({ roleDevices }),

				// Reset
				resetDeviceInfo: () => set({ userDevice: { name: '' }, roleDevices: [] }),
			}),
			{
				name: 'meddly-devices',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.device;
if (testsTurnedOn) {
	useDeviceStore.subscribe((state) => {
		console.log('Device State:', state);
	});
}
