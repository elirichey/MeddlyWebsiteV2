// import { Alert, Platform } from 'react-native';
// import Toast from 'react-native-toast-message';
// import { ToastError, ToastSuccess } from '../../config/toastConfig';
import { timeout } from '../../config/variables';
// import type { CameraUploadPayload } from '../../interfaces/Camera';
// import type { UploadItem, UploadPayload } from '../../interfaces/Upload';
// import FileAction from '../../utilities/helpers/file-actions';
// import CameraHttp from '../../utilities/http/camera';
import { useUploadsStore } from '../stores/useUploadsStore';
import delay from '../../utilities/helpers/delay';
import UserStoreHttp from './userStoreHttp';
import EventPostHTTP from '../../utilities/http/admin/event-posts';
import { useEventStore } from '../stores/useEventStore';

// ******************* Helper Functions ******************* //

async function useClearUploadError(obj: any) {
	const { uploadQueue, setUploadQueue } = useUploadsStore.getState();
	const viewItem = uploadQueue.find((x: any) => {
		return x?.payload?.name === obj?.payload?.name;
	});

	if (!viewItem) return;

	const newItem = {
		id: viewItem?.id,
		eventId: viewItem?.eventId,
		userId: viewItem?.userId,
		payload: viewItem?.payload,
		status: 100,
		error: null,
	};

	// Copy old array, remove old item, add new item
	const newArray: any[] = [];
	await Promise.all(
		[...uploadQueue].map((item: any) => {
			return new Promise((resolve) => {
				if (item.payload.name !== viewItem.payload.name) {
					newArray.push(item);
					resolve(null);
				} else resolve(null);
			});
		}),
	);

	newArray.push(newItem);
	const updatedUploadQueue = Array.from(new Set(newArray));
	setUploadQueue(updatedUploadQueue);
}

async function useUpdateUploadError(obj: any) {
	const { uploadQueue, setUploadQueue } = useUploadsStore.getState();
	const viewItem = uploadQueue.find((x: any) => {
		return x?.payload?.name === obj?.data?.payload?.name;
	});

	if (!viewItem) return;

	const newItem = {
		id: viewItem?.id,
		eventId: viewItem?.eventId,
		userId: viewItem?.userId,
		payload: viewItem?.payload,
		status: 400,
		error: obj.error,
	};

	// Copy old array, remove old item, add new item
	const newArray: any[] = [];
	await Promise.all(
		[...uploadQueue].map((item: any) => {
			return new Promise((resolve) => {
				if (item.payload.name !== viewItem.payload.name) {
					newArray.push(item);
					resolve(null);
				} else resolve(null);
			});
		}),
	);

	newArray.push(newItem);
	const updatedUploadQueue = Array.from(new Set(newArray));
	setUploadQueue(updatedUploadQueue);
}

async function useUpdatePercentUploaded(val: any) {
	const { uploadQueue, uploadProgressArray, setUploadQueue, setUploadProgressArray } = useUploadsStore.getState();
	const { progress, payload } = val;

	// Create a new array with all existing items except the one being updated
	const updatedUploadProgressArray = uploadProgressArray.filter((item: any) => item?.payload?.id !== payload?.id);

	// Only add the new progress if it's not complete
	if (progress !== 100) {
		updatedUploadProgressArray.push(val);
	}

	// Sort the array by timestamp if there are multiple items
	if (updatedUploadProgressArray.length > 1) {
		updatedUploadProgressArray.sort((a: any, b: any) => a.payload.timestampStart - b.payload.timestampStart);
	}

	setUploadProgressArray(updatedUploadProgressArray);

	// If the upload is complete, remove it from the upload queue
	if (progress === 100) {
		const newUploadQueue = uploadQueue.filter((x: any) => x?.payload?.uri !== payload?.uri);
		setUploadQueue(newUploadQueue);
	}
}

// async function formatUploadPayload(value: CameraUploadPayload): Promise<UploadPayload> {
// 	const isAndroid = Platform.OS === 'android';

// 	const { media, deviceName, isPrimary }: CameraUploadPayload = value;
// 	const mediaType = value.type;

// 	const payload: UploadPayload = {
// 		uri: '',
// 		name: '',
// 		type: '',
// 		timestampStart: 0,
// 		timestampEnd: 0,
// 		duration: 0,
// 		fps: 0,
// 		orientation: 'unset',
// 		height: 0,
// 		width: 0,
// 		deviceName,
// 		isPrimary,
// 	};

// 	if (mediaType === 'video') {
// 		const { data, timestamp_start, timestamp_end, duration, orientation, height, width }: any = media;

// 		const name = data.replace(/^.*[\\\/]/, '');
// 		const includesPrefix = data.includes('file://');
// 		const formatURI = isAndroid && includesPrefix ? data.replace('file://', '') : data;

