export interface Venue {
	id: string;
	name: string;
	avatar?: string;
	website?: string;
	type: string;
	isOperating: boolean;
	addressStreet1: string;
	addressStreet2?: string;
	addressCity: string;
	addressRegion: string;
	addressCountry: string;
	addressZipCode: string;
	locale: string;
	timezone: string;
	latitude: string;
	longitude: string;
}
