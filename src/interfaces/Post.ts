import type { MeddlyEventLight } from './Event';
import type { PackagePostPackage } from './Package';
import type { User } from './User';

export interface AdminEventPost {
	id: string;
	src: string;
	m3u8?: string;
	preview?: string;
	dateTime: number;
	nsfw: boolean;
	type: string;
	tags: string[];
	duration?: number;
	tsStart?: string;
	tsEnd?: string;
	fps?: number;
	height?: number;
	width?: number;
	orientation?: string;
	creator: User;
	event: MeddlyEventLight;
	updated: Date;
	created: Date;
}

export interface PackagePost {
	id: string;
	package: PackagePostPackage;
	post: VideoItem | AudioItem;
	updated: Date;
	created: Date;
}

export interface PostItem {
	id: string;
	creator: User;
	event: MeddlyEventLight;
	dateTime: number;
	tags?: string;
	src: string;
	type: string;
	orientation?: string;
	metadata?: string;
	nsfw: boolean;
	updated: Date;
	created: Date;
}

export interface VideoItem extends PostItem {
	m3u8?: string;
	preview?: string;
	duration: number;
	fps: number;
	height: number;
	width: number;
	tsStart: number;
	tsEnd: number;
}

export interface AudioItem extends PostItem {
	duration: number;
	tsStart: number;
	tsEnd: number;
}
