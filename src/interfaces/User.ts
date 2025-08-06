export interface User {
	id: string;
	username: string;
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
