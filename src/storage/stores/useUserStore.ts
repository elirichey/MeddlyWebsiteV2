import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface UserState {
	// Loading
	loading: boolean;
	setLoading: (loading: boolean) => void;

	// Auth
	loadingCurrentRole: boolean;
	setLoadingCurrentRole: (loadingCurrentRole: boolean) => void;

	// Error
	error: any | null;
	setError: (error: any) => void;

	// Reset User
	resetUserStore: () => void;
}

export const useUserStore = create<UserState>()(
	devtools(
		persist(
			(set) => ({
				// Loading
				loading: false,
				setLoading: (loading: boolean) => set({ loading }),

				// Auth
				loadingCurrentRole: false,
				setLoadingCurrentRole: (loadingCurrentRole: boolean) => set({ loadingCurrentRole }),

				// Error
				error: null,
				setError: (error: any) => set({ error }),

				// Reset User
				resetUserStore: () =>
					set({
						loading: false,
						error: null,
						loadingCurrentRole: false,
					}),
			}),
			{
				name: 'userStore',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.user;
if (testsTurnedOn) {
	useUserStore.subscribe((state) => {
		console.log('User State:', state);
	});
}
