import type { UserRole } from './UserRoles';

export interface User {
	id: string;
	username: string;
	name?: string;
	avatar?: string;
}

export interface AdminUser {
	id: string;
	name?: string;
	username: string;
	avatar?: string;
	email?: string;
	phone?: string;
}

export interface FullUser {
	id: string;
	avatar?: string;
	cloudServices: Array<any>;
	email: string;
	eventConnected?: any;
	name: string;
	phone?: string;
	type: string;
	username: string;
	userRoles: Array<UserRole>;
	created: Date;
	updated: Date;
}
