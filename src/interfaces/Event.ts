import type { Organization } from './Organization';
import type { AudioItem, VideoItem } from './Post';
import type { Venue } from './Venue';

export interface CameraUpdateEventPayload {
	status: string;
	timestampStart?: number;
	timestampEnd?: number;
}

export interface MeddlyEvent {
	id: string;
	title: string;
	status: string;
	dateTime: number;
	type: string;
	coverImg?: string;
	venue: Venue;
	venueId?: string;
	orgOwner: Organization;
	orgOwnerId?: string;
	manager: EventManager;
	managerId?: string;
	timestampStart?: number | null;
	timestampEnd?: number | null;
	managerAudio?: AudioItem;
	managerAudioId?: string;
	managerVideo?: VideoItem;
	managerVideoId?: string;
	primaryAudio?: AudioItem;
	primaryAudioId?: string;
	primaryVideo?: VideoItem;
	primaryVideoId?: string;
	totalVideoDuration?: number;
	updated: Date;
	created: Date;
}

export interface MeddlyEventOnCreate extends MeddlyEvent {
	date: string;
	time: string;
}

export interface EventManager {
	id: string;
	name?: string;
	username: string;
	avatar?: string;
}

export interface MeddlyEventLight {
	id: string;
	title: string;
	status: string;
	dateTime: number;
	type: string;
	coverImg?: string;
	orgOwner: Organization;
	orgOwnerId?: string;
}
