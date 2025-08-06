import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { UserSelectedRole } from '@/interfaces/Auth';
import type { UserRole } from '@/interfaces/UserRoles';
import cookieStorage from '../cookies';

export interface RolesState {
	// Org Roles
	orgRoles: UserRole[];
	orgRolesCurrentPage: number;
	orgTotalRoles: number;
	loadingRoles: boolean;

	setOrgRoles: (orgRoles: UserRole[]) => void;
	setOrgRolesCurrentPage: (orgRolesCurrentPage: number) => void;
	setOrgTotalRoles: (orgTotalRoles: number) => void;
	setLoadingRoles: (loadingRoles: boolean) => void;

	// View Role
	viewRole: UserSelectedRole | null;
	loadingRole: boolean;

	setViewRole: (viewRole: UserSelectedRole | null) => void;
	setLoadingRole: (loadingRole: boolean) => void;

	// Error
	error: null | any;
	setError: (error: any) => void;

	// Reset Roles
	resetRoles: () => void;
}

export const useRolesStore = create<RolesState>()(
	devtools(
		persist(
			(set) => ({
				// Org Roles
				orgRoles: [],
				orgRolesCurrentPage: 0,
				orgTotalRoles: 0,
				loadingRoles: false,

				setOrgRoles: (orgRoles: UserRole[]) => set({ orgRoles }),
				setOrgRolesCurrentPage: (orgRolesCurrentPage: number) => set({ orgRolesCurrentPage }),
				setOrgTotalRoles: (orgTotalRoles: number) => set({ orgTotalRoles }),
				setLoadingRoles: (loadingRoles: boolean) => set({ loadingRoles }),

				// View Role
				viewRole: null,
				loadingRole: false,

				setViewRole: (viewRole: UserSelectedRole | null) => set({ viewRole }),
				setLoadingRole: (loadingRole: boolean) => set({ loadingRole }),

				// Error
				error: null,
				setError: (error: any) => set({ error }),

				// Reset Roles
				resetRoles: () =>
					set({
						loadingRoles: false,
						loadingRole: false,
						orgRoles: [],
						orgRolesCurrentPage: 0,
						orgTotalRoles: 0,
						viewRole: null,
						error: null,
					}),
			}),
			{
				name: 'meddly-roles',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.roles;
if (testsTurnedOn) {
	useRolesStore.subscribe((state) => {
		console.log('Roles State:', state);
	});
}
