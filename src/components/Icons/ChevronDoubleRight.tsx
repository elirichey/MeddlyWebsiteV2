interface Props {
	className: string;
}

const ChevronDoubleRight = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			className={className}
			stroke="currentColor"
			aria-label="chevron-double-right-icon"
			role="img"
		>
			<polyline
				points="113 400 257 256 113 112"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '48px',
				}}
			/>
			<polyline
				points="255 400 399 256 255 112"
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

export default ChevronDoubleRight;
