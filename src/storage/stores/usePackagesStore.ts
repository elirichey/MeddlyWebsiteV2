import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import TestConfig from '@/config/testing';
import type { PackageItem } from '@/interfaces/Package';
import cookieStorage from '../cookies';

export interface PackagesState {
	// Event Posts
	eventPosts: PackageItem[];
	eventPostsCurrentPage: number;
	eventTotalPosts: number;
	loadingEventPosts: boolean;

	setEventPosts: (eventPosts: PackageItem[]) => void;
	setEventPostsCurrentPage: (eventPostsCurrentPage: number) => void;
	setEventTotalPosts: (eventTotalPosts: number) => void;
	setLoadingEventPosts: (loadingEventPosts: boolean) => void;
	resetEventPosts: () => void;

	// Event Packages
	eventPackages: PackageItem[];
	eventPackagesCurrentPage: number;
	eventTotalPackages: number;
	loadingEventPackages: boolean;

	setEventPackages: (eventPackages: PackageItem[]) => void;
	setEventPackagesCurrentPage: (eventPackagesCurrentPage: number) => void;
	setEventTotalPackages: (eventTotalPackages: number) => void;
	setLoadingEventPackages: (loadingEventPackages: boolean) => void;
	resetEventPackages: () => void;

	// Package Posts
	packagePosts: PackageItem[];
	packagePostsCurrentPage: number;
	packageTotalPosts: number;
	loadingPackagePosts: boolean;

	setPackagePosts: (packagePosts: PackageItem[]) => void;
	setPackagePostsCurrentPage: (packagePostsCurrentPage: number) => void;
	setPackageTotalPosts: (packageTotalPosts: number) => void;
	setLoadingPackagePosts: (loadingPackagePosts: boolean) => void;
	resetPackagePosts: () => void;

	// View Package
	viewPackage: PackageItem | null;
	loadingPackage: boolean;
	setViewPackage: (viewPackage: PackageItem | null) => void;
	setLoadingPackage: (loadingPackage: boolean) => void;
	resetViewPackage: () => void;

	// Error
	error: any | null;
	setError: (error: any) => void;

	// Reset Packages
	resetPackages: () => void;
}

export const usePackagesStore = create<PackagesState>()(
	devtools(
		persist(
			(set) => ({
				// Event Posts
				eventPosts: [],
				eventPostsCurrentPage: 0,
				eventTotalPosts: 0,
				loadingEventPosts: false,

				setEventPosts: (eventPosts: PackageItem[]) => set({ eventPosts }),
				setEventPostsCurrentPage: (eventPostsCurrentPage: number) => set({ eventPostsCurrentPage }),
				setEventTotalPosts: (eventTotalPosts: number) => set({ eventTotalPosts }),
				setLoadingEventPosts: (loadingEventPosts: boolean) => set({ loadingEventPosts }),
				resetEventPosts: () =>
					set({ eventPosts: [], eventPostsCurrentPage: 0, eventTotalPosts: 0, loadingEventPosts: false }),

				// Event Packages
				eventPackages: [],
				eventPackagesCurrentPage: 0,
				eventTotalPackages: 0,
				loadingEventPackages: false,

				setEventPackages: (eventPackages: PackageItem[]) => set({ eventPackages }),
				setEventPackagesCurrentPage: (eventPackagesCurrentPage: number) => set({ eventPackagesCurrentPage }),
				setEventTotalPackages: (eventTotalPackages: number) => set({ eventTotalPackages }),
				setLoadingEventPackages: (loadingEventPackages: boolean) => set({ loadingEventPackages }),
				resetEventPackages: () =>
					set({ eventPackages: [], eventPackagesCurrentPage: 0, eventTotalPackages: 0, loadingEventPackages: false }),

				// Package Posts
				packagePosts: [],
				packagePostsCurrentPage: 0,
				packageTotalPosts: 0,
				loadingPackagePosts: false,

				setPackagePosts: (packagePosts: PackageItem[]) => set({ packagePosts }),
				setPackagePostsCurrentPage: (packagePostsCurrentPage: number) => set({ packagePostsCurrentPage }),
				setPackageTotalPosts: (packageTotalPosts: number) => set({ packageTotalPosts }),
				setLoadingPackagePosts: (loadingPackagePosts: boolean) => set({ loadingPackagePosts }),
				resetPackagePosts: () =>
					set({ packagePosts: [], packagePostsCurrentPage: 0, packageTotalPosts: 0, loadingPackagePosts: false }),

				// View Package
				viewPackage: null,
				loadingPackage: false,
				setViewPackage: (viewPackage: PackageItem | null) => set({ viewPackage }),
				setLoadingPackage: (loadingPackage: boolean) => set({ loadingPackage }),
				resetViewPackage: () => set({ viewPackage: null }),

				// Error
				error: null,
				setError: (error: any) => set({ error }),

				// Reset Packages
				resetPackages: () =>
					set({
						// Event Packages
						eventPackages: [],
						loadingEventPackages: false,

						// Package Posts
						packagePosts: [],
						loadingPackagePosts: false,

						// View Package
						viewPackage: null,

						// Error
						error: null,
					}),
			}),
			{
				name: 'meddly-packages',
				storage: cookieStorage,
			},
		),
	),
);

const testsTurnedOn: boolean = TestConfig.stores.packages;
if (testsTurnedOn) {
	usePackagesStore.subscribe((state) => {
		console.log('Packages State:', state);
	});
}
