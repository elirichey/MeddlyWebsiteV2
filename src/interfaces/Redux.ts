import type { AuthTokens, Profile, UserSelectedRole } from './Auth';
import type { DeviceState, OrgDeviceInfo, UserDeviceInfo } from './Device';
import type { MeddlyEvent } from './Event';
import type { Organization, OrganizationOverview } from './Organization';
import type { UploadItem } from './Upload';
import type { UserRole } from './UserRoles';

export interface ReduxState {
	auth: AuthState;
	camera: CameraState;
	events: EventsState;
	devices: DeviceState;
	roles: RolesState;
	packages: PackagesState;
	organization: OrganizationState;
	theme: ThemeState;
	_persist: ReduxPersistState;
}

export interface AuthState {
	loading: boolean;
	connectedEventLoading: boolean;
	profile: Profile | null;
	tokens: AuthTokens | null;
	currentRole: UserSelectedRole | null;
	isWatchingLocation: boolean;
	lastUpdatedProfile: number | null;
	error: any | null;
}

export interface CameraState {
	isRecording: boolean;
	mode: string;
	frontCamera: boolean;
	flash: string;
	uploadProgressArray: UploadItem[];
	uploadQueue: UploadItem[];
}

export interface DeviceStates {
	user: UserDeviceInfo;
	roles: OrgDeviceInfo[];
}

export interface EventsState {
	loadingCamera: boolean;
	loadingCameraEvent: boolean;
	loadingEvent: boolean;
	loadEndEvent: boolean;
	loadingHomeList: boolean;
	loadingUserList: boolean;
	loadingOrgEventList: boolean;
	homeEvents: MeddlyEvent[];
	homeEventsTab: string;
	homeEventStatuses: string[];
	homeEventsCurrentPage: number;
	homeTotalUpcomingEvents: number;
	homeTotalPreviousEvents: number;
	userEvents: MeddlyEvent[];
	userEventsTab: string;
	userEventStatuses: string[];
	userEventsCurrentPage: number;
	userTotalEvents: number;
	viewOrgEvents: MeddlyEvent[];
	viewOrgEventsCurrentPage: number;
	viewOrgTotalUpcomingEvents: number;
	viewOrgTotalPreviousEvents: number;
	cameraEvents: MeddlyEvent[];
	cameraEventsCurrentPage: number;
	cameraTotalEvents: number;
	viewEvent: MeddlyEvent | null;
	lastUpdatedHome: number | null;
	lastUpdatedList: number | null;
	lastUpdatedCamera: number | null;
	error: any | null;
}

export interface MediaState {
	showDownloadScreen: boolean;
	file: string | null;
	jobId: number | null;
	downloadProgress: number;
	error: string | null;
}

export interface OrganizationState {
	loadingOrgs: boolean;
	loadingOrg: boolean;
	listedOrgs: Organization[];
	listOrgsCurrentPage: number;
	totalOrgs: number;
	viewOrg: OrganizationOverview | null;
	error: any | null;
}

export interface PackagesState {
	loadingList: boolean;
	loadingPackage: boolean;
	eventPosts: any[];
	eventPostsCurrentPage: 0;
	eventTotalPosts: 0;
	eventPackages: any[];
	eventPackagesCurrentPage: 0;
	eventTotalPackages: 0;
	ownedPackages: any[];
	viewPackage: any | null;
	uploadProgressArray: UploadItem[];
	uploadQueue: UploadItem[];
	lastUpdatedPackages: number | null;
	lastUpdatedPackage: number | null;
	error: any | null;
}

export interface RolesState {
	loadingList: boolean;
	loadingRole: boolean;
	orgRoles: UserRole[];
	orgRolesCurrentPage: number;
	orgTotalRoles: number;
	viewRole: UserSelectedRole | null;
	lastUpdatedRoles: number | null;
	lastUpdatedRole: number | null;
	error: null | any;
}

export interface SequencesState {
	loadingList: boolean;
	loadingSequence: boolean;
	eventSequences: any[];
	ownedSequences: any[];
	viewSequence: any;
	lastUpdatedSequences: number | null;
	lastUpdatedSequence: number | null;
	error: null | any;
}

export interface SocketSession {
	id: string;
	sessionId: string;
	eventId: string;
	userId: string;
	isRecording: boolean;
}

export interface SocketState {
	session: SocketSession | null;
	error: any | null;
}

export interface ThemeState {
	darkMode: boolean;
}

export interface ReduxPersistState {
	rehydrated: boolean;
	version: number;
}

export interface ReduxAction {
	type: string;
	data?: any;
}
