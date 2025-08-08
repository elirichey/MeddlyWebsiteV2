// import Toast from 'react-native-toast-message';
// import { ToastError } from '../../config/toastConfig';
import UserStoreHttp from './userStoreHttp';
import { useUserStore } from '../stores/useUserStore';
import CameraHttp from '../../utilities/http/camera';
import { useEventStore } from '../stores/useEventStore';
import type { MeddlyEvent } from '../../interfaces/Event';
import type { Profile, UserSelectedRole } from '../../interfaces/Auth';
import UserEventsHttp from '../../utilities/http/user/events';
import OrgEventsHttp from '../../utilities/http/admin/events';
import EventManagerHTTP from '../../utilities/http/admin/manage-event';
// import { ToastSuccess } from '../../config/toastConfig';
import { useOrgStore } from '../stores/useOrgStore';
import { timeout } from '../../config/variables';
import delay from '../../utilities/helpers/delay';

export interface ApiResponse {
	status: number;
	data: any;
}

export interface CameraEventsResponse {
	events: MeddlyEvent[];
	totalEvents: number;
	user: Profile;
}

interface OrgCameraEventsPayload {
	orgId: string;
	token: string;
}

interface EventManagerStatusPayload {
	eventId: string;
	payload: any;
	token: string;
}

// Camera Events

export async function getUserCameraEvents(retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	const { setUserRoles, setProfile } = useUserStore.getState();
	const { setCameraEvents, setCameraEventsTotal, setError, setLoadingCameraEvents } = useEventStore.getState();

	const maxRetries = 1;
	const payload = { token: accessToken };

	setError(null);
	setLoadingCameraEvents(true);

	try {
		const response = await CameraHttp.getUserCameraEvents(payload);
		// console.log('getUserCameraEvents: Response', { response });

		if (response.status === 200) {
			const { events, totalEvents, user } = response.data as CameraEventsResponse;
			setCameraEvents(events || []);
			setCameraEventsTotal(totalEvents);
			setProfile(user);
			setUserRoles(user.userRoles);
			setError(null);
			setLoadingCameraEvents(false);
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getUserCameraEvents(retryCount + 1);
			}

			setLoadingCameraEvents(false);
			await UserStoreHttp.tryLogout();
			// Toast.show(ToastError('Error', 'Logging User Out'));
			setError('Authentication failed');
			return;
		}

		setLoadingCameraEvents(false);
		// Toast.show(ToastError('Oops!', 'Failed to get events'));
		// console.log('getUserCameraEvents: Error 1', { response });
		setError('Failed to fetch camera events');
		return;
	} catch (e) {
		setLoadingCameraEvents(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		// console.log('getUserCameraEvents: Error 2', { e });
		setError('An unexpected error occurred');
		return;
	}
}

