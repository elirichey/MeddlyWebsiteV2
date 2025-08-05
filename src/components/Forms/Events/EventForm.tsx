import type { MeddlyEvent, MeddlyEventOnCreate } from '@/interfaces/Event';
import refreshUser from '@/utilities/RefreshUser';
import {
	type EventOnCreate,
	formatCreateEventPayload,
	formatEditEventPayload,
} from '@/utilities/validations/EventFormValidator';
import { formatDateForInput, formatTimeForInput } from '@utilities/conversions/dates';
import {
	determineEventFieldsEditableByOrgRoles,
	determineEventStatusesByOrgRole,
} from '@utilities/helpers/admin/determine-event-fields';
import OrgEventHTTP from '@utilities/http/admin/organization-events';
import UserRolesHTTP from '@utilities/http/admin/user-roles';
import VenuesHttp from '@utilities/http/admin/venues';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../../Loader/Loader';
import VenueTicket from '../../Tickets/VenueTicket';
import ImageUpload from '../Uploader/ImageUpload';
import DateInput from '../_Inputs/DateInput';
import Input from '../_Inputs/Input';
import SearchSelectVenue from '../_Inputs/SearchSelectVenue';
import SelectCustom from '../_Inputs/SelectCustom';
import SelectUser from '../_Inputs/SelectUser';
import TimeInput from '../_Inputs/TimeInput';

interface Props {
	viewEvent: MeddlyEvent | null;
	getEvents: () => Promise<void> | void;
	updateViewEvent: (event?: MeddlyEvent | undefined) => void;
}

