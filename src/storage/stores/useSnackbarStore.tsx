import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface SnackbarState {
	snackbar: {
		title: string;
		description: string;
		type: 'success' | 'error' | 'warning' | 'general';
		duration: number;
		show: boolean;
	} | null;
	setSnackbar: (
		snackbar: {
			title: string;
			description: string;
			type: 'success' | 'error' | 'warning' | 'general';
			duration: number;
			show: boolean;
		} | null,
	) => void;
}

export const useSnackbarStore = create<SnackbarState>()(
	devtools(
		persist(
			(set) => ({
				snackbar: null,
				setSnackbar: (
					snackbar: {
						title: string;
						description: string;
						type: 'success' | 'error' | 'warning' | 'general';
						duration: number;
						show: boolean;
					} | null,
				) =>
					set({
						snackbar: {
							title: snackbar?.title || '',
							description: snackbar?.description || '',
							type: snackbar?.type || 'general',
							duration: snackbar?.duration || 3000,
							show: snackbar?.show || false,
						},
					}),
			}),
			{
				name: 'meddly-snackbar',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.snackbar;
if (testsTurnedOn) {
	useSnackbarStore.subscribe((state) => {
		console.log('Snackbar State:', state);
	});
}
