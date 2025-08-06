import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { MeddlyEvent } from '../../interfaces/Event';
import cookieStorage from '../cookies';

export interface EventState {
	// View Event
	viewEvent: MeddlyEvent | null;
	loadingViewEvent: boolean;

	setViewEvent: (viewEvent: MeddlyEvent | null) => void;
	setLoadingViewEvent: (loadingViewEvent: boolean) => void;

	// Camera Events - loadingCamera & loadingCameraEvent
	cameraEvents: MeddlyEvent[];
	cameraEventsTotal: number;
	loadingCameraEvents: boolean;

	setCameraEvents: (cameraEvents: MeddlyEvent[]) => void;
	setCameraEventsTotal: (cameraEventsTotal: number) => void;
	setLoadingCameraEvents: (loadingCameraEvents: boolean) => void;

	// Org Events
	orgEventsCurrentTab: string;
	orgEventsStatuses: string[];

	setOrgEventsCurrentTab: (orgEventsCurrentTab: string) => void;
	setOrgEventsStatuses: (orgEventsStatuses: string[]) => void;

	orgEvents: MeddlyEvent[];
	orgEventsCurrentPage: number;
	orgEventsTotal: number;
	loadingOrgEvents: boolean;

	setOrgEvents: (orgEvents: MeddlyEvent[]) => void;
	setOrgEventsCurrentPage: (orgEventsCurrentPage: number) => void;
	setOrgEventsTotal: (orgEventsTotal: number) => void;
	setLoadingOrgEvents: (loadingOrgEvents: boolean) => void;

	// Manager
	managerSetupEvent: boolean;
	managerStartingEvent: boolean;
	managerCancelingEvent: boolean;
	managerEndingEvent: boolean;

	setManagerSetupEvent: (val: boolean) => void;
	setManagerStartingEvent: (val: boolean) => void;
	setManagerCancelingEvent: (val: boolean) => void;
	setManagerEndingEvent: (val: boolean) => void;

	// Org Home
	orgCompletedEvents: MeddlyEvent[];
	orgCompletedEventsCurrentPage: number;
	orgCompletedEventsTotal: number;
	loadingOrgCompletedEvents: boolean;

	setOrgCompletedEvents: (orgCompletedEvents: MeddlyEvent[]) => void;
	setOrgCompletedEventsCurrentPage: (orgCompletedEventsCurrentPage: number) => void;
	setOrgCompletedEventsTotal: (orgCompletedEventsTotal: number) => void;
	setLoadingOrgCompletedEvents: (loadingOrgCompletedEvents: boolean) => void;

	// Error
	error: any | null;
	setError: (error: any) => void;

	// Reset Events
	resetEvents: () => void;
}

export const useEventStore = create<EventState>()(
	devtools(
		persist(
			(set) => ({
				// View Event
				viewEvent: null,
				loadingViewEvent: false,

				setViewEvent: (viewEvent: MeddlyEvent | null) => set({ viewEvent }),
				setLoadingViewEvent: (loadingViewEvent: boolean) => set({ loadingViewEvent }),

				// Camera Events
				cameraEvents: [],
				cameraEventsTotal: 0,
				loadingCameraEvents: false,

				setCameraEvents: (cameraEvents: MeddlyEvent[]) => set({ cameraEvents }),
				setCameraEventsTotal: (cameraEventsTotal: number) => set({ cameraEventsTotal }),
				setLoadingCameraEvents: (loadingCameraEvents: boolean) => set({ loadingCameraEvents }),

				// Org Events
				orgEventsCurrentTab: 'All',
				orgEventsStatuses: [],

				setOrgEventsCurrentTab: (orgEventsCurrentTab: string) => set({ orgEventsCurrentTab }),
				setOrgEventsStatuses: (orgEventsStatuses: string[]) => set({ orgEventsStatuses }),

				orgEvents: [],
				orgEventsCurrentPage: 0,
				orgEventsTotal: 0,
				loadingOrgEvents: false,

				setOrgEvents: (orgEvents: MeddlyEvent[]) => set({ orgEvents }),
				setOrgEventsCurrentPage: (orgEventsCurrentPage: number) => set({ orgEventsCurrentPage }),
				setOrgEventsTotal: (orgEventsTotal: number) => set({ orgEventsTotal }),
				setLoadingOrgEvents: (loadingOrgEvents: boolean) => set({ loadingOrgEvents }),

				// Manager
				managerSetupEvent: false,
				managerStartingEvent: false,
				managerCancelingEvent: false,
				managerEndingEvent: false,

				setManagerSetupEvent: (val: boolean) => set(() => ({ managerSetupEvent: val })),
				setManagerStartingEvent: (val: boolean) => set(() => ({ managerStartingEvent: val })),
				setManagerCancelingEvent: (val: boolean) => set(() => ({ managerCancelingEvent: val })),
				setManagerEndingEvent: (val: boolean) => set(() => ({ managerEndingEvent: val })),

				// loadingManagerUpdateEvent: false,
				// setLoadingManagerUpdateEvent: (loadingManagerUpdateEvent: boolean) => set({ loadingManagerUpdateEvent }),

				// Org Home
				orgCompletedEvents: [],
				orgCompletedEventsCurrentPage: 0,
				orgCompletedEventsTotal: 0,
				loadingOrgCompletedEvents: false,

				setOrgCompletedEvents: (orgCompletedEvents: MeddlyEvent[]) => set({ orgCompletedEvents }),
				setOrgCompletedEventsCurrentPage: (orgCompletedEventsCurrentPage: number) =>
					set({ orgCompletedEventsCurrentPage }),
				setOrgCompletedEventsTotal: (orgCompletedEventsTotal: number) => set({ orgCompletedEventsTotal }),
				setLoadingOrgCompletedEvents: (loadingOrgCompletedEvents: boolean) => set({ loadingOrgCompletedEvents }),

				// Error
				error: null,
				setError: (error: any) => set({ error }),

				// Reset Events
				resetEvents: () =>
					set({
						// Reset Events
						viewEvent: null,
						loadingViewEvent: false,

						// Camera Events
						cameraEvents: [],
						cameraEventsTotal: 0,
						loadingCameraEvents: false,

						// Org Events
						orgEventsCurrentTab: 'All',
						orgEventsStatuses: [],

						orgEvents: [],
						orgEventsCurrentPage: 0,
						orgEventsTotal: 0,
						loadingOrgEvents: false,

						// Manager
						managerSetupEvent: false,
						managerStartingEvent: false,
						managerCancelingEvent: false,
						managerEndingEvent: false,

						// Org Home
						orgCompletedEvents: [],
						orgCompletedEventsCurrentPage: 0,
						orgCompletedEventsTotal: 0,
						loadingOrgCompletedEvents: false,
						error: null,
					}),
			}),
			{
				name: 'meddly-events',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.event;
if (testsTurnedOn) {
	useEventStore.subscribe((state) => {
		console.log('Event State:', state);
	});
}
