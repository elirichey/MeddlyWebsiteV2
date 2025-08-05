// Note: Need to check all places where "HANDLE VANTAGE POINT" is present

import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import Hls from 'hls.js';
import { type RefObject, useEffect, useRef, useState } from 'react';
import VideoPlayerLoader from '../components/VideoPlayerLoader';
import VideoPlayerControls from './VideoPlayerControls';

interface Props {
	post: VideoItem | AudioItem | Sequence;
}

export default function VideoPlayer(props: Props) {
	const { post } = props;

	// Player State
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [buffering, setBuffering] = useState<boolean>(false);

	// ******************** VANTAGE POINT - SETUP ******************** //

	const videoPlayerRef: RefObject<any> = useRef(null);

	// ******************** PLAYER CONTROLS ******************** //

	const playlistUrl = post?.m3u8 || '';
	useEffect(() => {
		let hls: Hls | null = null;

		// Initialize HLS.js and load the playlist if supported
		if (Hls.isSupported()) {
			hls = new Hls();

			// Bind the HLS instance to the video element
			hls.loadSource(playlistUrl);
			hls.attachMedia(videoPlayerRef.current);

			//// Handle buffering events
			//hls.on(Hls.Events.BUFFER_CREATED, () => {
			//  console.log("BUFFER CREATED");
			//  setBuffering(true);
			//});
			//hls.on(Hls.Events.BUFFER_APPENDED, () => {
			//  console.log("BUFFER APPENDED");
			//  setBuffering(false);
			//});

			//// Handle errors
			//hls.on(Hls.Events.ERROR, (event, data) => {
			//  console.error("HLS.js error:", data);
			//});

			// Handle 'timeupdate' event for periodic updates of the current time
			const handleTimeUpdate = () => {
				if (videoPlayerRef.current) {
					console.log('HANDLE TIME UPDATE', videoPlayerRef.current.currentTime);
					setCurrentTime(videoPlayerRef.current.currentTime);
				}
			};

			// Add the 'timeupdate' event listener for periodic updates
			videoPlayerRef.current.addEventListener('timeupdate', handleTimeUpdate);

			return () => {
				if (hls) {
					console.log('HLS DESTROY');
					hls.destroy();
				}
				if (videoPlayerRef.current) {
					console.log('REMOVE EVENT LISTENER');
					videoPlayerRef.current.removeEventListener('timeupdate', handleTimeUpdate);
				}
			};
		}
		if (videoPlayerRef.current.canPlayType('application/vnd.apple.mpegurl')) {
			// If HLS is not supported but the browser can play the playlist natively (Safari)
			videoPlayerRef.current.src = playlistUrl;
		}
	}, []);

	useEffect(() => {
		window.addEventListener('keydown', handleSpacebarPress);
		return () => window.removeEventListener('keydown', handleSpacebarPress);
	});

	const handleSpacebarPress = (e: any) => {
		if (e.code === 'Space') playOrPause();
		if (e.code === 'KeyF') toggleScreenView();
	};

	const playOrPause = async () => {
		if (isPlaying) pauseMedia();
		else await playMedia();
	};

	const pauseMedia = () => {
		setIsPlaying(false);
		videoPlayerRef.current.pause();
	};

	const playMedia = async () => {
		setBuffering(true);
		await videoPlayerRef.current.play();
		setBuffering(false);
		setIsPlaying(true);
	};

	const setPlayerTime = async ({ target }: any) => {
		const initialPlayStateIsPlaying = isPlaying;
		if (target?.value) {
			if (initialPlayStateIsPlaying) pauseMedia();
			const newTime = Number.parseFloat(target?.value);
			setCurrentTime(newTime);
			videoPlayerRef.current.currentTime = newTime;
			if (initialPlayStateIsPlaying) await playMedia();
		}
	};

	// *************** PLAYBACK TIMELINE & SYNCING *************** //

	useEffect(() => {
		const updateCurrentTime = () => {
			const current = videoPlayerRef.current;
			if (current) setCurrentTime(current.currentTime);
		};

		const interval = setInterval(updateCurrentTime, 500);
		return () => clearInterval(interval);
	}, []);

	// ******************** RENDER ******************** //

	const [isFullScreen, setIsFullScreen] = useState(false);
	const toggleScreenView = () => {
		setIsFullScreen(!isFullScreen);
		const videoContainer: any = document.getElementById('video-player');
		if (document.fullscreenElement) document.exitFullscreen();
		else if (document.fullscreenElement) {
			document.exitFullscreen(); // Need this to support Safari
		} else if (videoContainer.requestFullscreen) {
			videoContainer.requestFullscreen(); // Need this to support Safari
		} else videoContainer.requestFullscreen();
	};

	return (
		<div id="video-player">
			{post?.m3u8 ? (
				<>
					<video
						ref={videoPlayerRef}
						id="video-player-video"
						className={buffering ? 'video-player-video low-opacity' : 'video-player-video'}
						controlsList="nodownload"
						onContextMenu={() => false}
						preload="true"
						autoPlay={false}
						controls={false}
					>
						<source src={playlistUrl} type={playlistUrl !== '' ? 'application/x-mpegURL' : 'video/mp4'} />
						<p>Your browser doesn't support HTML video</p>
					</video>

					{/* Custom Controls */}
					<div className="video-player-body">
						<div
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									playOrPause();
								}
							}}
							className="video-player-void"
							onClick={playOrPause}
						>
							{buffering ? <VideoPlayerLoader /> : null}
						</div>

						<VideoPlayerControls
							isPlaying={isPlaying}
							playOrPause={playOrPause}
							videoSrc={post}
							currentTime={currentTime}
							setPlayerTime={setPlayerTime}
							isFullScreen={isFullScreen}
							toggleScreenView={toggleScreenView}
							buffering={buffering}
						/>
					</div>
				</>
			) : (
				<p className="no-video-notice">No Video Set</p>
			)}
		</div>
	);
}
