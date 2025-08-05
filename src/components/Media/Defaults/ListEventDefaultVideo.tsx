import Modal from '@/components/Modal/Modal';
import VideoPlayer from '@/components/Player/VideoPlayer/VideoPlayer';
import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import refreshUser from '@/utilities/RefreshUser';
import EventPostHTTP from '@/utilities/http/admin/event-posts';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MediaCard from '../MediaCard';

interface Props {
	eventId: string;
	currentDefault: VideoItem | AudioItem | Sequence;
}

export default function ListEventDefaultVideo(props: Props) {
	const router = useRouter();

	const { eventId, currentDefault } = props;

	const accessToken = getCookie('accessToken');

	const [loading, setLoading] = useState<boolean>(false);
	const [videos, setVideos] = useState<VideoItem[] | AudioItem[] | Sequence[]>([]);
	const [totalVideos, setTotalVideos] = useState<number>(0);
	const [selectedVideo, setSelectedVideo] = useState<VideoItem | AudioItem | Sequence | null>(null);

	const getEventDefaultVideos = async () => {
		setLoading(true);
		try {
			const res: any = await EventPostHTTP.getEventDefaultVideos(eventId, accessToken || '');

			if (res.status === 200) {
				setVideos(res.data.posts);
				setTotalVideos(res.data.totalPosts);
				setTimeout(() => setLoading(false), 750);
			} else if (res.status === 403) {
				await refreshUser(router);
				// await getEventDefaultVideos();
			} else {
				console.error('GetEventDefaultVideos Non-200 Response:', res);
				setTimeout(() => setLoading(false), 750);
			}
		} catch (error) {
			console.error('Error fetching event default videos:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		getEventDefaultVideos();
		return () => controller.abort();
	}, []);

	const hasVideos = videos.length > 0;

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!hasVideos) {
		return <p>No videos available.</p>;
	}

	const defaultIsSelected = currentDefault.id === selectedVideo?.id;
	const videoOrientation =
		selectedVideo?.orientation && selectedVideo?.orientation.toLowerCase() === 'portrait'
			? '1080p Vertical'
			: '1080p Horizontal';

	return (
		<>
			<div className="default-media-title">
				<p>Default Video</p>
			</div>

			<div className="list-default-sources">
				{videos.map((video: any, i: number) => {
					return (
						<>
							<MediaCard post={video} onClick={(x) => setSelectedVideo(x)} key={video.id} />
						</>
					);
				})}
			</div>

			{/** VIDEO PLAYER MODAL **/}
			{selectedVideo ? (
				<Modal
					id="video-player-modal"
					show={!!selectedVideo}
					close={() => setSelectedVideo(null)}
					size={videoOrientation}
				>
					<VideoPlayer post={selectedVideo} />
				</Modal>
			) : null}
		</>
	);
}
