const roleCreatedFields: string[] = [
	'title',
	'status',
	'date',
	'time',
	'type',
	'coverImg',
	'managerId',
	'venueId',
	'uploadPath',
];

const roleListedFields: string[] = [
	'title',
	'status',
	'date',
	'time',
	'type',
	'coverImg',
	'managerId',
	'venueId',
	'uploadPath',
];

const rolePreEventFields: string[] = ['status', 'coverImg'];
const roleCompletedFields: string[] = ['status', 'coverImg'];
const rolePostProductionFields: string[] = ['status', 'coverImg'];
const roleCanceledFields: string[] = ['status', 'coverImg'];
const roleRescheduledFields: string[] = [
	'title',
	'status',
	'date',
	'time',
	'type',
	'coverImg',
	'managerId',
	'venueId',
	'uploadPath',
];

/***************** DETERMINE EDITABLE EVENT FIELDS *****************/

export function determineEventFieldsEditableByOrgRoles(currentStatus: string) {
	switch (currentStatus) {
		case 'Created':
			return roleCreatedFields;

		case 'Listed':
			return roleListedFields;

		case 'Pre-Event':
			return rolePreEventFields;

		case 'Completed':
			return roleCompletedFields;

		case 'Post Production':
			return rolePostProductionFields;

		case 'Published':
			return ['coverImg'];

		case 'Canceled':
			return roleCanceledFields;

		case 'Rescheduled':
			return roleRescheduledFields;

		default:
			return [];
	}
}

const managerListedFields: string[] = ['status'];
const managerPreEventFields: string[] = ['status', 'timestampStart'];
const managerInProgressFields: string[] = ['status', 'timestampEnd'];

export function determineEventFieldsEditableByManager(currentStatus: string) {
	switch (currentStatus) {
		case 'Listed': // Begin Pre-Event
			return managerListedFields;

		case 'Pre-Event': // Begin Event
			return managerPreEventFields;

		case 'In Progress': // End Event
			return managerInProgressFields;

		default:
			return [];
	}
}

/***************** SET EVENT OPTIONS *****************/

const createdStatuses: string[] = ['Created', 'Listed'];
const listedStatuses: string[] = ['Listed', 'Canceled'];
const preEventStatuses: string[] = ['Canceled'];
const completedStatuses: string[] = ['Completed', 'Post Production'];
const postProductionFields: string[] = ['Post Production', 'Published'];
const canceledStatuses: string[] = ['Canceled', 'Rescheduled'];
const rescheduledStatuses: string[] = ['Rescheduled', 'Listed'];

export function determineEventStatusesByOrgRole(currentStatus: string) {
	switch (currentStatus) {
		case 'Created':
			return createdStatuses;

		case 'Listed':
			return listedStatuses;

		case 'Pre-Event':
			return preEventStatuses;

		case 'Completed':
			return completedStatuses;

		case 'Post Production':
			return postProductionFields;

		case 'Published':
			return [];

		case 'Canceled':
			return canceledStatuses;

		case 'Rescheduled':
			return rescheduledStatuses;

		default:
			return ['Created'];
	}
}

const managerListedStatuses: string[] = ['Pre-Event'];
const managerPreEventStatuses: string[] = ['In Progress', 'Canceled'];
const managerCompletedStatuses: string[] = ['Completed'];

export function determineEventStatusesByManager(currentStatus: string) {
	switch (currentStatus) {
		case 'Listed':
			return managerListedStatuses;

		case 'Pre-Event':
			return managerPreEventStatuses;

		case 'In Progress':
			return managerCompletedStatuses;

		default:
			return [];
	}
}
