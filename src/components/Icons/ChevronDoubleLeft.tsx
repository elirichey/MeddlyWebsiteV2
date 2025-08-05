interface Props {
	className: string;
}

const ChevronDoubleLeft = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			className={className}
			stroke="currentColor"
			aria-label="chevron-double-left-icon"
			role="img"
		>
			<polyline
				points="399 112 255 256 399 400"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '48px',
				}}
			/>

			<polyline
				points="257 112 113 256 257 400"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '48px',
				}}
			/>
		</svg>
	);
};

export default ChevronDoubleLeft;
