const filterStatuses: string[] = [
	'All',
	'Created',
	'Listed',
	'Pre-Event',
	'In Progress',
	'Completed',
	'Processing',
	'Post Production',
	'Published',
	'Canceled',
	'Rescheduled',
];

export interface EventStatusOverview {
	text: string | null;
	updateStatusTo: string | null;
	message: string | null;
}

export function getEventStatusOverview(currentStatus: string, showNoManagerVideo?: boolean): EventStatusOverview {
	const completedMessage = 'Event is completed and will be begin processing soon.';
	const completedNoManagerVideo =
		"Event is completed but missing manager video. Please have the event manager upload their video to continue event processing. \n \n If you cannot upload a manager video, please update the event's manager below and upload the new event manager's video.";

	const returnCompleteMsg = () => {
		if (showNoManagerVideo) return completedNoManagerVideo;
		return completedMessage;
	};

	switch (currentStatus.toLowerCase()) {
		case 'created':
			return {
				text: 'List Event',
				updateStatusTo: 'Listed',
				message: 'Update the event to Listed to start event setup on Camera screen',
			};
		case 'listed':
			return {
				text: null,
				updateStatusTo: null,
				message:
					'Event has been created and is ready for recording. The event manager can now setup the event on the Camera screen.',
			};
		case 'pre-event':
			return {
				text: null,
				updateStatusTo: null,
				message:
					'Use this time to set up any additional cameras and mobile devices needed to capture the event. Connect to the event by selecting the "Select Event" button on the top center of the Camera screen.',
			};
		case 'in progress':
			return {
				text: null,
				updateStatusTo: null,
				message: 'Event is currently in progress.',
			};
		case 'completed':
			return {
				text: null,
				updateStatusTo: null,
				message: returnCompleteMsg(),
			};
		case 'processing':
			return {
				text: null,
				updateStatusTo: null,
				message: 'Event is processing. You will be able to create Sequences soon.',
			};
		case 'post production':
			return {
				text: null,
				updateStatusTo: null,
				message:
					'The event is ready to go. You can now upload pro audio, add extra camera sources, and start creating Sequences for playback and download.',
				// text: hasPEvent is ready to be publishedackages ? 'Publish Event' : null,
				// updateStatusTo: hasPackages ? 'Published' : null,
				// message: hasPackages
				// 	? 'Event is ready to be published'
				// 	: 'Please create at least one packge before Publishing the event',
			};
		case 'published':
			return {
				text: null,
				updateStatusTo: null,
				message: 'This event is published and ready to be viewed',
			};
		case 'canceled':
			return {
				text: 'Reschedule Event',
				updateStatusTo: 'Rescheduled',
				message: 'Please reschedule or delete this event',
			};
		case 'rescheduled':
			return {
				text: 'Re-List Event',
				updateStatusTo: 'Listed',
				message: 'Please update the necessary event information to the reschedule date',
			};
		default:
			return {
				text: null,
				updateStatusTo: null,
				message: null,
			};
	}
}

const eventConfig = {
	filterStatuses,
};

export default eventConfig;
