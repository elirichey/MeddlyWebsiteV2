'use client';

import EventFilter from '@/components/Filters/EventFilter';
import Pagination from '@/components/Pagination/Pagination';
import eventConfig from '@/config/events';
import type { MeddlyEvent } from '@/interfaces/Event';
import refreshUser from '@/utilities/RefreshUser';
import ListOrgEvents from '@components/Lists/ListOrgEvents';
import Loader from '@components/Loader/Loader';
import MenuBar from '@components/MenuBar/MenuBar';
import AddIcon from '@icons/AddIcon';
import AdminLayout from '@layout/AdminLayout';
// import OrgEventHTTP from '@utilities/http/admin/organization-events';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import '@styles/globals.sass';

export default function Events() {
	const [loading, setLoading] = useState<boolean>(false);
	const [totalEvents, setTotalEvents] = useState<number>(0);
	const [selectedStatus, setSelectedStatus] = useState<string>('All');
	const [eventStatuses, setEventStatuses] = useState<string[]>(['All']);
	const [orgEvents, setOrgEvents] = useState<MeddlyEvent[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const router = useRouter();

	useEffect(() => {
		const controller = new AbortController();
		getOrgEvents();
		return () => controller.abort();
	}, []);

	const getOrgEvents = useCallback(async () => {
		// const userCookie = getCookie("user");
		// const roleCookie = getCookie('role');
		// const currentRole = roleCookie ? JSON.parse(roleCookie) : null;
		// const accessToken = getCookie('accessToken');
		// const role = roleCookie ? JSON.parse(roleCookie) : null;
		// const status = selectedStatus !== 'All' ? selectedStatus : '';
		// try {
		// 	setLoading(true);
		// 	const res: any = await OrgEventHTTP.getOrganizationalEvents(
		// 		accessToken || '',
		// 		currentRole,
		// 		currentPage - 1,
		// 		status,
		// 	);
		// 	if (res.status === 200) {
		// 		// const {events, eventStatuses, totalEvents} = res.data
		// 		const statuses = res.data.eventStatuses || [];
		// 		setOrgEvents(res.data.events);
		// 		setTotalEvents(res.data.totalEvents);
		// 		const test = ['All', ...statuses];
		// 		const x = eventConfig.filterStatuses;
		// 		const newOptions = [...test].sort((a, b) => x.indexOf(a) - x.indexOf(b));
		// 		setEventStatuses(newOptions);
		// 		// setEventStatuses(["All", ...statuses]);
		// 		setTimeout(() => setLoading(false), 750);
		// 	} else {
		// 		if (res.status === 403) {
		// 			await refreshUser(router);
		// 			await getOrgEvents();
		// 		} else {
		// 			console.log('GetOrgEvents Non-200 Response:', res);
		// 			setTimeout(() => setLoading(false), 750);
		// 		}
		// 	}
		// } catch (e) {
		// 	console.log('GetOrgEvents Error', e);
		// 	setTimeout(() => setLoading(false), 750);
		// }
	}, []);

	useEffect(() => {
		if (currentPage && selectedStatus) {
			getOrgEvents();
		}
	}, [currentPage, selectedStatus, getOrgEvents]);

	const [showEventsFilterOptions, setShowEventsFilterOptions] = useState<boolean>(false);

	const showItemsPerPage = 8;
	const totalPages = Math.ceil(totalEvents / showItemsPerPage);

	return (
		<main id="admin" className="admin-events">
			<AdminLayout>
				<MenuBar>
					<>
						<div className="flex" />
						<div className="menu-bar-add-item">
							<button type="button" onClick={() => router.push('/admin/event/new')}>
								<AddIcon className="add-icon" />
								<span>Create</span>
							</button>
						</div>
					</>
				</MenuBar>

				<div id="list-events">
					<EventFilter
						selected={selectedStatus}
						options={eventStatuses}
						onSelect={(x) => setSelectedStatus(x)}
						showOptions={showEventsFilterOptions}
						setShowOptions={() => setShowEventsFilterOptions(!showEventsFilterOptions)}
					/>

					{totalPages > 1 ? (
						<Pagination
							currentPage={currentPage}
							goNext={() => setCurrentPage(currentPage + 1)}
							goPrevious={() => setCurrentPage(currentPage - 1)}
							goToPage={(x: number) => setCurrentPage(x)}
							goFirst={() => setCurrentPage(1)}
							goLast={() => setCurrentPage(totalPages)}
							totalPages={totalPages}
						/>
					) : null}

					{loading ? (
						<div className="loader-container bg-light-important">
							<div className="loader-list">
								<Loader loaderId="circle-eq" />
							</div>
						</div>
					) : (
						<ListOrgEvents events={orgEvents} />
					)}
				</div>
			</AdminLayout>
		</main>
	);
}
