import { useWavesurfer } from '@wavesurfer/react';
import Image from 'next/image';
import { useRef } from 'react';

import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import { formatSecondsToTime } from '@/utilities/helpers/format-seconds-to-time';

interface Props {
	post: VideoItem | AudioItem | Sequence;
}

export default function AudioWaveform(props: Props) {
	const { post } = props;

	const src = post?.src || '';
	const duration = post?.duration || 0;
	const waveformRef = useRef(null);

	const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
		container: waveformRef,
		url: src,
		height: 48,
		width: 320,
		waveColor: '#DDDDDD',
		progressColor: '#1B1C1E',
		cursorColor: 'transparent',
	});

	function onPlayPause() {
		wavesurfer?.playPause();
	}

	if (src === '') return <>No Source</>;

	return (
		<div id="audio-player">
			<div ref={waveformRef} />

			<div className="row mt-10">
				<div className="flex1 column">
					<p className="seconds">{formatSecondsToTime(currentTime)}</p>
				</div>

				<div className="flex1 column">
					<button
						type="button"
						onClick={onPlayPause}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								onPlayPause();
							}
						}}
					>
						{isPlaying ? (
							<Image src={'/svg/player/player-pause-black.svg'} height={32} width={32} alt="pause-icon" priority />
						) : (
							<Image src={'/svg/player/player-play-black.svg'} height={32} width={32} alt="play-icon" priority />
						)}
					</button>
				</div>

				<div className="flex1 column align-end">
					<p className="seconds">{formatSecondsToTime(duration)}</p>
				</div>
			</div>
		</div>
	);
}
