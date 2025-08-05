export interface Sequence {
	id: string;
	eventId: string;
	event: {
		id: string;
		title: string;
		type: string;
		coverImg: string;
		orgOwner: {
			id: string;
			name: string;
			avatar?: string;
		};
		venue: {
			id: string;
			name: string;
			avatar?: string;
			addressStreet1?: string;
			addressStreet2?: string;
			addressCity?: string;
			addressRegion?: string;
			addressCountry?: string;
			addressZipCode?: string;
		};
	};
	packageId: string;
	src: string;
	m3u8: string;
	preview: string;
	gif: string;
	duration: number;
	width: number;
	height: number;
	orientation: string;
	nsfw: boolean;
	created: Date;
	updated: Date;
}

export interface SequenceLight {
	id: string;
	eventId: string;
	event: {
		id: string;
		title: string;
		type: string;
		coverImg: string;
		orgOwner: {
			id: string;
			name: string;
			avatar?: string;
		};
		venue: {
			id: string;
			name: string;
			avatar?: string;
			addressStreet1?: string;
			addressStreet2?: string;
			addressCity?: string;
			addressRegion?: string;
			addressCountry?: string;
			addressZipCode?: string;
		};
	};
	packageId: string;
	preview: string;
	gif: string;
	duration: number;
	width: number;
	height: number;
	orientation: string;
	nsfw: boolean;
	created: Date;
	updated: Date;
}
