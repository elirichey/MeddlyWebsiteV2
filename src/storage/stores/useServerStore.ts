import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface ServerState {
	startingServer: boolean;
	toggleStartingServer: () => void;

	// Reset
	resetServer: () => void;
}

export const useServerStore = create<ServerState>()(
	devtools(
		persist(
			(set) => ({
				startingServer: false,
				toggleStartingServer: () => set((state) => ({ startingServer: !state.startingServer })),

				// Reset
				resetServer: () => set({ startingServer: false }),
			}),
			{
				name: 'meddly-server',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.server;
if (testsTurnedOn) {
	useServerStore.subscribe((state) => {
		console.log('Server State:', state);
	});
}
