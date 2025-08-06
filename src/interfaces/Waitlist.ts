export interface WaitListItem {
	id: string;
	name: string;
	website?: string;
	userId?: string;
	status: string;
	contactName?: string;
	contactPhone?: string;
	contactEmail: string;
	isRepresentative: boolean;
	noShowsPerMonth?: number;
	recordsEveryShow: boolean;
	playsCovers: boolean;
	created: Date;
	updated: Date;
}
