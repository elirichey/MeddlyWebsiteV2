import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface ThemeState {
	darkMode: boolean;
	toggleDarkMode: () => void;

	// Reset
	resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	devtools(
		persist(
			(set) => ({
				darkMode: false,
				toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

				// Reset
				resetTheme: () => set({ darkMode: false }),
			}),
			{
				name: 'meddly-theme',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.theme;
if (testsTurnedOn) {
	useThemeStore.subscribe((state) => {
		console.log('Theme State:', state);
	});
}
