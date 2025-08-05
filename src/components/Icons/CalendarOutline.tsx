interface Props {
	className: string;
}

const CalendarOutline = ({ className }: Props) => {
	return (
		<svg className={className} viewBox="0 0 512 512" aria-label="calendar-outline-icon" role="img">
			<path
				d="M416,64h-16V48c0-8.8-7.2-16-16-16s-16,7.2-16,16v16H144V48c0-8.8-7.2-16-16-16s-16,7.2-16,16v16H96c-35.3,0-64,28.7-64,64
	v288c0,35.3,28.7,64,64,64h320c35.3,0,64-28.7,64-64V128C480,92.7,451.3,64,416,64z M96,96h320c17.6,0,32,14.4,32,32v16H64v-16
	C64,110.4,78.4,96,96,96z M416,448H96c-17.6,0-32-14.4-32-32V176h384v240C448,433.6,433.6,448,416,448z"
			/>
		</svg>
	);
};

export default CalendarOutline;
