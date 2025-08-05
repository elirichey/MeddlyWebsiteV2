// Note: Need to check all places where "HANDLE VANTAGE POINT" is present

import type { PackageItem } from '@/interfaces/Package';
import { type RefObject, useEffect, useRef, useState } from 'react';
import VideoPlayerLoader from '../components/VideoPlayerLoader';
import VantagePlayerControls from './VantagePlayerControls';

type EventPost = typeof eventPost;
let eventPost: any | null;

type EventPosts = typeof eventPosts;
let eventPosts: [];

interface Props {
	viewPackage: PackageItem;
}

export default function VantagePlayer(props: Props) {
	const { viewPackage } = props;

	useEffect(() => {
		getAllVideosAndSetMainVideo();
	}, []);

	// Initalization
	const [packageVideos, setPackageVideos] = useState<EventPosts>([]);
	const [availableVideos, setAvailableVideos] = useState<EventPosts>([]);
	const [defaultVideo, setDefaultVideo] = useState<EventPost>(null);
	const [currentVideo, setCurrentVideo] = useState<EventPost>(null);
	const [audioSrc, setAudioSrc] = useState<EventPost>(null);

	// Player State
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [buffering, setBuffering] = useState<boolean>(false);

	// ******************** VANTAGE POINT - SETUP ******************** //

	const audioPlayerRef: RefObject<any> = useRef();
	const videoPlayerRef: RefObject<any> = useRef();

	const getAllVideosAndSetMainVideo = async () => {
		const allVideoPosts = viewPackage.packagePosts.filter((x: EventPost) => x.post.type.includes('video'));

		const packageAudio = viewPackage.packagePosts.filter((x: EventPost) => x.post.type.includes('audio'));

		let longestVideo = 0;
		const allVideos: any = [];

		await new Promise((resolve) => {
			allVideoPosts.map((x: EventPost) => {
				if (longestVideo < ++x.post.duration) longestVideo = x.post.duration;
				allVideos.push(x.post);
			});
			return resolve(null);
		});

		const defaultVideo: EventPost = await new Promise((resolve) => {
			return allVideoPosts.map((x: any) => {
				if (longestVideo === x.post.duration) return resolve(x.post);
			});
		});

		setPackageVideos(allVideos);
		setDefaultVideo(defaultVideo);
		console.log('0A. Videos Set');

		if (packageAudio.length > 0) {
			setAudioSrc(packageAudio[0].post);
			console.log('0A. Audio Set');
		} else console.log('No Audio Feed To Set');
	};

	// ******************** PLAYER CONTROLS ******************** //

	useEffect(() => {
		window.addEventListener('keydown', handleSpacebarPress);
		return () => window.removeEventListener('keydown', handleSpacebarPress);
	});

	const handleSpacebarPress = (e: any) => {
		if (e.code === 'Space') playOrPause();
		if (e.code === 'KeyF') toggleScreenView();
		if (e.code === 'KeyV' && availableVideos.length > 0) selectRandomVideo();
	};

	const playOrPause = async () => {
		if (isPlaying) pauseMedia();
		else await playMedia();
	};

	const pauseMedia = () => {
		setIsPlaying(false);
		setShouldCheckSync(true);
		audioPlayerRef.current.pause();
		videoPlayerRef.current.pause();
	};

	const playMedia = async () => {
		setShouldCheckSync(true);
		setBuffering(true);
		await videoPlayerRef.current.play();
		setBuffering(false);
		await audioPlayerRef.current.play();
		setIsPlaying(true);
	};

	const setPlayerTime = async ({ target }: any) => {
		if (target?.value) {
			pauseMedia();
			setCurrentTime(Number.parseFloat(target?.value));

			// HANDLE VANTAGE POINT
			const currentSrc = currentVideo ? currentVideo.src1080p : defaultVideo.src1080p;

			await resetPlayer(currentSrc);

			audioPlayerRef.current.currentTime = target?.value;
			await syncAudioAndVideoSources();
		}
	};

	const selectRandomVideo = async () => {
		pauseMedia();

		// Stop browser from continuing to load cached video sources

		const selections: any = availableVideos.filter((x: EventPost) => x.id !== defaultVideo.id);
		if (!currentVideo || currentVideo.id !== selections[0].id) {
			const newVideo = selections[0];
			await resetPlayer(newVideo.src1080p);
			setCurrentVideo(newVideo);
		} else {
			await resetPlayer(defaultVideo.src1080p);
			setCurrentVideo(null);
		}

		// Triggers useEffect below that calls syncAudioAndVideoSources()
	};
	useEffect(() => {
		if (audioSrc && defaultVideo) syncAudioAndVideoSources();
	}, [currentVideo]);

	const syncAudioAndVideoSources = async () => {
		// Start reset Trigger, triggers useEffect below that calls startReset
		const audioChannel = audioPlayerRef.current;
		const addMS: number = audioChannel.currentTime * 1000;
		const currentMSTimestamp = Number.parseInt(audioSrc.tsStart) + addMS;

		let videoStartTime: number;
		if (currentVideo) videoStartTime = Number.parseInt(currentVideo.tsStart);
		else videoStartTime = Number.parseInt(defaultVideo.tsStart);

		const sourceDiff = currentMSTimestamp - videoStartTime;
		const secondsDifference = sourceDiff / 1000;

		/*
    const source = currentVideo ? currentVideo : defaultVideo;
    console.log("CurrentVideo::::::::", source.src1080p);
    console.log("CurrentAudiotime::::", currentMSTimestamp);
    console.log('CurrentVideoTime::::', sourceDiff)
    console.log("SecondsDifference:::", secondsDifference);
    console.log(null);
    */

		// HANDLE VANTAGE POINT
		const currentSrc = currentVideo ? currentVideo.src1080p : defaultVideo.src1080p;
		await resetPlayer(currentSrc);

		const videoChannel = videoPlayerRef.current;
		// console.log("VideoRef", videoChannel.currentSrc);
		// videoChannel.currentSrc = "";
		videoChannel.load();

		if (videoChannel) videoChannel.currentTime = secondsDifference;

		await playMedia();
	};
	const [resetVideoPlayer, setResetVideoPlayer] = useState(false);

	// This is needed to stop browser from continuing to load cached video sources
	// Confirmed: Code below works exactly as expected
	// Problem  : Doesn't clear video from the cache queue like expected
	//            Still has memory issue
	const resetPlayer = async (videoSrc: string) => {
		const video: any = document.getElementById('video-player-video');
		const videoChannel = videoPlayerRef.current;
		// Empty Source
		// console.log("Video 0:", video.querySelectorAll('[type="video/mp4"'));

		await new Promise((resolve) => {
			video?.querySelectorAll('[type="video/mp4"]')[0].remove(); // Empty video's video source
			videoChannel.load(); // Reload video
			// console.log("Video 1:", video.querySelectorAll('[type="video/mp4"'));
			return resolve(null);
		});

		// Add new Source
		return await new Promise((resolve) => {
			const newVideoSource = document.createElement('source');
			newVideoSource.src = videoSrc;
			newVideoSource.type = 'video/mp4';
			video.appendChild(newVideoSource);

			videoChannel.load(); // Reload video

			// console.log("Video 2A:", video.querySelectorAll('[type="video/mp4"'));
			// console.log("Video 2B:", videoChannel);
			return resolve(null);
		});
	};

	// *************** PLAYBACK TIMELINE & SYNCING *************** //

	const [shouldCheckSync, setShouldCheckSync] = useState(false);

	const syncMediaSources = () => {
		// HANDLE VANTAGE POINT - THIS IS WRONG... Should sync video to proper timestamp

		const audioChannel = audioPlayerRef.current;
		const videoChannel = videoPlayerRef.current;
		if (videoChannel) videoChannel.currentTime = audioChannel.currentTime;

		setShouldCheckSync(false);
	};

	const checkAvailableSources = () => {
		const audioChannel = audioPlayerRef.current;
		const addMS: number = audioChannel.currentTime * 1000;
		const currentMSTimestamp = Number.parseInt(audioSrc.tsStart) + addMS;

		const currentlyAvailable: any = packageVideos.filter((x: EventPost) => {
			const startTime = Number.parseInt(x.tsStart);
			const endTime = Number.parseInt(x.tsEnd);
			const notDefaultVideo = x.id !== defaultVideo.id;

			const response = startTime < currentMSTimestamp && currentMSTimestamp < endTime && notDefaultVideo;

			return response;
		});

		return currentlyAvailable;
	};

	const updatePlaybackProgress = () => {
		const audioChannel = audioPlayerRef.current;
		if (audioChannel) setCurrentTime(audioChannel.currentTime);

		// Check for available vantage points
		const currentlyAvailable = checkAvailableSources();
		const hasSources = currentlyAvailable.length > 0;
		const currentSourcesInclude = currentlyAvailable.includes(currentVideo);
		if (hasSources) setAvailableVideos(currentlyAvailable);
		else setAvailableVideos([]);
		if (!currentSourcesInclude && currentVideo) setCurrentVideo(null);
	};

	useEffect(() => {
		if (shouldCheckSync) syncMediaSources();
	}, [shouldCheckSync]);

	useEffect(() => {
		syncMediaSources();
		let playInterval: any;
		if (isPlaying) {
			playInterval = setInterval(updatePlaybackProgress, 100);
		} else () => clearInterval(playInterval);
		return () => clearInterval(playInterval);
	}, [isPlaying]);

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

	const returnVideoSource = () => {
		if (defaultVideo) {
			if (availableVideos.length > 0 && currentVideo) {
				const { src, src1080p, src720p } = currentVideo;
				return src1080p;
			}
			const { src, src1080p, src720p } = defaultVideo;
			return src1080p;
		}
		console.log('No Video Set');
		return null;
	};

	if (defaultVideo) {
		return (
			<div id="video-player">
				{returnVideoSource() ? (
					<video
						ref={videoPlayerRef}
						id="video-player-video"
						className={buffering ? 'video-player-video low-opacity' : 'video-player-video'}
						controlsList="nodownload"
						onContextMenu={() => false}
						preload="true"
						autoPlay={false}
						controls={false}
						muted={true}
					>
						<source src={returnVideoSource()} type="video/mp4" />

						{audioSrc ? (
							<audio ref={audioPlayerRef} controls={false} muted={false}>
								<source src={audioSrc.src} type="audio/mpeg" />
							</audio>
						) : null}

						<p>Your browser doesn't support HTML video</p>
					</video>
				) : null}

				{/* Custom Controls */}
				<div className="video-player-body">
					<div className="video-player-void" onClick={playOrPause} onKeyDown={playOrPause}>
						{buffering ? <VideoPlayerLoader /> : null}
					</div>

					<VantagePlayerControls
						isPlaying={isPlaying}
						playOrPause={playOrPause}
						audioSrc={audioSrc}
						currentTime={currentTime}
						setPlayerTime={setPlayerTime}
						isFullScreen={isFullScreen}
						availableVideos={availableVideos}
						toggleVantagePoint={selectRandomVideo}
						toggleScreenView={toggleScreenView}
						buffering={buffering}
					/>
				</div>
			</div>
		);
	}
	return null;
}
