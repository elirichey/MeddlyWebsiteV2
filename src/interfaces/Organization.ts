export interface Organization {
	id: string;
	name: string;
	avatar?: string;
	website?: string;
}

export interface OrganizationOverview {
	id: string;
	name: string;
	avatar?: string;
	website?: string;
	totalEvents: number;
	upcomingEvents: any[];
	recentEvents: any[];
}

export interface GeneralAdminOrganization {
	id: string;
	name: string;
	avatar?: string;
	website?: string;
	updated: string;
}
