import axios from 'axios';
// import FileAction from '../helpers/file-actions';
import API from './_url';
import { useUploadsStore } from '../../storage/stores/useUploadsStore';
import type { UploadPayload } from '../../interfaces/Upload';
import cookieStorage from '@/storage/cookies';

export interface OrgEventsData {
	orgId: string;
	page?: number;
	status?: string;
}

export interface UserEventsData {
	page?: number;
}

async function getUserCameraEvents(data: UserEventsData): Promise<any> {
	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const route = `${API.url}/camera/events`;

	return axios({
		url: route,
		method: 'GET',
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
	})
		.then((res) => res)
		.catch((error) => error);
}

async function getOrgCameraEvents(data: OrgEventsData): Promise<any> {
	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const { orgId } = data;
	let route = 'camera/events';
	if (orgId) route = `${route}/${orgId}`;

	return axios({
		url: `${API.url}/${route}`,
		method: 'GET',
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
	})
		.then((res) => res)
		.catch((error) => error);
}

// async function uploadEventVideo(data: {
// 	eventId: string;
// 	payload: UploadPayload;
// }): Promise<any> {
// 	const { eventId, payload } = data;

// 	const controller = new AbortController();
// 	const { uri, fps, duration, orientation, height, width, metadata, deviceName, isPrimary } = payload;

// 	// https://github.com/Vydia/react-native-background-upload/issues/291
// 	// - post/multipart upload is done by loading data into memory
// 	//   big files cause memory crashes
// 	// - use put/multipart upload so it is handled by file system instead

// 	/*/ NOTE:
//      *  - metadata parameters that are numbers must be passed
//      *    as a string due to background-uploader
//   	/*/

// 	const metaPayload = {
// 		fps: fps ? fps : null,
// 		duration: duration ? duration : null,
// 		orientation: orientation ? orientation : null,
// 		height: height ? height : null,
// 		width: width ? width : null,
// 		metadata: metadata ? metadata : null,
// 		deviceName: deviceName ? deviceName : null,
// 		isPrimary: isPrimary ? isPrimary : false,
// 	};

// 	const metadataString: string = JSON.stringify(metaPayload);

// 	const options: UploadOptions = {
// 		url: `${API.url}/event/${eventId}/upload`,
// 		path: uri,
// 		method: 'PUT',
// 		field: 'file', // this must match FileInterceptor api value in uploader.controller.ts
// 		type: 'multipart',
// 		parameters: {
// 			metadata: metadataString,
// 		},
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 			Accept: 'application/json',
// 			'content-type': 'multipart/form-data',
// 		},
// 		notification: {
// 			enabled: true,
// 			autoClear: true,
// 			onProgressTitle: 'Uploading',
// 			onProgressMessage: 'Please wait...',
// 			onCompleteTitle: 'Upload Complete',
// 			onCompleteMessage: 'Your file has been uploaded',
// 			onErrorTitle: 'Upload Error',
// 			onErrorMessage: 'There was an error uploading your file',
// 		},
// 	};

// 	return Upload.startUpload(options)
// 		.then((uploadId: string) => {
// 			Upload.addListener('progress', uploadId, (res: ProgressData) => {
// 				console.log('BackgroundUpload: Progress', { res });
// 				const isIos = Platform.OS === 'ios';
// 				if (isIos) res.progress = Math.round(res.progress);
// 				useUpdatePackagePercentUploaded({ payload, progress: res.progress });
// 			});
// 			Upload.addListener('error', uploadId, (res: ErrorData) => {
// 				// console.log('BackgroundUpload: Error', { error: res });
// 				// if (setOnError) setOnError({ data, error: res.error });
// 				console.log('BackgroundUpload: Error', { error: res });
// 				useUpdatePackageUploadError({ data, error: res.error });
// 				controller.abort();
// 				return res;
// 			});
// 			Upload.addListener('cancelled', uploadId, (res: EventData) => {
// 				// console.log('BackgroundUpload: Cancelled', { error: res });
// 				// if (setOnError) setOnError({ data, error: 'Cancelled' });
// 				console.log('BackgroundUpload: Cancelled', { error: res });
// 				useUpdatePackageUploadError({ data, error: 'Cancelled' });
// 				controller.abort();
// 				return res;
// 			});
// 			Upload.addListener('completed', uploadId, async (res: CompletedData) => {
// 				await FileAction.deleteFile(payload.uri);
// 				return res;
// 			});
// 		})
// 		.catch((error: any) => {
// 			// console.log('BackgroundUpload: Caught Error', { error: error });
// 			// if (setOnError) setOnError({ data, error: JSON.stringify(error) });
// 			console.log('BackgroundUpload: Caught Error', { error: error });
// 			useUpdatePackageUploadError({ data, error: JSON.stringify(error) });
// 			return error;
// 		});
// }

async function useUpdatePackagePercentUploaded(val: any): Promise<void> {
	const { packageUploadQueue, packageUploadProgressArray, setUploadQueue, setUploadProgressArray } =
		useUploadsStore.getState();
	const { progress, payload } = val;

	console.log('useUpdatePackagePercentUploaded', { val, packageUploadQueue, packageUploadProgressArray });

	// Create a new array with all existing items except the one being updated
	const updatedPackageUploadProgressArray = packageUploadProgressArray.filter(
		(item: any) => item?.payload?.id !== payload?.id,
	);

	// Only add the new progress if it's not complete
	if (progress !== 100) {
		updatedPackageUploadProgressArray.push(val);
	}

	// Sort the array by timestamp if there are multiple items
	if (updatedPackageUploadProgressArray.length > 1) {
		updatedPackageUploadProgressArray.sort((a: any, b: any) => a.payload.timestampStart - b.payload.timestampStart);
	}

	setUploadProgressArray(updatedPackageUploadProgressArray);

	// If the upload is complete, remove it from the upload queue
	if (progress === 100) {
		const newPackageUploadQueue = packageUploadQueue.filter((x: any) => x?.payload?.uri !== payload?.uri);
		setUploadQueue(newPackageUploadQueue);
	}
}

async function useUpdatePackageUploadError(val: {
	error: string;
	data: {
		eventId: string;
		payload: UploadPayload;
	};
}): Promise<void> {
	const { packageUploadQueue, setPackageUploadQueue } = useUploadsStore.getState();
	const { error, data } = val;

	const newPackageUploadQueue = packageUploadQueue.filter((x: any) => x?.payload?.uri !== data?.payload?.uri);
	setPackageUploadQueue(newPackageUploadQueue);
}

const CameraHttp = {
	getUserCameraEvents,
	getOrgCameraEvents,
	// uploadEventVideo,
};

export default CameraHttp;
