// import Toast from 'react-native-toast-message';
// import { ToastError, ToastSuccess } from '../../config/toastConfig';
import EventSequenceHTTP, { type CreateSequence } from '../../utilities/http/admin/event-sequences';
import UserEventSequencesHttp from '../../utilities/http/user/event-sequences';
import { timeout } from '../../config/variables';
import { useSequencesStore } from '../stores/useSequencesStore';
import { useUserStore } from '../stores/useUserStore';
import UserStoreHttp from './userStoreHttp';
import delay from '../../utilities/helpers/delay';

export interface ApiResponse {
	status: number;
	data?: any;
	message?: string;
}

export async function getEventSequencesAsUser(eventId: string, retryCount = 0) {
	const { setUserEventSequences, setLoadingUserEventSequences, setError } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingUserEventSequences(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		token: accessToken,
	};

	try {
		const response: ApiResponse = await UserEventSequencesHttp.getEventSequencesAsUser(data);
		// console.log('getEventSequencesAsUser: Response', response);
		await delay(timeout.fetch);
		if (response.status === 200) {
			setUserEventSequences(response.data);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getEventSequencesAsUser(eventId, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get event sequences';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingUserEventSequences(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getOrgEventSequences(eventId: string, retryCount = 0) {
	const { setOrgEventSequences, setLoadingOrgEventSequences, setError } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingOrgEventSequences(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		eventId,
		token: accessToken,
	};

	try {
		const response: ApiResponse = await EventSequenceHTTP.orgGetEventSequences(data);
		if (response.status === 200) {
			setOrgEventSequences(response.data);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgEventSequences(eventId, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get event sequence';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingOrgEventSequences(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function getEventSequence(sequenceId: string, trigger?: () => void, retryCount = 0) {
	const { setCurrentSequence, setLoadingCurrentSequence, setError } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	setLoadingCurrentSequence(true);
	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data = {
		sequenceId,
		token: accessToken,
	};

	try {
		const response: ApiResponse = await EventSequenceHTTP.getEventSequence(data);
		await delay(timeout.fetch);
		if (response.status === 200) {
			setCurrentSequence(response.data);
			if (trigger) await trigger();
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getEventSequence(sequenceId, trigger, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to get event sequence';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		setLoadingCurrentSequence(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export class SequenceOptions {
	orientation?: 'landscape' | 'portrait';
	segmentLength?: 'short' | 'medium' | 'long';
	customStartTime?: number;
	customEndTime?: number;
}

export async function createEventSequence(
	payload: { eventId: string; packageId: string; sequenceOptions: SequenceOptions },
	retryCount = 0,
) {
	const { setError } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const data: CreateSequence = { payload, token: accessToken };

	try {
		const response: ApiResponse = await EventSequenceHTTP.createEventSequence(data);
		if (response.status === 201) {
			await getOrgEventSequences(payload.eventId);
			// Toast.show(ToastSuccess('Success', 'Sequence Generation Request Sent'));
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return createEventSequence(payload, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to create sequence';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function updateEventSequence(sequenceId: string, payload: any, retryCount = 0) {
	const { setError } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	const formattedPayload = {
		price: {
			attendee: payload.price.attendee,
			nonAttendee: payload.price.nonAttendee,
		},
	};

	const data = {
		sequenceId,
		payload: formattedPayload,
		token: accessToken,
	};

	try {
		const response: ApiResponse = await EventSequenceHTTP.updateEventSequence(data);
		await delay(timeout.fetch);
		if (response.status === 200) {
			await getOrgEventSequences(sequenceId);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateEventSequence(sequenceId, payload, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to update sequence';
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
	} finally {
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		}
	}
}

export async function deleteEventSequence(
	eventId: string,
	sequenceId: string,
	dismiss?: () => Promise<void>,
	retryCount = 0,
) {
	const { setError, loadingEventSequences, setLoadingEventSequences } = useSequencesStore.getState();
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	if (retryCount === 0) setError(null);

	let errorMsg = '';
	const maxRetries = 1;

	if (!loadingEventSequences) {
		setLoadingEventSequences(true);
	}

	const data = {
		eventId,
		sequenceId,
		dismiss,
		token: accessToken,
	};

	try {
		const response: ApiResponse = await EventSequenceHTTP.deleteEventSequence(data);
		// console.log('deleteEventSequence: Response', response);
		await delay(timeout.fetch);
		if (response.status === 201) {
			if (dismiss) await dismiss();
			await getOrgEventSequences(eventId);
			return response.data;
		}
		if (response.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return deleteEventSequence(eventId, sequenceId, dismiss, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
		} else {
			setError(response);
			errorMsg = 'Failed to delete sequence';
			// console.log('deleteEventSequence: Response', { response });
		}
	} catch (e) {
		setError(e);
		errorMsg = 'An unexpected error occurred';
		// console.log('deleteEventSequence: Error', e);
	} finally {
		setLoadingEventSequences(false);
		if (errorMsg) {
			// Toast.show(ToastError('Oops!', errorMsg));
		} else {
			// Toast.show(ToastSuccess('Sequence Deleted'));
		}
	}
}

const SequencesStoreHttp = {
	getEventSequencesAsUser,
	getOrgEventSequences,
	getEventSequence,
	createEventSequence,
	updateEventSequence,
	deleteEventSequence,
};

export default SequencesStoreHttp;