// 		const fileInfo = await FileAction.getVideoMetadata(data);
// 		payload.uri = formatURI;
// 		payload.name = name;
// 		payload.type = 'video/mp4';
// 		payload.timestampStart = timestamp_start;
// 		payload.timestampEnd = timestamp_end;
// 		payload.duration = duration;
// 		payload.fps = 30;
// 		payload.orientation = orientation;
// 		payload.height = Number.parseInt(height, 10);
// 		payload.width = Number.parseInt(width, 10);
// 		if (fileInfo && typeof fileInfo === 'object' && 'metadata' in fileInfo) {
// 			payload.metadata = fileInfo.metadata;
// 		} else {
// 			payload.metadata = '';
// 		}
// 		// } else {
// 		// console.log('Unsupported media type');
// 	}

// 	return payload;
// }

// ******************* Main Functions ******************* //

// export async function uploadEventMedia(data: CameraUploadPayload, retryCount = 0): Promise<void> {
// 	const { profile, tokens } = useUserStore.getState();
// 	const { uploadQueue, setUploadQueue } = useUploadsStore.getState();

// 	const token = tokens?.accessToken;
// 	const { eventId } = data;

// 	if (!eventId) {
// 		Alert.alert('Upload Error', 'Missing Event ID');
// 		return;
// 	}

// 	/*/
//    * NOTE
//    * - Video orientation, height, and width are set in visionCamera
//    * - Image orientation, height, and width are set via FFProbe
//   /*/

// 	const payload = await formatUploadPayload(data);

// 	// Media to queue..
// 	const queueItemId = `${new Date().getTime()}`;
// 	const queueItem: UploadItem = {
// 		id: queueItemId,
// 		eventId,
// 		userId: profile?.id || '',
// 		payload,
// 		status: 100,
// 		error: null,
// 	};

// 	const maxRetries = 1;

// 	// If it's not already part of the uploadQueue array, add it
// 	const uploadIsIncluded = uploadQueue.find((x: UploadItem) => x.payload.uri === payload.uri);

// 	if (!uploadIsIncluded) {
// 		const updatedQueueArray = [...uploadQueue];
// 		updatedQueueArray.push(queueItem);
// 		setUploadQueue(updatedQueueArray);
// 	}

// 	const uploadPayload: {
// 		eventId: string;
// 		payload: UploadPayload;
// 	} = {
// 		eventId,
// 		payload,
// 		token: token || '',
// 	};

// 	// console.log('uploadEventMedia - Upload Payload', { uploadPayload });

// 	try {
// 		const response = await CameraHttp.uploadEventVideo(uploadPayload);
// 		await delay(timeout.fetch);
// 		if (response.status === 200) {
// 			Toast.show(ToastSuccess('Upload Complete'));
// 		} else if (response.message?.includes('403')) {
// 			if (retryCount < maxRetries) {
// 				await UserStoreHttp.refreshUser();
// 				await delay(timeout.auth);
// 				return uploadEventMedia(data, retryCount + 1);
// 			}
// 			await UserStoreHttp.tryLogout();
// 		} else {
// 			Toast.show(ToastError('Error', 'Upload Media'));
// 		}
// 	} catch (error: any) {
// 		// console.log('Caught Upload Error: ', { error });
// 		const isEmptyObject = Object.keys(error).length === 0;
// 		if (isEmptyObject) return;

// 		Toast.show(ToastError('Caught Error', 'Upload Media'));
// 	}
// }

// export async function retryUploadMedia(data: any, retryCount = 0): Promise<void> {
// 	const { tokens } = useUserStore.getState();

// 	const token = tokens?.accessToken;
// 	const eventId: string | null = data?.eventId || null;
// 	// console.log('retryUploadMedia', { data, eventId });

// 	if (!eventId) {
// 		// console.log('retryUploadMedia - Missing Event ID');
// 		Alert.alert('Upload Error', 'Missing Event ID');
// 		return;
// 	}

// 	// Clear upload error
// 	await useClearUploadError(data);

// 	/*/
//      * NOTE
//      * - Video orientation, height, and width are set in visionCamera
//      * - Image orientation, height, and width are set via FFProbe
//     /*/

// 	const maxRetries = 1;
// 	const payload = data?.payload;

// 	const uploadPayload: {
// 		eventId: string;
// 		payload: UploadPayload;
// 	} = { eventId, payload };

// 	// console.log('retryUploadMedia - Upload Payload', { uploadPayload });

