import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import { formatSecondsToTime } from '@utilities/helpers/format-seconds-to-time';
import Image from 'next/image';

interface Props {
	buffering: boolean;
	isPlaying: boolean;
	playOrPause: () => void;
	isFullScreen: boolean;
	toggleScreenView: () => void;
	videoSrc: VideoItem | AudioItem | Sequence;
	currentTime: number;
	setPlayerTime: (x: any) => void;
}

export default function VideoPlayerControls(props: Props) {
	const { buffering, isPlaying, playOrPause, isFullScreen, toggleScreenView, videoSrc, currentTime, setPlayerTime } =
		props;
	const { duration } = videoSrc;

	return (
		<div className="video-player-controls">
			<div className="video-player-display">
				<span
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							toggleScreenView();
						}
					}}
					onClick={toggleScreenView}
					className="video-player-screen-size"
				>
					{isFullScreen ? (
						<Image src={'/svg/player/screen-window.svg'} height={24} width={24} alt="screen-window-icon" priority />
					) : (
						<Image src={'/svg/player/screen-full.svg'} height={24} width={24} alt="full-screen-icon" priority />
					)}
				</span>
			</div>

			<div className="video-player-slider">
				<input type="range" min={0} max={duration} onChange={setPlayerTime} value={currentTime} step={0.001} />
			</div>

			<div className="video-player-time">
				<time>{currentTime ? formatSecondsToTime(currentTime) : '0:00'}</time>
				<span className="video-player-time-void" />
				<time>{duration ? formatSecondsToTime(duration) : '0:00'}</time>
			</div>

			<div className="video-player-play-container">
				<div className="video-player-play">
					<span
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								playOrPause();
							}
						}}
						onClick={playOrPause}
						className={buffering ? 'opacity-25-btn' : 'opacity-100-btn'}
					>
						{isPlaying ? (
							<Image src={'/svg/player/player-pause.svg'} height={32} width={32} alt="pause-icon" priority />
						) : (
							<Image src={'/svg/player/player-play.svg'} height={32} width={32} alt="play-icon" priority />
						)}
					</span>
				</div>
			</div>
		</div>
	);
}
