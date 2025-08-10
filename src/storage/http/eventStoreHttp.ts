import UserStoreHttp from './userStoreHttp';
import { useEventStore } from '../stores/useEventStore';
import type { MeddlyEvent } from '../../interfaces/Event';
import type { Profile } from '../../interfaces/Auth';
import UserEventsHttp from '../../utilities/http/user/events';
import OrgEventsHttp from '../../utilities/http/admin/events';
import { useOrgStore } from '../stores/useOrgStore';
import { timeout } from '../../config/variables';
import delay from '../../utilities/helpers/delay';
import { useSnackbarStore } from '../stores/useSnackbarStore';
import { getCookieValue } from '../cookies';

export interface ApiResponse {
	status: number;
	data: any;
}

export interface CameraEventsResponse {
	events: MeddlyEvent[];
	totalEvents: number;
	user: Profile;
}

// Org Events
export async function getOrgListEvents(retryCount = 0, encodedStatus?: string): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const {
		setError,
		setLoadingOrgEvents,
		setOrgEvents,
		setOrgEventsTotal,
		setOrgEventsStatuses,
		orgEventsCurrentTab,
		setOrgEventsCurrentTab,
	} = useEventStore.getState();

	const currentRoleCookie = getCookieValue('currentRole');
	const currentRole = currentRoleCookie ? JSON.parse(currentRoleCookie) : null;

	const decodedStatus = encodedStatus ? decodeURIComponent(encodedStatus) : undefined;
	const maxRetries = 1;
	const data = {
		orgId: currentRole ? currentRole.organization.id : '',
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

		setSnackbar({
			title: 'Oops!',
			description: 'Failed to get events',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to fetch org events');
		return null;
	} catch (e) {
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	} finally {
		setLoadingOrgEvents(false);
	}
}

export async function getViewOrgListEvents(retryCount = 0, encodedStatus?: string): Promise<any | null> {
	const { viewOrg } = useOrgStore.getState();
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingOrgEvents } = useEventStore.getState();

	const maxRetries = 1;
	const data = { orgId: viewOrg ? viewOrg.id : '' };

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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to get events',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to fetch view org events');
		return null;
	} catch (e) {
		setLoadingOrgEvents(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

export async function getCurrentUserEvent(eventId: string, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingOrgEvents } = useEventStore.getState();

	const maxRetries = 1;
	const data = { eventId };

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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to get event',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to fetch user event');
		return null;
	} catch (e) {
		setLoadingOrgEvents(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		return null;
	}
}

export async function getOrgEvent(eventId: string, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { eventId };

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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to get event',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to fetch org event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

export async function createOrgEvent(payload: any, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { payload };

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.createEvent(data);
		if (response.status === 200 || response.status === 201) {
			setError(null);
			setViewEvent(response.data);
			setSnackbar({
				title: 'Success',
				description: 'Event Created',
				type: 'success',
				duration: 3000,
				show: true,
			});
			return response.data;
		}

		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return createOrgEvent(payload, retryCount + 1);
			}
		}

		setSnackbar({
			title: 'Oops!',
			description: 'Failed to create event',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to create event');
		return null;
	} catch (e) {
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	} finally {
		setLoadingViewEvent(false);
	}
}

export async function updateOrgEvent(event: MeddlyEvent, payload: any, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent, setViewEvent } = useEventStore.getState();

	const maxRetries = 1;

	setError(null);
	setLoadingViewEvent(true);

	try {
		const data = { event, payload };

		const response = await OrgEventsHttp.updateEvent(data);
		await delay(timeout.fetch);
		if (response.status === 200 || response.status === 201) {
			await getOrgListEvents();
			setError(null);
			setLoadingViewEvent(false);
			setViewEvent(response.data);
			setSnackbar({
				title: 'Success',
				description: 'Event Updated',
				type: 'success',
				duration: 3000,
				show: true,
			});
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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to update event',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to update event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

export async function uploadCoverArt(event: any, payload: any, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent, loadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { event, payload };

	setError(null);
	if (!loadingViewEvent) setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.uploadCoverArt(data.event, data.payload);
		if (response.status === 200 || response.status === 201) {
			setError(null);
			setLoadingViewEvent(false);
			setSnackbar({
				title: 'Success',
				description: 'Cover Art Updated',
				type: 'success',
				duration: 3000,
				show: true,
			});
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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to upload cover art',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to upload cover art');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

export async function deleteOrgEvent(eventId: string, retryCount = 0, dismiss?: () => void): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { eventId };

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.deleteEvent(data);
		if (response.status === 200) {
			setError(null);
			setLoadingViewEvent(false);
			setSnackbar({
				title: 'Success',
				description: 'Event Deleted',
				type: 'success',
				duration: 3000,
				show: true,
			});
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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to delete event',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to delete event');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

export async function resyncEventAudioSources(eventId: string, retryCount = 0): Promise<any | null> {
	const { setSnackbar } = useSnackbarStore.getState();
	const { setError, setLoadingViewEvent } = useEventStore.getState();

	const maxRetries = 1;
	const data = { eventId };

	setError(null);
	setLoadingViewEvent(true);

	try {
		const response = await OrgEventsHttp.resyncEventAudioSources(data.eventId);
		// console.log('resyncEventAudioSources: Response', { response });
		if (response.status === 201) {
			setError(null);
			setLoadingViewEvent(false);
			setSnackbar({
				title: 'Success',
				description: 'Event Audio Sources Resynced',
				type: 'success',
				duration: 3000,
				show: true,
			});
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
		setSnackbar({
			title: 'Oops!',
			description: 'Failed to resync event audio sources',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('Failed to resync event audio sources');
		return null;
	} catch (e) {
		setLoadingViewEvent(false);
		setSnackbar({
			title: 'An unexpected error occurred',
			description: '',
			type: 'error',
			duration: 3000,
			show: true,
		});
		setError('An unexpected error occurred');
		return null;
	}
}

const EventStoreHttp = {
	getOrgListEvents,
	getViewOrgListEvents,
	getCurrentUserEvent,
	getOrgEvent,
	createOrgEvent,
	updateOrgEvent,
	uploadCoverArt,
	deleteOrgEvent,
	resyncEventAudioSources,
};

export default EventStoreHttp;
