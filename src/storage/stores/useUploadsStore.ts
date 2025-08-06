import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { UploadItem } from '../../interfaces/Upload';
import cookieStorage from '../cookies';

export interface UploadsState {
	// Camera
	uploadProgressArray: UploadItem[];
	uploadQueue: UploadItem[];
	uploadError: any | null;

	setUploadProgressArray: (uploadProgressArray: UploadItem[]) => void;
	setUploadQueue: (uploadQueue: UploadItem[]) => void;
	clearUploadQueue: () => void;
	setUploadError: (uploadError: any) => void;

	// Package Uploads
	packageUploadProgressArray: UploadItem[]; //
	packageUploadQueue: UploadItem[];
	packageUploadError: any | null;

	setPackageUploadProgressArray: (packageUploadProgressArray: UploadItem[]) => void;
	setPackageUploadQueue: (packageUploadQueue: UploadItem[]) => void;
	clearPackageUploadQueue: () => void;
	setPackageUploadError: (packageUploadError: any) => void;

	// Reset Uploads
	resetUploads: () => void;
}

export const useUploadsStore = create<UploadsState>()(
	devtools(
		persist(
			(set) => ({
				// Camera
				uploadProgressArray: [],
				uploadQueue: [],
				uploadError: null,

				setUploadProgressArray: (uploadProgressArray: UploadItem[]) => set({ uploadProgressArray }),
				setUploadQueue: (uploadQueue: UploadItem[]) => set({ uploadQueue }),
				clearUploadQueue: () => set({ uploadQueue: [] }),
				setUploadError: (uploadError: any) => set({ uploadError }),

				// Package Uploads
				packageUploadProgressArray: [],
				packageUploadQueue: [],
				packageUploadError: null,

				setPackageUploadProgressArray: (packageUploadProgressArray: UploadItem[]) =>
					set({ packageUploadProgressArray }),
				setPackageUploadQueue: (packageUploadQueue: UploadItem[]) => set({ packageUploadQueue }),
				clearPackageUploadQueue: () => set({ packageUploadQueue: [] }),
				setPackageUploadError: (packageUploadError: any) => set({ packageUploadError }),

				// Reset Uploads
				resetUploads: () =>
					set({
						uploadProgressArray: [],
						uploadQueue: [],
						uploadError: null,
						packageUploadProgressArray: [],
						packageUploadQueue: [],
						packageUploadError: null,
					}),
			}),
			{
				name: 'meddly-uploads',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.uploads;
if (testsTurnedOn) {
	useUploadsStore.subscribe((state) => {
		console.log('Uploads State:', state);
	});
}
