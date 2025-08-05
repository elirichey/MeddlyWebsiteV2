import { useEffect, useState } from 'react';

export default function VideoPlayerLoader() {
	const [timer, setTimer] = useState<number>(0);
	const [loadingText, setLoadingText] = useState<string>('BUFFERING');

	useEffect(() => {
		setTimeout(() => {
			switch (timer) {
				case 0:
					setLoadingText('BUFFERING');
					setTimer(1);
					break;
				case 1:
					setLoadingText('BUFFERING.');
					setTimer(2);
					break;
				case 2:
					setLoadingText('BUFFERING..');
					setTimer(3);
					break;
				case 3:
					setLoadingText('BUFFERING...');
					setTimer(0);
					break;
				default:
					setLoadingText('BUFFERING');
					break;
			}
		}, 500);
	}, [timer]);

	return (
		<div className="video-player-loader">
			<p className="video-loading-text">{loadingText}</p>
		</div>
	);
}
