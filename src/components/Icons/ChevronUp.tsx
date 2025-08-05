interface Props {
	className: string;
}

const ChevronUp = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			className={className}
			stroke="currentColor"
			viewBox="0 0 512 512"
			aria-label="chevron-up-icon"
			role="img"
		>
			<polyline
				points="112 328 256 184 400 328"
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

export default ChevronUp;
