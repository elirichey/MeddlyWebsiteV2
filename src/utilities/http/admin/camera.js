import axios from 'axios';
import { Platform } from 'react-native';
import Upload from 'react-native-background-upload';
import API_URL from '../_url';

const getCameraEvents = async (token, currentRole) => {
	const roleIsSet = typeof currentRole === 'object' && currentRole !== null;

	let route;
	if (roleIsSet) {
		const orgId = currentRole.organization.id;
		route = `camera/events/${orgId}`;
	} else {
		route = 'camera/events';
	}

	return await axios({
		url: `${API_URL}/${route}`,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const uploadMedia = async (eventId, payload, token, setPercentUploaded) => {
	const controller = new AbortController();
	const { uri, fps, duration, orientation, height, width } = payload;

	// https://github.com/Vydia/react-native-background-upload/issues/291
	// - post/multipart upload is done by loading data into memory
	//   big files cause memory crashes
	// - use put/multipart upload so it is handled by file system instead

	/*/ NOTE:
    *  - metadata parameters that are numbers must be passed
    *    as a string due to background-uploader
  /*/

	const metadata = {
		fps: fps ? fps : null,
		duration: duration ? duration : null,
		orientation: orientation ? orientation : null,
		height: height ? height : null,
		width: width ? width : null,
	};

	const options = {
		url: `${API_URL}/event/${eventId}/upload`,
		path: uri,
		method: 'PUT',
		field: 'file', // this must match FileInterceptor api value in uploader.controller.ts
		type: 'multipart',
		parameters: { metadata: JSON.stringify(metadata) },
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		notification: {
			enabled: true,
			autoClear: true,
		},
	};

	return await Upload.startUpload(options)
		.then((uploadId) => {
			Upload.addListener('progress', uploadId, (res) => {
				const isIos = Platform.OS === 'ios';
				if (isIos) res.progress = Math.round(res.progress);
				setPercentUploaded({ payload, progress: res.progress });
			});
			Upload.addListener('error', uploadId, (res) => {
				controller.abort();
				return res;
			});
			Upload.addListener('cancelled', uploadId, (res) => res);
			Upload.addListener('completed', uploadId, (res) => res);
		})
		.catch((err) => err);
};

const CameraHTTP = {
	getCameraEvents,
	uploadMedia,
};

export default CameraHTTP;
