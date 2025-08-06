import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { Sequence } from '@/interfaces/Sequence';
import cookieStorage from '../cookies';

export interface SequencesState {
	// Event Sequences
	eventSequences: any[];
	loadingEventSequences: boolean;
	setEventSequences: (sequences: any[]) => void;
	setLoadingEventSequences: (loading: boolean) => void;

	// User Event Sequences
	userEventSequences: any[];
	loadingUserEventSequences: boolean;
	setUserEventSequences: (sequences: any[]) => void;
	setLoadingUserEventSequences: (loading: boolean) => void;

	// Org Event Sequences
	orgEventSequences: any[];
	loadingOrgEventSequences: boolean;
	setOrgEventSequences: (sequences: any[]) => void;
	setLoadingOrgEventSequences: (loading: boolean) => void;

	// Current Sequence
	currentSequence: any;
	loadingCurrentSequence: boolean;
	setCurrentSequence: (sequence: any) => void;
	setLoadingCurrentSequence: (loading: boolean) => void;

	// Reset Sequences
	resetSequences: () => void;

	// Error handling
	error: any;
	setError: (error: any) => void;
}

export const useSequencesStore = create<SequencesState>()(
	devtools(
		persist(
			(set) => ({
				// Event Sequences
				eventSequences: [],
				loadingEventSequences: false,
				setEventSequences: (sequences) => set({ eventSequences: sequences }),
				setLoadingEventSequences: (loading) => set({ loadingEventSequences: loading }),

				// User Event Sequences
				userEventSequences: [],
				loadingUserEventSequences: false,
				setUserEventSequences: (sequences) => set({ userEventSequences: sequences }),
				setLoadingUserEventSequences: (loading) => set({ loadingUserEventSequences: loading }),

				// Org Event Sequences
				orgEventSequences: [],
				loadingOrgEventSequences: false,
				setOrgEventSequences: (sequences) => set({ orgEventSequences: sequences }),
				setLoadingOrgEventSequences: (loading) => set({ loadingOrgEventSequences: loading }),

				// Current Sequence
				currentSequence: null,
				loadingCurrentSequence: false,
				setCurrentSequence: (sequence) => set({ currentSequence: sequence }),
				setLoadingCurrentSequence: (loading) => set({ loadingCurrentSequence: loading }),

				// Reset Sequences
				resetSequences: () =>
					set({
						eventSequences: [],
						loadingEventSequences: false,
						userEventSequences: [],
						loadingUserEventSequences: false,
						orgEventSequences: [],
						loadingOrgEventSequences: false,
						currentSequence: null,
						loadingCurrentSequence: false,
						error: null,
					}),

				// Error handling
				error: null,
				setError: (error) => set({ error }),
			}),
			{
				name: 'meddly-sequences',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.sequences;
if (testsTurnedOn) {
	useSequencesStore.subscribe((state) => {
		console.log('Sequences State:', state);
	});
}
