export interface SocketSession {
	id: string;
	sessionId: string;
	eventId: string;
	userId: string;
	isRecording: boolean;
	isActive: boolean;
}

export interface SocketState {
	session: SocketSession | null;
	error: any | null;
}
