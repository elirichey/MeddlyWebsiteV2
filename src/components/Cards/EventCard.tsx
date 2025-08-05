import type { MeddlyEvent } from '@/interfaces/Event';
import { formatMonthBy12Shorthand, formatTime } from '@/utilities/conversions/dates';
import Image from 'next/image';
import CalendarEvent from '../Icons/CalendarEvent';
import LocationIcon from '../Icons/LocationIcon';

interface Props {
	event: MeddlyEvent;
	onClick: (event: MeddlyEvent) => void;
}

export default function EventCard(props: Props) {
	const { event, onClick } = props;

	const eventDateTime = new Date(event.dateTime);
	const monthNumber = eventDateTime.getMonth() + 1;
	const eventMonth = formatMonthBy12Shorthand(monthNumber);
	const eventDay = eventDateTime.getDate();
	const eventYear = eventDateTime.getFullYear();
	const eventDate = `${eventMonth} ${eventDay}, ${eventYear}`;

	const eventTime = formatTime(eventDateTime);

	const avatar = event?.orgOwner?.avatar || '/image/webp/placeholders/avatar.webp';
	const coverImg = event.coverImg || '/image/webp/placeholders/event-placeholder.webp';

	return (
		<div
			className="event-card"
			onClick={() => onClick(event)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick(event);
				}
			}}
		>
			<div className="cover-art">
				<Image src={coverImg} alt={event.title} layout="fill" objectFit="cover" />
			</div>

			<div className="event-info">
				<p className="title">{event?.title}</p>

				<div className="row">
					<div className="flex1 org-info">
						<div className="avatar">
							<Image src={avatar} height={50} width={50} alt="org-avatar" />
						</div>
						<p className="event-txt">{event?.orgOwner?.name}</p>
					</div>

					<div className="event-date">
						<CalendarEvent className="calendar-icon" />
						<p className="event-txt">{eventDate}</p>
					</div>
				</div>

				<div className="row mt-5">
					<div className="flex1 location-info">
						<div className="location-icon-container">
							<LocationIcon className="location-icon" />
						</div>

						<div className="flex1 column">
							<p className="event-txt venue-txt">{event?.venue?.name}</p>
							<p className="event-txt venue-txt">
								{event?.venue?.addressCity}, {event?.venue?.addressRegion}
							</p>
						</div>
					</div>

					<p className="event-txt">{eventTime}</p>
				</div>
			</div>
		</div>
	);
}
