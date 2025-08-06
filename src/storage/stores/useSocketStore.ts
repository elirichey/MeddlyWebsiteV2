import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { SocketSession } from '@/interfaces/Socket';
import cookieStorage from '../cookies';

export interface SocketState {
	// Socket
	session: SocketSession | null;

	createSocketSession: (data: SocketSession) => void;
	updateSocketSession: (data: SocketSession) => void;
	disconnectSocket: () => void;
	resetSocket: () => void;

	// Error
	error: any | null;
	logSocketError: (error: any) => void;
}

export const useSocketStore = create<SocketState>()(
	devtools(
		persist(
			(set) => ({
				// Socket
				session: null,

				createSocketSession: (data) => {
					console.log('[SocketStore] Creating session:', data);
					set({ session: data, error: null });
				},
				updateSocketSession: (data) => {
					console.log('[SocketStore] Updating session:', data);
					set({ session: data, error: null });
				},
				disconnectSocket: () => {
					console.log('[SocketStore] Disconnecting socket');
					set({ session: null, error: null });
				},
				resetSocket: () => {
					console.log('[SocketStore] Resetting socket');
					set({ session: null, error: null });
				},

				// Error
				error: null,
				logSocketError: (error) => {
					console.error('[SocketStore] Logging error:', error);
					set({ error });
				},
			}),
			{
				name: 'meddly-sockets',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.socket;
if (testsTurnedOn) {
	useSocketStore.subscribe((state) => {
		console.log('Socket State:', state);
	});
}
