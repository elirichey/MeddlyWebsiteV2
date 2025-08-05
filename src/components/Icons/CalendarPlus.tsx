interface Props {
	className: string;
}

const CalendarIcon = ({ className }: Props) => {
	return (
		<svg viewBox="0 0 16 16" className={className} aria-label="calendar-plus-icon" role="img">
			<path
				d="M8,7c0.3,0,0.5,0.2,0.5,0.5V9H10c0.3,0,0.5,0.2,0.5,0.5S10.3,10,10,10H8.5v1.5C8.5,11.8,8.3,12,8,12s-0.5-0.2-0.5-0.5V10H6
	c-0.3,0-0.5-0.2-0.5-0.5S5.7,9,6,9h1.5V7.5C7.5,7.2,7.7,7,8,7z M3.5,0C3.8,0,4,0.2,4,0.5V1h8V0.5C12,0.2,12.2,0,12.5,0
	S13,0.2,13,0.5V1h1c1.1,0,2,0.9,2,2v11c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V3c0-1.1,0.9-2,2-2h1V0.5C3,0.2,3.2,0,3.5,0z M1,4v10
	c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V4H1z"
			/>
		</svg>
	);
};

export default CalendarIcon;
