interface Props {
	className: string;
}

const CalendarOutline = ({ className }: Props) => {
	return (
		<svg className={className} x="0px" y="0px" viewBox="0 0 512 512" aria-label="cash-icon" role="img">
			<path
				style={{ fill: 'currentColor' }}
				d="M480,224c-53-0.1-95.9-43-96-96v-16H128v16c-0.1,53-43,95.9-96,96H16v64h16c53,0.1,95.9,43,96,96v16h256v-16
	c0.1-53,43-95.9,96-96h16v-64H480z M256,352c-53,0-96-43-96-96s43-96,96-96s96,43,96,96C351.9,309,309,351.9,256,352z M96,128v-16
	H16v80h16C67.3,192,96,163.3,96,128z M32,320H16v80h80v-16C96,348.7,67.3,320,32,320z M480,192h16v-80h-80v16
	C416,163.3,444.7,192,480,192z M416,384v16h80v-80h-16C444.7,320,416,348.7,416,384z M256,192c35.3,0,64,28.7,64,64s-28.7,64-64,64
	s-64-28.7-64-64S220.7,192,256,192z"
			/>
		</svg>
	);
};

export default CalendarOutline;
