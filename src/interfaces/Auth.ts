// ********** Auth ********** //

import type { GeneralAdminOrganization, Organization } from './Organization';
import type { AdminUser } from './User';
import type { Venue } from './Venue';

export interface AuthCredentials {
	email: string;
	password: string;
}

export interface NewUserCredentials {
	email: string;
	password: string;
	username: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface UserToken {
	token: string;
}
export interface UserConnectToEventPayload {
	eventConnectedId: string | null;
}

export interface Auth {
	profile: Profile | null;
	currentRole: UserSelectedRole | null;
	connectedEvent: UserConnectedEvent | null;
	tokens: {
		accessToken: string;
		refreshToken: string;
	} | null;
}

// ********** Profile ********** //

export interface Profile {
	id: string;
	email: string;
	username: string;
	phone?: string;
	avatar?: string;
	name?: string | null;
	eventConnected?: UserConnectedEvent;
	userRoles: Array<UserSelectedRole>;
	updated: Date;
	created: Date;
}

export interface ProfilePayload {
	id: string;
	email: string;
	username: string;
	phone?: string;
	avatar?: string;
	name?: string | null;
	eventConnectedId?: string | null;
	successToast?: string;
	errorToast?: string;
}

export interface UserConnectedEvent {
	id: string;
	title: string;
	status: string;
	dateTime: string;
	type: string;
	coverImg?: string;
	venue: Venue;
	orgOwner: Organization;
	managerId?: string;
}

export interface UserSelectedRole {
	id: string;
	role: string;
	name: string;
	position: string | null;
	user?: AdminUser;
	organization: GeneralAdminOrganization;
	created: Date;
	updated: Date;
}
