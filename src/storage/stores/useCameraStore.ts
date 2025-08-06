import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '../../config/testing';
import cookieStorage from '../cookies';

const initialState: Partial<CameraState> = {
	// Camera
	mode: 'video',
	flash: 'off',
	isRecording: false,
	frontCamera: true,

	// Switches
	startswitch: false,
	killswitch: false,
	hideStatusBar: false,

	// Modals
	showFlashOptions: false,
	showEventOptions: false,
	showDeviceInfo: false,
	showMediaUploads: false,

	// Error
	error: null,
};

export interface CameraState {
	// Camera
	mode: string;
	flash: string;
	isRecording: boolean;
	frontCamera: boolean;

	toggleMode: () => void;
	setFlash: (val: 'on' | 'off' | 'auto') => void;
	toggleFlash: () => void;
	toggleFrontCamera: () => void;
	setIsRecording: (val: boolean) => void;
	toggleViewport: () => void;

	// Switches
	startswitch: boolean;
	killswitch: boolean;
	hideStatusBar: boolean;
	setStartswitch: (val: boolean) => void;
	setKillswitch: (val: boolean) => void;
	setHideStatusBar: (val: boolean) => void;

	// Modals
	showFlashOptions: boolean;
	showEventOptions: boolean;
	showDeviceInfo: boolean;
	showMediaUploads: boolean;

	setShowFlashOptions: (val: boolean) => void;
	setShowEventOptions: (val: boolean) => void;
	setShowDeviceInfo: (val: boolean) => void;
	setShowMediaUploads: (val: boolean) => void;

	// uploadProgressArray: UploadItem[]; // MOVED TO useUploadsStore()
	// uploadQueue: UploadItem[]; // MOVED TO useUploadsStore()

	// uploadFile: (file: UploadItem) => void;
	// clearUploadQueue: () => void;

	// Error
	error: any | null;
	setError: (error: any) => void;

	// Reset Camera
	resetCamera: () => void;
}

export const useCameraStore = create<CameraState>()(
	devtools(
		persist(
			(set) => ({
				// Camera
				mode: 'video',
				flash: 'off',
				isRecording: false,
				frontCamera: true,

				toggleMode: () => set((state) => ({ mode: state.mode === 'video' ? 'photo' : 'video' })),
				setFlash: (val: 'on' | 'off' | 'auto') => set(() => ({ flash: val })),
				toggleFlash: () =>
					set((state) => ({
						flash: state.flash === 'off' ? 'auto' : state.flash === 'auto' ? 'on' : 'off',
					})),
				toggleFrontCamera: () => set((state) => ({ frontCamera: !state.frontCamera })),
				setIsRecording: (val: boolean) => set(() => ({ isRecording: val })),
				toggleViewport: () => set((state) => ({ frontCamera: !state.frontCamera })),

				// Switches
				startswitch: false,
				killswitch: false,
				hideStatusBar: false,
				setStartswitch: (val: boolean) => set(() => ({ startswitch: val })),
				setKillswitch: (val: boolean) => set(() => ({ killswitch: val })),
				setHideStatusBar: (val: boolean) => set(() => ({ hideStatusBar: val })),

				// Modals
				showFlashOptions: false,
				showEventOptions: false,
				showDeviceInfo: false,
				showMediaUploads: false,

				setShowFlashOptions: (val: boolean) => set(() => ({ showFlashOptions: val })),
				setShowEventOptions: (val: boolean) => set(() => ({ showEventOptions: val })),
				setShowDeviceInfo: (val: boolean) => set(() => ({ showDeviceInfo: val })),
				setShowMediaUploads: (val: boolean) => set(() => ({ showMediaUploads: val })),

				// Error
				error: null,
				setError: (error: unknown) => set({ error }),

				// Reset Camera
				resetCamera: () => set(initialState),
			}),
			{
				name: 'meddly-camera',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.camera;
if (testsTurnedOn) {
	useCameraStore.subscribe((state) => {
		console.log('Camera State:', state);
	});
}
