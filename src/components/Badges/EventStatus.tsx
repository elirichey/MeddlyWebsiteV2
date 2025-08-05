interface Props {
	status: string;
}

export default function EventStatus(props: Props) {
	const { status } = props;

	switch (status) {
		case 'Created':
			return (
				<span className="event-status-badge bg-gray">
					<span className="txt-white">Created</span>
				</span>
			);

		case 'Listed':
			return (
				<span className="event-status-badge bg-dk-blue">
					<span className="txt-white">Listed</span>
				</span>
			);
		case 'Pre-Event':
			return (
				<span className="event-status-badge bg-gold">
					<span className="txt-black">Pre-Event</span>
				</span>
			);
		case 'In Progress':
			return (
				<span className="event-status-badge bg-dk-red">
					<span className="txt-white">In Progress</span>
				</span>
			);
		case 'Completed':
			return (
				<span className="event-status-badge bg-green">
					<span className="txt-white">Completed</span>
				</span>
			);
		case 'Processing':
			return (
				<span className="event-status-badge bg-blue">
					<span className="txt-white">Processing</span>
				</span>
			);
		case 'Post Production':
			return (
				<span className="event-status-badge bg-lt-blue">
					<span className="txt-brand">Post</span>
				</span>
			);
		case 'Published':
			return (
				<span className="event-status-badge bg-white">
					<span className="txt-brand">Published</span>
				</span>
			);
		case 'Canceled':
			return (
				<span className="event-status-badge">
					<span className="txt-bright-red">Canceled</span>
				</span>
			);
		case 'Rescheduled':
			return (
				<span className="event-status-badge bg-light">
					<span className="txt-black">Rescheduled</span>
				</span>
			);
		default:
			return (
				<span className="event-status-badge bg-blue">
					<span className="txt-white">{status}</span>
				</span>
			);
	}
}
