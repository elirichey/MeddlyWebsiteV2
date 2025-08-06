import axios from 'axios';
import API from '../_url';

async function getOrgData(data: { id: string; token: string }): Promise<any> {
	const { id, token } = data;
	return await axios.get(`${API.url}/org/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

async function updateOrg(payload: any): Promise<any | any> {
	const { id, data, token } = payload;

	const initialPayload = { ...data };
	if (initialPayload.avatar) {
		delete initialPayload.avatar;
	}

	const isEmptyObject = Object.entries(initialPayload).length === 0;
	if (isEmptyObject && data.avatar) {
		// Upload Avatar Only
		try {
			const final = await uploadOrganizationalAvatar(id, data.avatar, token);
			if (final.status === 201) return final;
			return final;
		} catch (e) {
			return e;
		}
	} else {
		// Update Org Data
		try {
			const res = await axios.put(`${API.url}/org/${id}`, initialPayload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.status === 200 || res.status === 201) {
				if (data.avatar) {
					try {
						const final = await uploadOrganizationalAvatar(id, data.avatar, token);
						if (final.status === 200 || final.status === 201) return final;
						return res;
					} catch (e) {
						return e;
					}
				}
				return res;
			}
			return res;
		} catch (error) {
			return error;
		}
	}
}

async function uploadOrganizationalAvatar(id: string, avatar: string, token: string): Promise<any> {
	const ts = new Date().getTime();
	const file: any = {
		uri: avatar,
		name: `${id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	try {
		const response = await axios({
			url: `${API.url}/org/${id}/avatar`,
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'content-type': 'multipart/form-data' },
			data: formData,
			onUploadProgress: ({ total, loaded }) => {
				const totalVal = total ? total : 1;
				const progress = (loaded / totalVal) * 100;
				const percentage = Math.round(progress);
				return percentage;
			},
		});
		return response;
	} catch (error) {
		throw new Error('Avatar upload failed');
	}
}

async function uploadVideo(data: {
	eventId: string;
	payload: any;
	token: string;
	setPercentUploaded?: (val: any) => void;
	setOnError?: (val: any) => void;
}): Promise<any> {
	const { eventId, payload, token, setPercentUploaded, setOnError } = data;

	const controller = new AbortController();
	const { uri, fps, duration, orientation, height, width, metadata, deviceName, isPrimary } = payload;

	// https://github.com/Vydia/react-native-background-upload/issues/291
	// - post/multipart upload is done by loading data into memory
	//   big files cause memory crashes
	// - use put/multipart upload so it is handled by file system instead

	/*/ NOTE:
    *  - metadata parameters that are numbers must be passed
    *    as a string due to background-uploader
  /*/

	const metaPayload = {
		fps: fps ? fps : null,
		duration: duration ? duration : null,
		orientation: orientation ? orientation : null,
		height: height ? height : null,
		width: width ? width : null,
		metadata: metadata ? metadata : null,
		deviceName: deviceName ? deviceName : null,
		isPrimary: isPrimary ? isPrimary : false,
	};

	const metadataString: string = JSON.stringify(metaPayload);
}

const OrganizationHttp = {
	getOrgData,
	updateOrg,
	uploadVideo,
	uploadOrganizationalAvatar,
};

export default OrganizationHttp;
