export interface UploadPayload {
	uri: string;
	name: string;
	type: string;
	timestampStart?: number;
	timestampEnd?: number;
	duration?: number;
	fps?: number;
	orientation: string;
	height: number;
	width: number;
	deviceName: string | null;
	metadata?: string;
	isPrimary?: boolean;
}

export interface UploadItem {
	id: string;
	eventId: string;
	userId: string;
	payload: UploadPayload;
	status: number;
	progress?: number | string;
	error?: any;
}
