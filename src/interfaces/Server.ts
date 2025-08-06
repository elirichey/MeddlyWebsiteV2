export interface MeddlyServer {
	id: string;

	// Server Info
	serverId: number;
	serverName: string;
	bootDuration: number;

	ipAddress?: string;
	domain?: string;
	subdomain?: string;
	status?: string;
	type?: string; // 'Live' | 'Processing' | 'Syncing' | 'Sequencing'
	snapshotId?: string;

	memory?: number;
	vcpus?: number;
	disk?: number;
	dropletCreatedAt?: string;
	image?: string;
	size?: string;
	region?: string;

	orgOwnerId: string;

	// Time Markers
	tsStart?: number;
	tsEnd?: number;
	timeDuration?: number;
	cost?: string;

	// Timestamps
	created?: Date;
	updated?: Date;
}

export interface MeddlyServerLight {
	id: string;

	// Server Info
	serverId: number;
	serverName: string;

	domain?: string;
	status?: string;
	type?: string; // 'Live' | 'Processing' | 'Syncing' | 'Sequencing'

	orgOwnerId: string;
}
