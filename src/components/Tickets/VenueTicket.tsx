import type { Venue } from '@/interfaces/Venue';
import type { ReactNode } from 'react';

interface Props {
	venue: Venue;
	children?: ReactNode;
}

export default function UserTicket(props: Props) {
	const { venue, children } = props;

	if (!venue) return children;

	return (
		<div className="venue-ticket">
			<div className="select-venue-body">
				{venue.name ? <span className="title">{venue.name}</span> : null}
				<span className="secondary">
					{venue.addressStreet1}, {venue.addressStreet2}
				</span>

				<span className="secondary">
					{venue.addressCity}, {venue.addressRegion} {venue.addressZipCode}
				</span>
			</div>

			{children}
		</div>
	);
}
