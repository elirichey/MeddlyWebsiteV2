import type { MeddlyEvent } from '@interfaces/Event';
// import { useRouter } from 'next/router';
import { useState } from 'react';
import EventCard from '../Cards/EventCard';
import Modal from '../Modal/Modal';

interface Props {
	events: MeddlyEvent[];
}

export default function ListOrgEvents(props: Props) {
	const { events } = props;
	const [showModal, setShowModal] = useState<boolean>(false);
	// const router = useRouter();

	const goToEventPage = (x: MeddlyEvent) => {
		// router.push(`/admin/event/${x.id}`);
	};

	return (
		<>
			<div id="list-events-container" className="overview-body">
				<div className="list-cards">
					{events.map((event) => (
						<EventCard event={event} onClick={goToEventPage} key={event.id} />
					))}
				</div>
			</div>

			<Modal id="Create Event" show={showModal} close={() => setShowModal(false)} size="Large">
				<p>Create Event</p>
			</Modal>
		</>
	);
}
