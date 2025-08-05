import type { GeneralAdminOrganization } from './Organization';

export interface UserRole {
	id: string;
	name: string;
	role: string;
	position: string;
	notes: string;
	user: UserRoleUser;
	organization: GeneralAdminOrganization;
	created: Date;
	updated: Date;
}

export interface UsersOrgRole {
	id: string;
	name: string;
	role: string;
	position: string;
	organization: GeneralAdminOrganization;
	created: Date;
	updated: Date;
}

export interface UserRoleUser {
	id: string;
	name: string;
	username: string;
	phone: string;
	email: string;
	avatar: string;
}
