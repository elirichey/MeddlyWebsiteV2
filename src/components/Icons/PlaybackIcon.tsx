interface Props {
	className: string;
}

const PlaybackIcon = ({ className }: Props) => {
	return (
		<svg viewBox="0 0 16 16" className={className} aria-label="playback-icon" role="img">
			<path
				d="M0,4c0-1.1,0.9-2,2-2h12c1.1,0,2,0.9,2,2v8c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V4z M15,4c0-0.6-0.4-1-1-1H2C1.4,3,1,3.4,1,4
	v8c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V4z M10.2,8.3L7,10.2c-0.3,0.2-0.6,0-0.6-0.3V6.2c0-0.3,0.3-0.5,0.6-0.3l3.2,1.8
	C10.5,7.8,10.5,8.2,10.2,8.3z"
			/>
		</svg>
	);
};

export default PlaybackIcon;