export default function EventForm(props: Props) {
	const { viewEvent, getEvents, updateViewEvent } = props;
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<Array<any>>([]);

	const initialDate: string | null = viewEvent?.dateTime
		? formatDateForInput(viewEvent.dateTime)
		: formatDateForInput(new Date().getTime());
	const initialTime: string | null = viewEvent?.dateTime
		? formatTimeForInput(viewEvent.dateTime)
		: formatTimeForInput(new Date().getTime());

	// Form StuffviewEvent && viewEvent.
	const [eventTitle, setEventTitle] = useState<string>(viewEvent?.title ? viewEvent.title : '');
	const [eventDate, setEventDate] = useState<string>(initialDate);
	const [eventTime, setEventTime] = useState<string>(initialTime);

	const [eventStatus, setEventStatus] = useState<string>(viewEvent?.status ? viewEvent.status : '');
	const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);

	const [eventType, setEventType] = useState<string>(viewEvent?.type ? viewEvent.type : '');
	const [showTypeOptions, setShowTypeOptions] = useState<boolean>(false);

	const [eventManager, setEventManager] = useState<any | null>(viewEvent?.manager ? viewEvent.manager : null);
	const [eventManagerOptions, setEventManagerOptions] = useState<Array<string>>([]);
	const [showManagerOptions, setShowManagerOptions] = useState<boolean>(false);

	const [eventVenue, setEventVenue] = useState<any | null>(viewEvent?.venue ? viewEvent.venue : null);
	const [eventVenueOptions, setEventVenueOptions] = useState<Array<any>>([]);
	const [showVenueOptions, setShowVenueOptions] = useState<boolean>(false);
	const [loadingSearchVenues, setLoadingSearchVenues] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');

	const [updatedEventTitle, setUpdatedEventTitle] = useState<boolean>(false);
	const [updatedEventDate, setUpdatedEventDate] = useState<boolean>(false);
	const [updatedEventTime, setUpdatedEventTime] = useState<boolean>(false);
	const [updatedEventStatus, setUpdatedEventStatus] = useState<boolean>(false);
	const [updatedEventType, setUpdatedEventType] = useState<boolean>(false);
	const [updatedEventManager, setUpdatedEventManager] = useState<boolean>(false);
	const [updatedEventVenue, setUpdatedEventVenue] = useState<boolean>(false);

	useEffect(() => {
		const originalTitle = viewEvent?.title ? viewEvent.title : false;
		const updated = originalTitle ? originalTitle !== eventTitle : eventTitle.trim() !== '';
		if (updated) setUpdatedEventTitle(true);
		else if (updatedEventTitle) setUpdatedEventTitle(false);
	}, [eventTitle]);

	useEffect(() => {
		const originalDate = initialDate ? initialDate : false;
		const updated = originalDate ? originalDate !== eventDate : eventDate;
		if (updated) setUpdatedEventDate(true);
		else if (updatedEventDate) setUpdatedEventDate(false);
	}, [eventDate]);

	useEffect(() => {
		const originalTime = initialTime ? initialTime : false;
		const updated = originalTime ? originalTime !== eventTime : eventTime;
		if (updated) setUpdatedEventTime(true);
		else if (updatedEventTime) setUpdatedEventTime(false);
	}, [eventTime]);

	useEffect(() => {
		const originalStatus = viewEvent?.status ? viewEvent.status : false;
		const updated = originalStatus ? originalStatus !== eventStatus : eventStatus;
		if (updated) setUpdatedEventStatus(true);
		else if (updatedEventStatus) setUpdatedEventStatus(false);
	}, [eventStatus]);

	useEffect(() => {
		const originalType = viewEvent?.type ? viewEvent.type : false;
		const updated = originalType ? originalType !== eventType : eventType;
		if (updated) setUpdatedEventType(true);
		else if (updatedEventType) setUpdatedEventType(false);
	}, [eventType]);

	useEffect(() => {
		const originalManager = viewEvent?.manager ? viewEvent.manager : false;
		const updated = originalManager ? originalManager.id !== eventManager.id : eventManager;
		if (updated) setUpdatedEventManager(true);
		else if (updatedEventManager) setUpdatedEventManager(false);
	}, [eventManager]);

	useEffect(() => {
		const originalVenue = viewEvent?.venue ? viewEvent.venue : false;
		const updated = originalVenue ? originalVenue.id !== eventVenue.id : eventVenue;
		if (updated) setUpdatedEventVenue(true);
		else if (updatedEventVenue) setUpdatedEventVenue(false);
	}, [eventVenue]);

	useEffect(() => {
		showManagerOptions ? setShowManagerOptions(false) : null;
	}, [eventManager]);

	const completeOnCreate =
		updatedEventTitle &&
		updatedEventDate &&
		updatedEventTime &&
		updatedEventType &&
		updatedEventManager &&
		updatedEventVenue;

	const eventHasBeenUpdated =
		updatedEventTitle ||
		updatedEventDate ||
		updatedEventTime ||
		updatedEventStatus ||
		updatedEventType ||
		updatedEventManager ||
		updatedEventVenue;

	const updateReady = viewEvent ? eventHasBeenUpdated : completeOnCreate;

	// ********** Lifecycle ********** //

	useEffect(() => {
		checkAvailableStatuses();
		checkEditableFields();
		getOrgRoles();
		setTimeout(() => setLoading(false), 500);
	}, []);

	const [statusOptions, setStatusOptions] = useState<Array<string>>([]);
	const checkAvailableStatuses = async () => {
		const statusOptions = determineEventStatusesByOrgRole(eventStatus);
		setStatusOptions(statusOptions);
	};

	const [editableFields, setEditableFields] = useState<Array<string>>([]);
	const checkEditableFields = async () => {
		const fields = determineEventFieldsEditableByOrgRoles(eventStatus);
		setEditableFields(fields);
	};

	const getOrgRoles = async () => {
		const roleCookie: any = getCookie('role');
		const accessToken: any = getCookie('accessToken');
		const role = roleCookie ? JSON.parse(roleCookie) : null;

		try {
			const res: any = await UserRolesHTTP.getOrgRoles(role.organization.id, accessToken);
			// const {userRoles, totalUserRoles} = res.data;
			if (res.status === 200) {
				setEventManagerOptions(res.data.userRoles);
			} else if (res.status === 403) {
				await refreshUser(router);
				setLoading(false);
				// await getOrgRoles();
			} else {
				console.warn('EventForm - getOrgRoles - Non 200 Response:', res);
			}
		} catch (e: any) {
			const { data } = e.response;
			const is403 = data?.code === 403;
			if (is403) {
				await refreshUser(router);
				console.log('TEST');
				setLoading(false);
				// await getOrgRoles();
			} else {
				console.error('Error', { data, code: data.code });
			}
		}
	};

	// ********** Form Actions ********** //

	const onSearch = async () => {
		const accessToken = getCookie('accessToken');
		if (searchValue !== '') {
			setLoadingSearchVenues(true);
			setShowVenueOptions(true);

			try {
				const res = await VenuesHttp.searchVenues(searchValue, accessToken || '');

				if (res.status === 200) {
					setEventVenueOptions(res.data);
					setTimeout(() => setLoadingSearchVenues(false), 500);
				} else if (res.status === 403) {
					await refreshUser(router);
					// await onSearch();
				} else {
					console.warn('Search Venues - Non 200 Response:', res);
					setEventVenueOptions([]);
				}
			} catch (e: any) {
				console.error('Search Venues Catch: ', e.response);
				setEventVenueOptions([]);
				setTimeout(() => setShowVenueOptions(false), 500);
			}
		}
	};

	const emptyUpdates = () => {
		setUpdatedEventTitle(false);
		setUpdatedEventDate(false);
		setUpdatedEventTime(false);
		setUpdatedEventType(false);
		setUpdatedEventStatus(false);
		setUpdatedEventVenue(false);
		setUpdatedEventManager(false);
	};

	const emptyForm = () => {
		setEventTitle('');
		setEventDate(formatDateForInput(new Date().getTime()));
		setEventTime(formatTimeForInput(new Date().getTime()));
		setEventType('');
		setEventStatus('');
		setEventVenue(null);
		setEventManager(null);
		emptyUpdates();
	};

	const onSubmit = async (values: any) => {
		const accessToken: any = getCookie('accessToken');

		setLoading(true);

		// Create Event
		if (!viewEvent) {
			const onCreate: EventOnCreate = {
				title: eventTitle,
				status: eventStatus,
				type: eventType,
				venueId: eventVenue.id,
				managerId: eventManager.id,
				date: eventDate,
				time: eventTime,
			};

			const payload = formatCreateEventPayload(onCreate);

			try {
				const res: any = await OrgEventHTTP.createEvent(payload, accessToken);
				if (res.status === 201) {
					getEvents ? await getEvents() : null;
					emptyForm();
					setTimeout(() => setLoading(false), 500);
					//return console.log("Event Created:", res);
				} else if (res.status === 403) {
					await refreshUser(router);
					setLoading(false);
					// await onSubmit(values);
				} else {
					setTimeout(() => setLoading(false), 500);
					return console.warn('onSubmit - Create - Non 200 Error: ', res);
				}
			} catch (e) {
				setTimeout(() => setLoading(false), 500);
				return console.error('onSubmit - Create - Catch Error:', e);
			}

			return;
		}

		// Update Event
		const onEdit: Partial<MeddlyEventOnCreate> = {
			title: eventTitle,
			status: eventStatus,
			type: eventType,
			venueId: eventVenue.id,
			managerId: eventManager.id,
			date: eventDate,
			time: eventTime,
		};

		const payload: any = formatEditEventPayload(onEdit);

		try {
			const res: any = await OrgEventHTTP.updateEvent(viewEvent, payload, accessToken);
			if (res.status === 200) {
				emptyUpdates();
				setTimeout(() => setLoading(false), 500);
				//return console.log("Event Updated:", res);
			} else if (res.status === 403) {
				await refreshUser(router);
				setLoading(false);
				// await onSubmit(values);
			} else {
				setTimeout(() => setLoading(false), 500);
				return console.warn('onSubmit - Update - Non 200 Error: ', res);
			}
		} catch (e) {
			setTimeout(() => setLoading(false), 500);
			return console.error('onSubmit - Update - Catch Error:', e);
		}
	};

	// **************** RENDER **************** //

	const imgSrc: string = viewEvent?.coverImg ? viewEvent.coverImg : '/image/webp/placeholders/no-cover.webp';

	const completedStatuses: Array<string> = ['Completed', 'Processing', 'Post Production', 'Published'];

	const hasEnded: boolean = completedStatuses.includes(viewEvent?.status || '');

	// coverImg
	const titleIsEditable = editableFields.includes('title');
	const dateIsEditable = editableFields.includes('date');
	const timeIsEditable = editableFields.includes('time');
	const typeIsEditable = editableFields.includes('type');
	const statusIsEditable = editableFields.includes('status');
	const venueIsEditable = editableFields.includes('venueId');
	const managerIsEditable = editableFields.includes('managerId');
	const coverImgIsEditable = editableFields.includes('coverImg');
	const coverImg = viewEvent?.coverImg ? viewEvent.coverImg : null;

	return (
		<div className="event-form">
			{loading ? (
				<div className="loader-list">
					<Loader loaderId="circle-eq" />
				</div>
			) : (
				<div className="row wrap">
					<form id="event-form" className="form" onSubmit={onSubmit}>
						<div className="event-form-container">
							{/* STEP - 1 */}

							<div className="field-inputs mr-15">
								<Input
									name="title"
									value={eventTitle}
									onChange={setEventTitle}
									type="text"
									placeholder="Event Title"
									isComplete={updatedEventTitle}
									label="Title"
									disabled={viewEvent ? !titleIsEditable : false}
									// error={nameError ? nameError.message : null}
								/>

								<div className="row wrap">
									<div className="mr-15">
										<DateInput
											name="date"
											label="Date"
											value={eventDate}
											onChange={(e: any) => {
												setEventDate(formatDateForInput(e.target.value));
											}}
											placeholder="Select Date"
											isComplete={updatedEventDate}
											required={true}
											disabled={viewEvent ? !dateIsEditable : false}
											// error={nameError ? nameError.message : null}
										/>
									</div>

									<div className="ml-15">
										<TimeInput
											name="time"
											label="Time"
											value={eventTime}
											onChange={(e: any) => setEventTime(e.target.value)}
											placeholder="Select Time"
											isComplete={updatedEventTime}
											required={true}
											disabled={viewEvent ? !timeIsEditable : false}
											// error={nameError ? nameError.message : null}
										/>
									</div>
								</div>

								<div className="row wrap selections">
									<div className={viewEvent ? 'flex1 mr-15 select-dropdown-x2' : 'flex1 select-dropdown-x2'}>
										<SelectCustom
											name="type"
											label="Event Type"
											options={['Concert']}
											showOptions={showTypeOptions}
											setShowOptions={() => setShowTypeOptions(!showTypeOptions)}
											value={eventType}
											onChange={(x: string) => setEventType(x)}
											isComplete={updatedEventType}
											disabled={viewEvent ? !typeIsEditable : false}
											// error={nameError ? nameError.message : null}
										/>
									</div>

									{viewEvent ? (
										<div className="flex1 ml-15 select-dropdown-x2">
											<SelectCustom
												name="status"
												label="Status"
												options={statusOptions}
												showOptions={showStatusOptions}
												setShowOptions={() => setShowStatusOptions(!showStatusOptions)}
												value={eventStatus}
												onChange={(x: string) => setEventStatus(x)}
												isComplete={updatedEventStatus}
												disabled={viewEvent ? !statusIsEditable : false}
												// error={nameError ? nameError.message : null}
											/>
										</div>
									) : null}
								</div>
							</div>

							{/* STEP - 2 */}

							<div className="dropdown-selections mx-15">
								<div className="row mobile-column mb-15">
									<div className="w100 flex1 column relative">
										<SearchSelectVenue
											searchName="searchValue"
											label="Venue"
											selected={eventVenue}
											setSelected={(x: any) => {
												setEventVenue(x);
												setShowVenueOptions(false);
											}}
											options={eventVenueOptions}
											searchPlaceholder="Type and click search"
											showOptions={showVenueOptions}
											setShowOptions={setShowVenueOptions}
											onSearch={onSearch}
											isComplete={updatedEventVenue}
											loading={loadingSearchVenues}
											// error={nameError ? nameError.message : null}
											searchValue={searchValue}
											setSearchValue={setSearchValue}
											disabled={viewEvent ? !venueIsEditable : false}
										/>

										<div className="event-selected-venue-container">
											<VenueTicket venue={eventVenue} />
										</div>
									</div>
								</div>

								<div className="row mobile-column mb-15">
									<SelectUser
										name="manager"
										label="Manager"
										user={eventManager}
										options={eventManagerOptions}
										setSelected={(x: any) => {
											setEventManager(x.user);
											setShowManagerOptions(false);
										}}
										showOptions={showManagerOptions}
										setShowOptions={setShowManagerOptions}
										isComplete={updatedEventManager}
										disabled={viewEvent ? !managerIsEditable : false}
										// error={nameError ? nameError.message : null}
									/>
								</div>
							</div>

							{/* STEP - 3 */}

							<div className="artwork-submit ml-15">
								{viewEvent ? (
									<>
										<div className="row mobile-column mb-15">
											<ImageUpload
												value={coverImg}
												type="event-cover"
												eventId={viewEvent?.id}
												onComplete={(x: any) => {
													console.log({ onUploadComplete: x });
													if (updateViewEvent) updateViewEvent(x);
												}}
												disabled={!coverImgIsEditable}
											/>
										</div>

										{/* Submit */}
										<button
											className={!updateReady ? 'submit-btn disabled' : 'submit-btn'}
											type="submit"
											disabled={!updateReady}
										>
											Submit
										</button>
									</>
								) : (
									<div className="flex1 column align-center justify-center">
										{/* Submit */}
										<button
											className={!updateReady ? 'submit-btn disabled' : 'submit-btn'}
											type="submit"
											disabled={!updateReady}
										>
											Submit
										</button>
									</div>
								)}
							</div>
						</div>
					</form>

					{/* hasEnded ? (
            <>
              <ListOrgEventMediaDefaults viewEvent={viewEvent} />
              <ListOrgEventPackages viewEvent={viewEvent} />
            </>
          ) : null */}
				</div>
			)}
		</div>
	);
}