export async function getOrgCameraEvents(retryCount = 0): Promise<CameraEventsResponse | null> {
	const { tokens } = useUserStore.getState();
	const accessToken = tokens?.accessToken || '';

	const { currentRole, setUserRoles, setProfile, setCurrentRole } = useUserStore.getState();
	const { setCameraEvents, setError, setCameraEventsTotal, setLoadingCameraEvents } = useEventStore.getState();

	const maxRetries = 1;
	const orgId = currentRole?.organization?.id;

	// If no organization ID is available, fall back to user camera events
	if (!orgId) {
		// console.log('getOrgCameraEvents: No orgId available, falling back to getUserCameraEvents');
		return getUserCameraEvents(retryCount);
	}

	const payload: OrgCameraEventsPayload = { orgId, token: accessToken };

	setError(null);
	setLoadingCameraEvents(true);

	try {
		const response = await CameraHttp.getOrgCameraEvents(payload);
		if (response.status === 200) {
			const { events, totalEvents, user } = response.data as CameraEventsResponse;
			setCameraEvents(events || []);
			setCameraEventsTotal(totalEvents);
			setProfile(user);
			setUserRoles(user.userRoles);
			if (currentRole) {
				const useRole = user.userRoles.find((role: UserSelectedRole) => role.id === currentRole.id);
				setCurrentRole(useRole || null);
			} else {
				setCurrentRole(null);
			}

			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgCameraEvents(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to get events'));
		// console.log('getOrgCameraEvents: Error 1', { response });
		setError('Failed to fetch camera events');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		// console.log('getOrgCameraEvents: Error 2', { e });
		setError('An unexpected error occurred');
		return null;
	} finally {
		setLoadingCameraEvents(false);
	}
}

// Org Events
export async function getOrgListEvents(retryCount = 0, encodedStatus?: string): Promise<any | null> {
	const { tokens, currentRole } = useUserStore.getState();
	const {
		setError,
		setLoadingOrgEvents,
		setOrgEvents,
		setOrgEventsTotal,
		setOrgEventsStatuses,
		orgEventsCurrentTab,
		setOrgEventsCurrentTab,
	} = useEventStore.getState();

	const decodedStatus = encodedStatus ? decodeURIComponent(encodedStatus) : undefined;
	const maxRetries = 1;
	const data = {
		orgId: currentRole ? currentRole.organization.id : '',
		token: tokens?.accessToken || '',
		status: decodedStatus,
	};

	setError(null);
	setLoadingOrgEvents(true);

	try {
		const response = await OrgEventsHttp.getOrgEvents(data);
		// console.log('getOrgListEvents: Response', { response });
		if (response.status === 200) {
			const { eventStatuses, events, totalEvents } = response.data;

			const statusIsNotAll = orgEventsCurrentTab !== 'All';
			if (events.length === 0) {
				const allEventsResponse = await OrgEventsHttp.getOrgEvents({
					orgId: currentRole ? currentRole.organization.id : '',
					token: tokens?.accessToken || '',
					status: 'All',
				});
				// console.log('getOrgListEvents: All Events Response', { allEventsResponse });
				if (allEventsResponse.status === 200 && statusIsNotAll) {
					const { events: allEvents } = allEventsResponse.data;
					setOrgEvents(allEvents);
					setOrgEventsTotal(allEvents.length);
					setOrgEventsStatuses(eventStatuses);
					setOrgEventsCurrentTab('All');
					return allEventsResponse.data;
				}
			}

			// console.log('getOrgListEvents: Response', { eventStatuses, events, totalEvents });
			setOrgEvents(events);
			setOrgEventsTotal(totalEvents);
			setOrgEventsStatuses(eventStatuses);

			const decodedStatus = encodedStatus ? decodeURIComponent(encodedStatus) : 'All';
			if (encodedStatus) {
				setOrgEventsCurrentTab(decodedStatus);
			}

			setError(null);
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgListEvents(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to get events'));
		setError('Failed to fetch org events');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setLoadingOrgEvents(false);
	}
}

export async function getViewOrgListEvents(retryCount = 0, encodedStatus?: string): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { viewOrg } = useOrgStore.getState();
	const { setError, setLoadingOrgEvents } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		orgId: viewOrg ? viewOrg.id : '',
		token: tokens?.accessToken || '',
	};

	setError(null);
	setLoadingOrgEvents(true);

	try {
		const response = await UserEventsHttp.userGetOrgEvents(data);
		if (response.status === 200) {
			setError(null);
			setLoadingOrgEvents(false);
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getViewOrgListEvents(retryCount + 1);
			}

			setLoadingOrgEvents(false);
			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		setLoadingOrgEvents(false);
		// Toast.show(ToastError('Oops!', 'Failed to get events'));
		setError('Failed to fetch view org events');
		return null;
	} catch (e) {
		setLoadingOrgEvents(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function getCurrentUserEvent(eventId: string, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingOrgEvents } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		eventId,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setLoadingOrgEvents(true);

	try {
		const response = await UserEventsHttp.getEventAsUser(data);
		if (response.status === 200) {
			setError(null);
			setLoadingOrgEvents(false);
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getCurrentUserEvent(eventId, retryCount + 1);
			}

			setLoadingOrgEvents(false);
			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		setLoadingOrgEvents(false);
		// Toast.show(ToastError('Oops!', 'Failed to get event'));
		setError('Failed to fetch user event');
		return null;
	} catch (e) {
		setLoadingOrgEvents(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		return null;
	}
}

export async function getOrgEvent(eventId: string, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		eventId,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.getOrgEvent(data);
		if (response.status === 200) {
			const event = response.data;
			// console.log('getOrgEvent: Response', { event });
			await delay(timeout.fetch);
			setViewEvent(event);
			setError(null);
			setLoadingViewEvent(false);
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return getOrgEvent(eventId, retryCount + 1);
			}

			setLoadingViewEvent(false);
			await UserStoreHttp.tryLogout();
			return null;
		}

		setLoadingViewEvent(false);
		// Toast.show(ToastError('Oops!', 'Failed to get event'));
		setError('Failed to fetch org event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function createOrgEvent(payload: any, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.createEvent(data);
		if (response.status === 200 || response.status === 201) {
			setError(null);
			setViewEvent(response.data);
			// Toast.show(ToastSuccess('Success', 'Event Created'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return createOrgEvent(payload, retryCount + 1);
			}
		}

		// Toast.show(ToastError('Oops!', 'Failed to create event'));
		setError('Failed to create event');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setLoadingViewEvent(false);
	}
}

export async function updateOrgEvent(event: MeddlyEvent, payload: any, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;

	setError(null);
	setLoadingViewEvent(true);

	try {
		const data = {
			event,
			payload,
			token: tokens?.accessToken || '',
		};

		const response = await OrgEventsHttp.updateEvent(data);
		await delay(timeout.fetch);
		if (response.status === 200 || response.status === 201) {
			await getOrgListEvents();
			setError(null);
			setLoadingViewEvent(false);
			setViewEvent(response.data);
			// Toast.show(ToastSuccess('Success', 'Event Updated'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return updateOrgEvent(event, payload, retryCount + 1);
			}
		}

		setLoadingViewEvent(false);
		// Toast.show(ToastError('Oops!', 'Failed to update event'));
		setError('Failed to update event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function uploadCoverArt(event: any, payload: any, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent, loadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		event,
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	if (!loadingViewEvent) setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.uploadCoverArt(data.event, data.payload, data.token);
		if (response.status === 200 || response.status === 201) {
			setError(null);
			setLoadingViewEvent(false);
			// Toast.show(ToastSuccess('Success', 'Cover Art Updated'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return uploadCoverArt(event, payload, retryCount + 1);
			}
		}

		setLoadingViewEvent(false);
		// Toast.show(ToastError('Oops!', 'Failed to upload cover art'));
		setError('Failed to upload cover art');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function deleteOrgEvent(eventId: string, retryCount = 0, dismiss?: () => void): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = {
		eventId,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.deleteEvent(data);
		if (response.status === 200) {
			setError(null);
			setLoadingViewEvent(false);
			// Toast.show(ToastSuccess('Success', 'Event Deleted'));
			if (dismiss) dismiss();
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return deleteOrgEvent(eventId, retryCount + 1);
			}
		}

		setLoadingViewEvent(false);
		// Toast.show(ToastError('Oops!', 'Failed to delete event'));
		setError('Failed to delete event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function resyncEventAudioSources(eventId: string, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setLoadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { eventId, token: tokens?.accessToken || '' };

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.resyncEventAudioSources(data.eventId, data.token);
		// console.log('resyncEventAudioSources: Response', { response });
		if (response.status === 201) {
			setError(null);
			setLoadingViewEvent(false);
			// Toast.show(ToastSuccess('Success', 'Event Audio Sources Resynced'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return resyncEventAudioSources(eventId, retryCount + 1);
			}

			setLoadingViewEvent(false);
			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		setLoadingViewEvent(false);
		// Toast.show(ToastError('Oops!', 'Failed to resync event audio sources'));
		setError('Failed to resync event audio sources');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	}
}

export async function eventManagerSetupEvent(retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setManagerSetupEvent } = useEventStore.getState();

	const { profile } = useUserStore.getState();
	const eventConnected = profile?.eventConnected;
	const eventId = eventConnected?.id || '';
	const payload = { status: 'Pre-Event' };

	const maxRetries = 1;
	const data: EventManagerStatusPayload = {
		eventId,
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setManagerSetupEvent(true);

	try {
		const response = await EventManagerHTTP.managerUpdateEvent(data);
		if (response.status === 200) {
			setError(null);
			await getOrgCameraEvents();
			// Toast.show(ToastSuccess('Event Setup Ready'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return eventManagerSetupEvent(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to setup event'));
		setError('Failed to setup event');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setManagerSetupEvent(false);
	}
}

export async function eventManagerStartEvent(timestamp: number, retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setManagerStartingEvent } = useEventStore.getState();

	const { profile } = useUserStore.getState();
	const eventConnected = profile?.eventConnected;
	const eventId = eventConnected?.id || '';
	const payload = { status: 'In Progress', timestampStart: timestamp };

	const maxRetries = 1;
	const data: EventManagerStatusPayload = {
		eventId,
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setManagerStartingEvent(true);

	try {
		const response = await EventManagerHTTP.managerUpdateEvent(data);
		if (response.status === 200) {
			setError(null);
			await getOrgCameraEvents();
			// Toast.show(ToastSuccess('Event Started'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return eventManagerStartEvent(timestamp, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to start event'));
		setError('Failed to start event');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setManagerStartingEvent(false);
	}
}

export async function eventManagerCancelEvent(retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setManagerCancelingEvent } = useEventStore.getState();

	const { profile } = useUserStore.getState();
	const eventConnected = profile?.eventConnected;
	const eventId = eventConnected?.id || '';
	const payload = { status: 'Canceled' };

	const maxRetries = 1;
	const data: EventManagerStatusPayload = {
		eventId,
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setManagerCancelingEvent(true);

	try {
		const response = await EventManagerHTTP.managerUpdateEvent(data);
		// console.log('eventManagerCancelEvent: Response', { response });
		if (response.status === 200) {
			setError(null);
			await getOrgCameraEvents();
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return eventManagerCancelEvent(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to end event'));
		setError('Failed to end event');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setManagerCancelingEvent(false);
	}
}

export async function eventManagerEndEvent(retryCount = 0): Promise<any | null> {
	const { tokens } = useUserStore.getState();
	const { setError, setManagerEndingEvent } = useEventStore.getState();

	const { profile } = useUserStore.getState();
	const eventConnected = profile?.eventConnected;
	const eventId = eventConnected?.id || '';
	const payload = { status: 'Completed', timestampEnd: new Date().getTime() };

	const maxRetries = 1;
	const data: EventManagerStatusPayload = {
		eventId,
		payload,
		token: tokens?.accessToken || '',
	};

	setError(null);
	setManagerEndingEvent(true);

	try {
		const response = await EventManagerHTTP.managerUpdateEvent(data);
		if (response.status === 200) {
			setError(null);
			await getOrgCameraEvents();
			// Toast.show(ToastSuccess('Success', 'Event Ended'));
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return eventManagerEndEvent(retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setError('Authentication failed');
			return null;
		}

		// Toast.show(ToastError('Oops!', 'Failed to end event'));
		setError('Failed to end event');
		return null;
	} catch (e) {
		// Toast.show(ToastError('An unexpected error occurred'));
		setError('An unexpected error occurred');
		return null;
	} finally {
		setManagerEndingEvent(false);
	}
}

const EventStoreHttp = {
	getUserCameraEvents,
	getOrgCameraEvents,
	getOrgListEvents,
	getViewOrgListEvents,
	getCurrentUserEvent,
	getOrgEvent,
	createOrgEvent,
	updateOrgEvent,
	uploadCoverArt,
	deleteOrgEvent,
	resyncEventAudioSources,
	eventManagerSetupEvent,
	eventManagerStartEvent,
	eventManagerCancelEvent,
	eventManagerEndEvent,
};

export default EventStoreHttp;
