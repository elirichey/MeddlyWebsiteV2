import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { Organization } from '@/interfaces/Organization';
import cookieStorage from '../cookies';

export interface OrganizationState {
	// General
	viewOrg: Organization | any | null;
	loadingOrg: boolean;
	orgError: string | null;

	setViewOrg: (org: Organization | null) => void;
	setLoadingOrg: (bool: boolean) => void;
	setOrgError: (error: string | null) => void;

	// Reset
	resetOrgs: () => void;
}

export const useOrgStore = create<OrganizationState>()(
	devtools(
		persist(
			(set) => ({
				// General
				viewOrg: null,
				loadingOrg: false,
				orgRoles: [],
				loadingOrgRoles: false,
				orgError: null,

				setViewOrg: (org: Organization | null) => set({ viewOrg: org }),
				setLoadingOrg: (bool: boolean) => set({ loadingOrg: bool }),
				setOrgError: (error: string | null) => set({ orgError: error }),

				// Reset
				resetOrgs: () => set({ loadingOrg: false, viewOrg: null, orgError: null }),
			}),
			{
				name: 'meddly-orgs',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.org;
if (testsTurnedOn) {
	useOrgStore.subscribe((state) => {
		console.log('Org State:', state);
	});
}
