import type { PackagePost } from './Post';

export interface PackageItem {
	id: string;
	isDefault: boolean;
	priceAttendees: string;
	priceNonAttendees: string;
	title: string;
	totalImages: number;
	totalVideoDuration: number;
	totalVideos: number;
	type: string;
	event: PackageItemEvent;
	published: boolean;
	packagePosts: Array<PackagePost>;
	created: Date;
	updated: Date;
}

export interface PackageItemEvent {
	id: string;
	orgOwnerId: string;
	title: string;
}

export interface PackagePostPackage {
	id: string;
	type: string;
	title: string;
	totalImages: number;
	totalVideoDuration: number;
	totalVideos: number;
	isDefault: boolean;
	priceAttendees: string;
	priceNonAttendees: string;
	event: PackageItemEvent;
	created: Date;
	updated: Date;
}
