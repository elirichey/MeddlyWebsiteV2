import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import cookieStorage from '../cookies';

export interface MediaState {
	// Download
	showDownloadScreen: boolean;
	setShowDownloadScreen: (showDownloadScreen: boolean) => void;

	// Media
	file: string | null;
	jobId: number | null;
	downloadProgress: number;

	setFile: (file: string | null) => void;
	setJobId: (jobId: number | null) => void;
	setDownloadProgress: (downloadProgress: number) => void;

	// Error
	error: string | null;
	setError: (error: string | null) => void;

	// Reset
	resetMedia: () => void;
}

export const useMediaStore = create<MediaState>()(
	devtools(
		persist(
			(set) => ({
				// Download
				showDownloadScreen: false,
				setShowDownloadScreen: (showDownloadScreen: boolean) => set({ showDownloadScreen }),

				// Media
				file: null,
				jobId: null,
				downloadProgress: 0,

				setFile: (file: string | null) => set({ file }),
				setJobId: (jobId: number | null) => set({ jobId }),
				setDownloadProgress: (downloadProgress: number) => set({ downloadProgress }),

				// Error
				error: null,
				setError: (error: string | null) => set({ error }),

				// Reset
				resetMedia: () =>
					set({
						file: null,
						jobId: null,
						downloadProgress: 0,
						error: null,
					}),
			}),
			{
				name: 'meddly-media',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.media;
if (testsTurnedOn) {
	useMediaStore.subscribe((state) => {
		console.log('Media State:', state);
	});
}
