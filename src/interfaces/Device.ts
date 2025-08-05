export interface UserDeviceInfo {
	name: string;
}

export interface OrgDeviceInfo {
	orgId: string;
	name: string;
}

export interface OrgDevices {
	roles: OrgDeviceInfo[];
}

export interface DeviceState {
	user: UserDeviceInfo;
	roles: OrgDeviceInfo[];
}
