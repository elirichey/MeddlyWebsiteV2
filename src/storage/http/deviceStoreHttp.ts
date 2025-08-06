import { type RoleDevice, useDeviceStore } from '../stores/useDeviceStore';

export interface UserDeviceUpdate {
	name: string;
}

export interface OrgDeviceUpdate {
	orgId: string;
	name: string;
}

export async function updateUserDeviceInfo(data: UserDeviceUpdate) {
	const { setUserDevice } = useDeviceStore.getState();
	setUserDevice(data);
}

export async function updateOrgDeviceInfo(data: OrgDeviceUpdate) {
	const { roleDevices, setRoleDevices } = useDeviceStore.getState();

	const updatedDevices = [...roleDevices];
	const orgInfo = updatedDevices.find((x: RoleDevice) => x.orgId === data.orgId);

	if (orgInfo) {
		const index = updatedDevices.indexOf(orgInfo);
		updatedDevices[index] = data;
	} else {
		updatedDevices.push(data);
	}

	// console.log('updateOrgDeviceInfo', { updatedDevices });
	setRoleDevices(updatedDevices);
}

const DeviceStoreHttp = {
	updateUserDeviceInfo,
	updateOrgDeviceInfo,
};

export default DeviceStoreHttp;
