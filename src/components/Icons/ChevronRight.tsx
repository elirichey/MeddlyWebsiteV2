interface Props {
	className: string;
}

const ChevronRight = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			className={className}
			stroke="currentColor"
			aria-label="chevron-right-icon"
			role="img"
		>
			<polyline
				points="184 112 328 256 184 400"
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

export default ChevronRight;
