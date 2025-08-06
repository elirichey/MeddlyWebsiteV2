import type { MeddlyServerLight } from './Server';

export interface Organization {
	id: string;
	name: string;
	avatar?: string;
	website?: string;
	processingServer?: MeddlyServerLight;
	
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
	processingServer?: MeddlyServerLight;
	updated: Date;
}
