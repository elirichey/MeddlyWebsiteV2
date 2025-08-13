'use client';

import type { MeddlyEvent } from '@/interfaces/Event';
import EventForm from '@components/Forms/Events/EventForm';
import Loader from '@components/Loader/Loader';
import MenuBar from '@components/MenuBar/MenuBar';
import ChevronLeft from '@icons/ChevronLeft';
import AdminLayout from '@layout/AdminLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewEvent() {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [viewEvent, setViewEvent] = useState<MeddlyEvent | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		return () => controller.abort();
	}, []);

	const goBack = () => router.back();

	const onCreateCallback = (event?: MeddlyEvent) => {
		if (event) {
			console.log({ newEvent: event });
			// setViewEvent(event);
		} else {
			console.log('No event created');
		}
	};

	return (
		<AdminLayout>
			<main id="admin" className="admin-event">
				<MenuBar>
					<button className="menu-bar-go-back" onClick={goBack} onKeyDown={goBack} type="button">
						<ChevronLeft className="back-icon" />
						<span>Back</span>
					</button>

					<div className="flex1 flex" />
				</MenuBar>

				{loading ? (
					<div className="loader-container">
						<div className="loader-list">
							<Loader loaderId="circle-eq" />
						</div>
					</div>
				) : (
					<div id="list-events">
						<div id="list-events-container" className="overview-body">
							<div id="event-overview" className="column">
								<div className="mx-15">
									<h2>Create New Event</h2>
								</div>

								<EventForm
									viewEvent={viewEvent}
									getEvents={() => {
										router.push('/admin/events');
									}}
									updateViewEvent={onCreateCallback}
								/>
							</div>
						</div>
					</div>
				)}
			</main>
		</AdminLayout>
	);
}
