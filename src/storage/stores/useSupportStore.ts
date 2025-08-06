import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface SupportState {
	userOrgRequests: any[];
	loadingUserOrgRequests: boolean;

	setUserOrgRequests: (userOrgRequests: any[]) => void;
	setLoadingUserOrgRequests: (loadingUserOrgRequests: boolean) => void;

	// Reset
	resetSupport: () => void;
}

export const useSupportStore = create<SupportState>()(
	devtools(
		persist(
			(set) => ({
				userOrgRequests: [],
				loadingUserOrgRequests: false,

				setUserOrgRequests: (userOrgRequests: any[]) => set({ userOrgRequests }),
				setLoadingUserOrgRequests: (loadingUserOrgRequests: boolean) => set({ loadingUserOrgRequests }),

				// Reset
				resetSupport: () => set({ userOrgRequests: [], loadingUserOrgRequests: false }),
			}),
			{
				name: 'meddly-support',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.support;
if (testsTurnedOn) {
	useSupportStore.subscribe((state) => {
		console.log('Support State:', state);
	});
}
