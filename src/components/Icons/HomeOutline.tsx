interface Props {
	className: string;
}

const HomeOutline = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			className={className}
			stroke="currentColor"
			viewBox="0 0 512 512"
			aria-label="home-outline-icon"
			role="img"
		>
			<path
				d="M80,212V448a16,16,0,0,0,16,16h96V328a24,24,0,0,1,24-24h80a24,24,0,0,1,24,24V464h96a16,16,0,0,0,16-16V212"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '32px',
				}}
			/>
			<path
				d="M480,256,266.89,52c-5-5.28-16.69-5.34-21.78,0L32,256"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '32px',
				}}
			/>
			<polyline
				points="400 179 400 64 352 64 352 133"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '32px',
				}}
			/>
		</svg>
	);
};

export default HomeOutline;
