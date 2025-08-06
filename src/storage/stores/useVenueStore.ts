import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { Venue } from '../../interfaces/Venue';
import cookieStorage from '../cookies';

export interface VenueState {
	// General
	searchVenues: Venue[];
	loadingVenues: boolean;
	venuesError: string | null;
	setSearchVenues: (venues: Venue[]) => void;
	setLoadingVenues: (bool: boolean) => void;
	setVenuesError: (error: string | null) => void;

	// Reset
	resetVenues: () => void;
}

export const useVenueStore = create<VenueState>()(
	devtools(
		persist(
			(set) => ({
				// General
				searchVenues: [],
				loadingVenues: false,
				venuesError: null,

				setSearchVenues: (venues: Venue[]) => set({ searchVenues: venues }),
				setLoadingVenues: (bool: boolean) => set({ loadingVenues: bool }),
				setVenuesError: (error: string | null) => set({ venuesError: error }),

				// Resetf
				resetVenues: () => set({ loadingVenues: false, searchVenues: [], venuesError: null }),
			}),
			{
				name: 'meddly-venues',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.venue;
if (testsTurnedOn) {
	useVenueStore.subscribe((state) => {
		console.log('Venue State:', state);
	});
}
