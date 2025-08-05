interface Props {
	className: string;
}

const ChevronDown = ({ className }: Props) => {
	return (
		<svg
			className={className}
			stroke="currentColor"
			width="512"
			height="512"
			viewBox="0 0 512 512"
			aria-label="chevron-down-icon"
			role="img"
		>
			<polyline
				points="112 184 256 328 400 184"
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

export default ChevronDown;
