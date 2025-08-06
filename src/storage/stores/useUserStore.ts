import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { AuthTokens, Profile, UserSelectedRole } from '../../interfaces/Auth';
import cookieStorage from '../cookies';

export interface UserState {
	// Loading
	loading: boolean;
	setLoading: (loading: boolean) => void;

	// Auth
	profile: Profile | null;
	tokens: AuthTokens | null;
	userRoles: UserSelectedRole[];
	currentRole: UserSelectedRole | null;
	loadingCurrentRole: boolean;
	setProfile: (profile: Profile | null) => void;
	setTokens: (tokens: AuthTokens) => void;
	setUserRoles: (userRoles: UserSelectedRole[]) => void;
	setCurrentRole: (currentRole: UserSelectedRole | null) => void;
	setLoadingCurrentRole: (loadingCurrentRole: boolean) => void;

	// Events
	connectedEventLoading: boolean;
	setConnectedEventLoading: (connectedEventLoading: boolean) => void;

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
				profile: null,
				tokens: null,
				userRoles: [],
				currentRole: null,
				loadingCurrentRole: false,
				setProfile: (profile: Profile | null) => set({ profile }),
				setTokens: (tokens: AuthTokens) => set({ tokens }),
				setUserRoles: (userRoles: UserSelectedRole[]) => set({ userRoles }),
				setCurrentRole: (currentRole: UserSelectedRole | null) => set({ currentRole }),
				setLoadingCurrentRole: (loadingCurrentRole: boolean) => set({ loadingCurrentRole }),

				// Events
				connectedEventLoading: false,
				setConnectedEventLoading: (connectedEventLoading: boolean) => set({ connectedEventLoading }),

				// Error
				error: null,
				setError: (error: any) => set({ error }),

				// Reset User
				resetUserStore: () =>
					set({
						loading: false,
						error: null,
						profile: null,
						tokens: null,
						userRoles: [],
						currentRole: null,
						loadingCurrentRole: false,
						connectedEventLoading: false,
					}),
			}),
			{
				name: 'meddly-user',
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