// 	try {
// 		const response = await CameraHttp.uploadEventVideo(uploadPayload);
// 		await delay(timeout.fetch);
// 		if (response.status === 200) {
// 			// console.log('retryUploadMedia - Upload Complete');
// 			Toast.show(ToastSuccess('Upload Complete'));
// 		} else if (response.message?.includes('403')) {
// 			if (retryCount < maxRetries) {
// 				await UserStoreHttp.refreshUser();
// 				await delay(timeout.auth);
// 				return retryUploadMedia(data, retryCount + 1);
// 			}

// 			await UserStoreHttp.tryLogout();
// 		} else {
// 			Toast.show(ToastError('Error', 'Retry Upload Media'));
// 		}
// 	} catch (error) {
// 		// console.log('Caught Retry Upload Error: ', { error });
// 		Toast.show(ToastError('Caught Error', 'Retry Upload Media'));
// 	}
// }

// ******************* Package Upload Functions ******************* //

// export async function uploadPackageMedia(data: CameraUploadPayload, retryCount = 0): Promise<void> {
// 	const { profile, tokens } = useUserStore.getState();
// 	const { packageUploadQueue, setPackageUploadQueue } = useUploadsStore.getState();

// 	const token = tokens?.accessToken;
// 	const eventId = profile?.eventConnected?.id;

// 	if (!eventId) {
// 		console.log('uploadPackageMedia - Missing Event ID');
// 		// Alert.alert('Upload Error', 'Missing Event ID');
// 		return;
// 	}

// 	const payload = await formatUploadPayload(data);

// 	// Media to queue..
// 	const queueItemId = `${new Date().getTime()}`;
// 	const queueItem: UploadItem = {
// 		id: queueItemId,
// 		eventId,
// 		userId: profile?.id || '',
// 		payload,
// 		status: 100,
// 		error: null,
// 	};

// 	const maxRetries = 1;

// 	// If it's not already part of the packageUploadQueue array, add it
// 	const uploadIsIncluded = packageUploadQueue.find((x: UploadItem) => x.payload.uri === payload.uri);

// 	if (!uploadIsIncluded) {
// 		const updatedQueueArray = [...packageUploadQueue];
// 		updatedQueueArray.push(queueItem);
// 		setPackageUploadQueue(updatedQueueArray);
// 	}

// 	const uploadPayload: {
// 		eventId: string;
// 		payload: UploadPayload;
// 	} = {
// 		eventId,
// 		payload,
// 		token: token || '',
// 	};

// 	try {
// 		const response = await CameraHttp.uploadEventVideo(uploadPayload);
// 		await delay(timeout.fetch);
// 		if (response.status === 200) {
// 			// Toast.show(ToastSuccess('Package Upload Complete'));
// 		} else if (response.message?.includes('403')) {
// 			if (retryCount < maxRetries) {
// 				// Note: refreshUser and trySignOut would need to be implemented in userStoreHttp
// 				// Toast.show(ToastError('Error', 'Session expired. Please log in again.'));
// 			} else {
// 				// Toast.show(ToastError('Error', 'Logging User Out'));
// 			}
// 		} else {
// 			// Toast.show(ToastError('Error', 'Package Upload Media'));
// 		}
// 	} catch (error: any) {
// 		// console.log('Caught Package Upload Error: ', { error });
// 		const isEmptyObject = Object.keys(error).length === 0;
// 		if (isEmptyObject) return;

// 		// Toast.show(ToastError('Caught Error', 'Package Upload Media'));
// 	}
// }

export async function generateAudioFileForPost(retryCount = 0): Promise<void> {
	const { viewEvent } = useEventStore.getState();

	const postId = viewEvent?.managerVideo?.id;

	// console.log({ tokens, accessToken: tokens?.accessToken });

	if (!postId) {
		// console.log('generateAudioFileForPost - Missing Post ID');
		// Alert.alert('Upload Error', 'Missing Post ID');
		return;
	}

	const maxRetries = 1;

	try {
		const response = await EventPostHTTP.generateAudioFileForPost({ postId });
		// console.log('generateAudioFileForPost - Response', { response });
		await delay(timeout.xlong);
		if (response.status === 200) {
			// console.log('generateAudioFileForPost - Generate Audio File For Post Complete');
			// Toast.show(ToastSuccess('Fix Event Media', 'Request Sent'));
		} else if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return generateAudioFileForPost(retryCount + 1);
			}
			await UserStoreHttp.tryLogout();
		} else {
			// Toast.show(ToastError('Error', 'Generate Audio File For Post'));
		}
	} catch (error) {
		// console.log('Caught Generate Audio File For Post Error: ', { error });
		// Toast.show(ToastError('Caught Error', 'Generate Audio File For Post'));
	}
}

// ******************* Export Object ******************* //

const UploadStoreHttp = {
	// uploadEventMedia,
	// retryUploadMedia,
	// uploadPackageMedia,
	generateAudioFileForPost,
};

export default UploadStoreHttp;
