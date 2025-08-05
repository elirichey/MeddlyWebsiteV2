interface Props {
	className: string;
}

const ChevronLeft = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			className={className}
			stroke="currentColor"
			aria-label="chevron-left-icon"
			role="img"
		>
			<polyline
				points="328 112 184 256 328 400"
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

export default ChevronLeft;
